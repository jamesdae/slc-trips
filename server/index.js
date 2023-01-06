require('dotenv/config');
const express = require('express');
const pg = require('pg');
const staticMiddleware = require('./static-middleware');
const errorMiddleware = require('./error-middleware');
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

app.get('/api/hello', (req, res) => {
  res.json({ hello: 'world' });
});

app.get('/api/locations', (req, res) => {
  const sql = `
    select *
      from "locations"
     order by "locationId"
  `;
  db.query(sql)
    .then(result => {
      res.json(result.rows);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: 'an unexpected error occurred'
      });
    });
});

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  process.stdout.write(`\n\napp listening on port ${process.env.PORT}\n\n`);
});
