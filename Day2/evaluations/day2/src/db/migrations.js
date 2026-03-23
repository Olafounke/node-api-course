const db = require('./connection');


function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      nom       TEXT    NOT NULL,
      email     TEXT    NOT NULL UNIQUE,
      password  TEXT    NOT NULL,
      role      TEXT    NOT NULL DEFAULT 'user',
      createdAt TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS livres (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      titre       TEXT    NOT NULL,
      auteur      TEXT    NOT NULL,
      annee       INTEGER,
      genre       TEXT,
      disponible  INTEGER NOT NULL DEFAULT 1,
      createdAt   TEXT    NOT NULL DEFAULT (datetime('now')),
      updatedAt   TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS emprunts (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      livreId   INTEGER NOT NULL REFERENCES livres(id) ON DELETE CASCADE,
      userId    INTEGER NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
      dateEmprunt TEXT  NOT NULL DEFAULT (datetime('now')),
      dateRetour  TEXT
    );
  `);
  
  console.log('Migrations exécutées avec succès');
}

module.exports = runMigrations;
