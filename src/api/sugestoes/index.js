const express = require('express');
const router = express.Router();
const { gerarSugestoes } = require('../../services/groqService');

const { searchBookBySuggestion } = require('../../services/googleBooksService');

router.post('/', async (req, res) => {
  const livros = req.body.livros;
  if (!livros || livros.length === 0) {
    return res.status(400).json({ error: 'Informe ao menos um livro.' });
  }

  try {
    const sugestoes = await gerarSugestoes(livros); // do Groq
    const livrosDetalhados = [];

    for (const s of sugestoes) {
      const [livroDetalhe] = await searchBookBySuggestion(s.title, s.author);
      if (livroDetalhe) livrosDetalhados.push(livroDetalhe);
    }

    res.json({ sugestoes: livrosDetalhados });
  } catch (err) {
    console.error('Erro ao gerar sugestões:', err.message);
    res.status(500).json({ error: 'Erro ao gerar sugestões.' });
  }
});


module.exports = router;
