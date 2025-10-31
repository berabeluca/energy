const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database("eenergy.db");

db.run(`CREATE TABLE IF NOT EXISTS leituras (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  corrente REAL,
  potencia REAL,
  consumo REAL,
  custo REAL,
  rele_estado INTEGER,
  data_hora DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post("/api/dados", (req, res) => {
  const { corrente, potencia, consumo, custo, rele_estado } = req.body;
  db.run(
    `INSERT INTO leituras (corrente, potencia, consumo, custo, rele_estado)
     VALUES (?, ?, ?, ?, ?)`,
    [corrente, potencia, consumo, custo, rele_estado],
    (err) => {
      if (err) {
        console.error(err.message);
        res.status(500).send("Erro ao salvar dados");
      } else {
        res.send("OK");
      }
    }
  );
});

app.get("/api/leituras", (req, res) => {
  db.all("SELECT * FROM leituras ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.json(rows);
    }
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
