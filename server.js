
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(session({
  secret: 'repair_secret_123',
  resave: false,
  saveUninitialized: true
}));

function protectedRoute(file) {
  return function (req, res) {
    if (req.session.loggedIn) {
      res.sendFile(path.join(__dirname, file));
    } else {
      res.redirect('/login');
    }
  };
}

app.get('/', protectedRoute('index.html'));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'login.html')));
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === '1234') {
    req.session.loggedIn = true;
    res.redirect('/');
  } else {
    res.send('Грешен вход. <a href="/login">Опитай отново</a>');
  }
});
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/login')));
app.get('/clients', protectedRoute('clients.html'));
app.get('/warehouse', protectedRoute('warehouse.html'));
app.get('/ai', protectedRoute('ai.html'));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Работи на порт ' + port));
