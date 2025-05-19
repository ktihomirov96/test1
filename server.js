
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const db = new sqlite3.Database('./offers.db');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Създаване на таблицата
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project TEXT,
    client TEXT,
    description TEXT,
    deadline TEXT,
    price REAL
  )`);
});

// Основна страница
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// Добавяне на оферта
app.post("/add-offer", (req, res) => {
  const { project, client, description, deadline, price } = req.body;
  db.run("INSERT INTO offers (project, client, description, deadline, price) VALUES (?, ?, ?, ?, ?)",
    [project, client, description, deadline, price],
    function (err) {
      if (err) return res.status(500).send("Грешка при запис");
      res.send({ success: true, id: this.lastID });
    });
});

// Извличане на оферти
app.get("/offers", (req, res) => {
  db.all("SELECT * FROM offers", (err, rows) => {
    if (err) return res.status(500).send("Грешка при четене");
    res.json(rows);
  });
});

app.listen(process.env.PORT || 3000, () => console.log("Сървърът работи на порт 3000"));
