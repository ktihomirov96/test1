
const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// SQLite DB в /tmp
const dbPath = path.join('/tmp', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Създаване на таблица ако не съществува
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS offers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        project TEXT,
        client TEXT,
        description TEXT,
        deadline TEXT,
        price TEXT
    )`);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// API за получаване на оферти
app.get('/api/offers', (req, res) => {
    db.all("SELECT * FROM offers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API за добавяне на оферта
app.post('/api/offers', (req, res) => {
    const { project, client, description, deadline, price } = req.body;
    db.run("INSERT INTO offers (project, client, description, deadline, price) VALUES (?, ?, ?, ?, ?)",
        [project, client, description, deadline, price],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID });
        });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сървърът работи на порт ${PORT}`);
});
