
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.static(__dirname));
app.use(express.json()); // body-parser

// DB
const db = new sqlite3.Database('./database.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project TEXT,
    matrixNo TEXT,
    client TEXT,
    description TEXT,
    dueDate TEXT,
    price TEXT,
    email TEXT,
    priority TEXT,
    image TEXT
  )`);
});

// API - get
app.get('/api/offers', (req, res) => {
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) {
      console.error("GET /api/offers error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// API - post
app.post('/api/offers', (req, res) => {
  const o = req.body;
  console.log("POST /api/offers received:", o);
  if (!o.project) {
    return res.status(400).json({ error: "Missing project field" });
  }
  const stmt = db.prepare("INSERT INTO offers (project, matrixNo, client, description, dueDate, price, email, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image, function(err) {
    if (err) {
      console.error("DB insert error:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Сървърът работи на порт ${PORT}`);
});
