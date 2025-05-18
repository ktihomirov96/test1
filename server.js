
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Примерен API маршрут за оферти
app.get('/api/offers', (req, res) => {
  res.json([{ project: '001', client: 'ABC Ltd', description: 'Ремонт на матрица', deadline: '2025-06-01', price: '1200 лв', risk: 'Нисък' }]);
});

// Най-важният ред за Render:
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Сървърът стартира на порт ${port}`);
});
