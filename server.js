
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

app.post('/api/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer sk-ВЪВЕДИ_ТУК_ТВОЯ_КЛЮЧ"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        max_tokens: 200
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ reply: "Грешка при свързване с OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Сървърът работи на http://localhost:${port}`);
});
