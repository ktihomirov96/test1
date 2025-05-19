const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// База в /tmp за съвместимост с Render
const dbPath = '/tmp/database.db';
const db = new sqlite3.Database(dbPath);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS offers (id INTEGER PRIMARY KEY, project TEXT, client TEXT)");
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/add', (req, res) => {
    const { project, client } = req.body;
    db.run("INSERT INTO offers (project, client) VALUES (?, ?)", [project, client], (err) => {
        if (err) {
            return res.send("Грешка при добавяне");
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log("Сървърът работи на порт " + PORT);
});