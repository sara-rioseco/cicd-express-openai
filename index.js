const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor Express funcionando correctamente');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.get('/status', (req,res) => {
  res.json({status: 'ok', timestamp: new Date() });
});

const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

app.post('/chat', async (req,res) => {
  const { pregunta } = req.body;
  if ( !pregunta || typeof pregunta !== 'string' || pregunta.trim() === '') {
    return res.status(400).json({error: 'La pregunta no debe estar vacía'});
  }
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [ {role: 'user', content: pregunta }],
      max_tokens: 100,
    })
    const answer = response.choices[0].message.content;
    res.json({respuesta:answer})
  } catch (err) {
    console.error.apply('Error al obtener la respuesta de OpenAI:', err);
    res.status(500).json({error: 'Error al obtener la respuesta de OpenAI'});
  }
})