require('dotenv').config();
const { Groq } = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function gerarSugestoes(livrosBase) {
  const prompt = `
Sugira 5 livros (apenas 5 livros) semelhantes aos seguintes:
${livrosBase.map((l, i) => `${i + 1}. ${l.title}, ${l.author}`).join('\n')}
Considere gênero, estilo de escrita e público-alvo.
Retorne apenas JSON no seguinte formato:
[
  { "title": "...", "author": "..." },
  ...
]
`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: "Você é um especialista em literatura." },
      { role: "user", content: prompt }
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7
  });

  // A resposta do modelo deve ser JSON; tentamos parsear
  try {
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error("Erro ao parsear resposta do Groq:", err);
    return [];
  }
}

module.exports = { gerarSugestoes };
