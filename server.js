
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const http = require('http');
const WebSocket = require('ws');

app.use(express.static(__dirname));
app.use(express.json());

const db = new sqlite3.Database('./data.db');

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
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    text TEXT,
    timestamp TEXT
  )`);
});

app.get('/api/messages', (req, res) => {
  db.all("SELECT * FROM messages ORDER BY id DESC LIMIT 50", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.reverse());
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(data) {
    try {
      const msg = JSON.parse(data);
      if (!msg.username || !msg.text) return;
      const timestamp = new Date().toISOString();
      db.run("INSERT INTO messages (username, text, timestamp) VALUES (?, ?, ?)",
        [msg.username, msg.text, timestamp]);

      const payload = JSON.stringify({ username: msg.username, text: msg.text, timestamp });
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(payload);
        }
      });
    } catch (e) {
      console.error("WS error:", e.message);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ WebSocket + сървър работи на порт ${PORT}`);
});


app.post('/api/offers', (req, res) => {
  const o = req.body;
  console.log("➡️ POST /api/offers received:", o);
  db.run(`INSERT INTO offers (project, matrixNo, client, description, dueDate, price, email, priority, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image],
    (err) => {
      if (err) {
        console.error("❌ DB error:", err.message);
        res.status(500).json({ error: err.message });
      } else {
        res.json({ success: true });
      }
    });
});

app.get('/api/offers', (req, res) => {
  db.all("SELECT * FROM offers ORDER BY id DESC LIMIT 100", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});


app.delete('/api/offers/:id', (req, res) => {
  db.run("DELETE FROM offers WHERE id = ?", [req.params.id], function(err) {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});

app.put('/api/offers/:id', (req, res) => {
  const o = req.body;
  db.run(`UPDATE offers SET project=?, matrixNo=?, client=?, description=?, dueDate=?, price=?, email=?, priority=?, image=?
          WHERE id=?`,
    [o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image, req.params.id],
    function(err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ success: true });
    });
});
