require('dotenv').config();
const config = require('./src/config/env');
const app = require('./app');


app.get('/', (req, res) => {
  res.json({ message: "Bienvenue sur l'API Bibliothèque !" });
});

app.listen(config.PORT, () => {
  console.log(`Serveur démarré en mode ${config.NODE_ENV} sur http://localhost:${config.PORT}`);
  console.log(`Documentation Swagger disponible sur : http://localhost:${config.PORT}/api/docs`);
});

