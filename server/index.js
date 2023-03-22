require('dotenv/config');
const argon2 = require('argon2');
const express = require('express');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');
const { check, validationResult } = require('express-validator');

const app = express();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(staticMiddleware);

const jsonMiddleware = express.json();

app.use(jsonMiddleware);

app.get('/api/locations/', (req, res) => {
  const category = req.query.category;
  let sql;
  if (category === 'All Categories') {
    sql = `
      select *
        from "locations"
      order by "locationId"
    `;
    db.query(sql)
      .then(result => res.json(result.rows))
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'an unexpected error occurred'
        });
      });
  } else {
    sql = `
      select *
        from "locations"
       where "category" = $1
    order by "locationId"
    `;
    const params = [category];
    db.query(sql, params)
      .then(result => res.json(result.rows))
      .catch(err => {
        console.error(err);
        res.status(500).json({
          error: 'an unexpected error occurred'
        });
      });
  }
});

app.post('/api/auth/sign-up', [
  check('email').trim().escape(),
  check('username').trim().escape(),
  check('password').trim().escape(),

  check('email').notEmpty().withMessage('Email is required.').isEmail().withMessage('Please enter a valid email address.'),
  check('username').notEmpty().withMessage('Username is required.').isAlphanumeric().withMessage('Username must only contain letters or numbers.'),
  check('password').notEmpty().withMessage('Password is required.').isStrongPassword({ minLowercase: 0, minUppercase: 0 }).withMessage('Password does meet requirements.').isLength({ max: 50 }).withMessage('Password length must be between 8-50 characters.')
], (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ClientError(400, 'username, password, and email are required fields');
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  argon2
    .hash(password)
    .then(hashedPw => {
      const sql = `
        insert into "users" ("username", "hashedPassword", "email")
          values ($1, $2, $3)
          returning "userId", "username", "email", "createdAt"
      `;
      const values = [username, hashedPw, email];
      db.query(sql, values)
        .then(newUser => {
          const obj = {
            userId: newUser.rows[0].userId,
            username: newUser.rows[0].username,
            email: newUser.rows[0].email,
            createdAt: newUser.rows[0].createdAt
          };
          res.status(201).json(obj);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

app.post('/api/auth/sign-in', [
  check('username').trim().escape(),
  check('password').trim().escape(),

  check('username').notEmpty().withMessage('Username is required.').isAlphanumeric().withMessage('Invalid username.'),
  check('password').notEmpty().withMessage('Password is required.').isStrongPassword({ minLowercase: 0, minUppercase: 0 }).withMessage('Invalid password.').isLength({ max: 50 }).withMessage('Invalid password.')
], (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'Invalid login.');
  }
  const sql = `
    select "userId",
           "hashedPassword"
      from "users"
     where "username" = $1
  `;
  const params = [username];
  db.query(sql, params)
    .then(result => {
      const [user] = result.rows;
      if (!user) {
        throw new ClientError(401, 'Invalid login.');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'Invalid login.');
          }
          const payload = { userId, username };
          const token = jwt.sign(payload, process.env.TOKEN_SECRET);
          res.json({ token, user: payload });
        });
    })
    .catch(err => next(err));
});

app.use(authorizationMiddleware);

app.post('/api/mylist', (req, res, next) => {
  const { userId } = req.user;
  const { locationId } = req.body;
  const sql = `
    insert into "myListItems" ("userId", "locationId")
    values ($1, $2)
    returning "userId", "locationId", "myListItemsId"
  `;
  const params = [userId, locationId];
  db.query(sql, params)
    .then(result => {
      const [myListItem] = result.rows;
      res.status(201).json(myListItem);
    })
    .catch(err => next(err));
});

app.post('/api/routes', (req, res, next) => {
  const { viewingIds, routeName } = req.body;
  const { userId } = req.user;
  const sql = `
    insert into "routes" ("userId", "routeName")
    values ($1, $2)
    returning "routeId"
  `;
  const params = [userId, routeName];
  db.query(sql, params)
    .then(result => {
      const routeId = result.rows[0].routeId;
      const routeLocationsSql = `
      insert into "routeLocations" ("routeId", "myListItemsId")
        select $1, "myListItemsId"
        from "myListItems"
        where "userId" = $2 AND "locationId" = ANY($3)
        order by array_position($3, "locationId")
        returning *
      `;
      const routeLocationsParams = [routeId, userId, viewingIds];
      return db.query(routeLocationsSql, routeLocationsParams);
    })
    .then(result2 => res.status(201).json(result2.rows))
    .catch(err => next(err));
});

app.delete('/api/mylist/:removeId', (req, res, next) => {
  const removeId = Number(req.params.removeId);
  const sql = `
    delete from "myListItems"
    where "myListItemsId" = $1
    returning *
  `;
  const params = [removeId];
  db.query(sql, params)
    .then(result => {
      const [myListItem] = result.rows;
      res.status(201).json(myListItem);
    })
    .catch(err => next(err));
});

app.delete('/api/routes/:routeId', (req, res, next) => {
  const routeId = Number(req.params.routeId);
  const sql1 = `
    delete from "routeLocations" where "routeId" = $1;
  `;
  const sql2 = `
    delete from "routes" where "routeId" = $1 returning *;
  `;
  const params = [routeId];
  db.query(sql1, params)
    .then(() => db.query(sql2, params))
    .then(result => {
      const [deletedRoute] = result.rows;
      res.status(200).json(deletedRoute);
    })
    .catch(err => next(err));
});

app.get('/api/mylist', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
    select "locationId", "userId", "myListItemsId"
      from "myListItems"
     where "userId" = $1
  `;
  const params = [userId];
  db.query(sql, params)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => next(err));
});

app.get('/api/routes', (req, res, next) => {
  const { userId } = req.user;
  const sql = `
      select "routeId", "routeName", ARRAY_AGG("myListItemsId") as "myListItemsIds"
        from "routes"
        join "routeLocations" USING ("routeId")
       where "userId" = $1
       group by "routeId", "routeName"
       order by "routeId"
      `;
  const params = [userId];
  db.query(sql, params)
    .then(results => {
      res.status(201).json(results.rows);
    })
    .catch(err => next(err));
});

app.put('/api/routes', (req, res, next) => {
  const { userId } = req.user;
  const { routeId } = req.body;
  const { newRouteName } = req.body;
  const sql = `
  update "routes"
    set "routeName" = $1
    where "userId" = $2 AND "routeId" = $3
    returning *
  `;
  const params = [newRouteName, userId, routeId];
  db.query(sql, params)
    .then(result => {
      if (result.rowCount === 0) {
        throw new Error(`Route ${routeId} does not exist or user does not have permission to edit`);
      }
      res.json(result.rows[0]);
    })
    .catch(err => next(err));
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
