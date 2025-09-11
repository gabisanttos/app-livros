const express = require('express');
const router = express.Router();
const { searchBooks } = require('../../services/googleBooksService');

// GET /api/books?q=termo
router.get('/', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Parâmetro "q" é obrigatório.' });

  try {
    const books = await searchBooks(query);
    res.json(books);
  } catch (err) {
    console.error('Erro ao buscar livros:', err.message);
    res.status(500).json({ error: 'Erro ao buscar livros.' });
  }
});

module.exports = router;
