
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

// Създаваме или свързваме към база
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

// Зареждане на всички оферти
app.get('/api/offers', (req, res) => {
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Запис на нова оферта
app.post('/api/offers', (req, res) => {
  const o = req.body;
  const stmt = db.prepare("INSERT INTO offers (project, matrixNo, client, description, dueDate, price, email, priority, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID });
  });
  stmt.finalize();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сървърът работи на порт ${PORT}`);
});
