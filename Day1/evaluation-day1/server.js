// server.js
const http = require('http');
const router = require('./modules/router');

const PORT = 3000;

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});