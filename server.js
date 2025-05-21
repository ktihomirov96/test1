
const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.db');
const http = require('http');
const server = http.createServer(app);
const WebSocket = require('ws');
const wss = new WebSocket.Server({ server });

app.use(express.static('.'));
app.use(express.json());

// Създаване на таблицата
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
)`, () => {
  // Извикваме email checker чак след създаване на таблицата
  require('./emailNotifier')(db);
});

app.get('/api/offers', (req, res) => {
  db.all("SELECT * FROM offers", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.post('/api/offers', (req, res) => {
  const o = req.body;
  db.run(`INSERT INTO offers (project, matrixNo, client, description, dueDate, price, email, priority, image)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image],
          function(err) {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
          });
});

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    const msg = JSON.parse(message);
    msg.timestamp = new Date().toISOString();
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });
});

server.listen(3000, () => console.log('Сървърът стартира на http://localhost:3000'));

app.put('/api/offers/:id', (req, res) => {
  const o = req.body;
  db.run(`UPDATE offers SET project=?, matrixNo=?, client=?, description=?, dueDate=?, price=?, email=?, priority=?, image=?
          WHERE id=?`,
          [o.project, o.matrixNo, o.client, o.description, o.dueDate, o.price, o.email, o.priority, o.image, req.params.id],
          err => {
            if (err) res.status(500).json({ error: err.message });
            else res.json({ success: true });
          });
});

app.delete('/api/offers/:id', (req, res) => {
  db.run("DELETE FROM offers WHERE id=?", [req.params.id], err => {
    if (err) res.status(500).json({ error: err.message });
    else res.json({ success: true });
  });
});
