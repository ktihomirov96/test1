const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const session = require("express-session");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

const db = new sqlite3.Database("./db.sqlite");

// Таблица оферти
db.run(`CREATE TABLE IF NOT EXISTS offers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  project TEXT, client TEXT, matrix TEXT, description TEXT,
  deadline TEXT, price TEXT, urgency TEXT
)`);

// Таблица чат
db.run(`CREATE TABLE IF NOT EXISTS chat (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT, message TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Таблица склад
db.run(\`CREATE TABLE IF NOT EXISTS stock (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  matrix TEXT, detail TEXT, quantity INTEGER
)\`);

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "1234") {
    req.session.loggedIn = true;
    res.redirect("/");
  } else res.send("Invalid login");
});

app.get("/", (req, res) => {
  if (!req.session.loggedIn) return res.sendFile(path.join(__dirname, "public/login.html"));
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.post("/add-offer", (req, res) => {
  const { project, client, matrix, description, deadline, price, urgency } = req.body;
  db.run(`INSERT INTO offers (project, client, matrix, description, deadline, price, urgency)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [project, client, matrix, description, deadline, price, urgency], () => res.redirect("/"));
});

app.post("/add-stock", (req, res) => {
  const { matrix, detail, quantity } = req.body;
  db.run(\`INSERT INTO stock (matrix, detail, quantity) VALUES (?, ?, ?)\`, [matrix, detail, quantity], () => res.redirect("/"));
});

app.listen(10000, () => console.log("Server running on port 10000"));