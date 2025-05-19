
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 10000;
const db = new sqlite3.Database('data.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matrix TEXT,
    detail TEXT,
    quantity INTEGER
  )`);
});

app.listen(port, () => {
  console.log(`Сървърът работи на порт ${port}`);
});
