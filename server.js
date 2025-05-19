
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./data.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    projectId TEXT,
    client TEXT,
    matrixId TEXT,
    description TEXT,
    deadline TEXT,
    price INTEGER,
    urgency TEXT
  )`);
});

app.get('/offers', (req, res) => {
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

app.post('/offers', (req, res) => {
  const { projectId, client, matrixId, description, deadline, price, urgency } = req.body;
  db.run(`INSERT INTO offers (projectId, client, matrixId, description, deadline, price, urgency)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [projectId, client, matrixId, description, deadline, price, urgency],
    function(err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => console.log(`Сървърът стартира на порт ${port}`));
