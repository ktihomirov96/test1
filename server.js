
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
app.listen(3000, () => console.log('Сървърът е стартиран на http://localhost:3000'));
