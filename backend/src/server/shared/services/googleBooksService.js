const axios = require('axios');

/**
 * Busca livros na Google Books API por termo ou título + autor.
 * @param {string} title - Título do livro.
 * @param {string} author - Autor do livro (opcional).
 * @returns {Promise<Object[]>} - Lista de livros encontrados.
 */
async function searchBookBySuggestion(title, author = '') {
  const query = `${title} ${author}`.trim();

  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: {
        q: query,
        maxResults: 1  // Retorna apenas o livro mais relevante
      }
    });

    const books = response.data.items || [];
    return books.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || [],
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '',
      publishedDate: item.volumeInfo.publishedDate || ''
    }));
  } catch (err) {
    console.error('Erro ao buscar livro no Google Books:', err.message);
    return [];
  }
}

module.exports = { searchBookBySuggestion };
