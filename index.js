const express = require('express');
const cors = require('cors');
const booksRoutes = require('./src/api/books');
const sugestoesRoutes = require('./src/api/sugestoes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/sugestoes', sugestoesRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
