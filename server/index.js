require('dotenv/config');
const argon2 = require('argon2');
const express = require('express');
const pg = require('pg');
const jwt = require('jsonwebtoken');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const errorMiddleware = require('./error-middleware');
const authorizationMiddleware = require('./authorization-middleware');

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

app.post('/api/auth/sign-up', (req, res, next) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    throw new ClientError(400, 'username, password, and email are required fields');
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

app.post('/api/auth/sign-in', (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw new ClientError(401, 'invalid login');
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
        throw new ClientError(401, 'invalid login');
      }
      const { userId, hashedPassword } = user;
      return argon2
        .verify(hashedPassword, password)
        .then(isMatching => {
          if (!isMatching) {
            throw new ClientError(401, 'invalid login');
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
  const { viewingIds, userId, routeName } = req.body;
  const sql = `
    INSERT INTO "routes" ("userId", "routeName")
    VALUES ($1, $2)
    RETURNING "routeId"
  `;
  const params = [userId, routeName];
  db.query(sql, params)
    .then(result => {
      const routeId = result.rows[0].routeId;
      const routeLocationsSql = `
      INSERT INTO "routeLocations" ("routeId", "myListItemsId")
        SELECT $1, "myListItemsId"
        FROM "myListItems"
        WHERE "userId" = $2 AND "locationId" = ANY($3)
        ORDER BY array_position($3, "locationId")
      `;
      const routeLocationsParams = [routeId, userId, viewingIds];
      return db.query(routeLocationsSql, routeLocationsParams);
    })
    .then(result2 => res.status(201).json({ message: 'Route created successfully', result2 }))
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

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
