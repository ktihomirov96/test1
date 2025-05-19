const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

const db = new sqlite3.Database('./db/database.db');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/offers', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'offers.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});