require('dotenv').config();
const express = require('express');
const config = require('./src/config/env');
const authRoutes = require('./src/routes/auth');
const bookRoutes = require('./src/routes/books')

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/livres', bookRoutes);

app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API Bibliothèque !" });
});

app.listen(config.PORT, () => {
  console.log(`Serveur démarré en mode ${config.NODE_ENV} sur http://localhost:${config.PORT}`);
});

