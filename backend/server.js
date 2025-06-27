// backend/server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  // eslint-disable-next-line no-undef
  host: process.env.DB_HOST,
  // eslint-disable-next-line no-undef
  user: process.env.DB_USER,
  // eslint-disable-next-line no-undef
  password: process.env.DB_PASSWORD,
  // eslint-disable-next-line no-undef
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados Mysql:", err);
    return;
  }
  console.log("Conexão estabelecida com o banco de dados Mysql");
});

app.post("/api/usuarios/google", (req, res) => {
  const { nome, email, photo } = req.body;

  if (!nome || !email || !photo) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Erro no banco de dados" });
      }

      if (results.length > 0) {
        // Usuário já existe → logar
        return res.status(200).json({ status: "login", user: results[0] });
      }

      // Usuário não existe → cadastrar e logar
      connection.query(
        "INSERT INTO users (nome, email, photo) VALUES (?, ?, ?)",
        [nome, email, photo],
        (err2, result2) => {
          if (err2) {
            return res.status(500).json({ error: "Erro ao cadastrar usuário" });
          }

          const novoUsuario = {
            id: result2.insertId,
            nome,
            email,
            photo,
          };

          return res
            .status(201)
            .json({ status: "cadastrado", user: novoUsuario });
        }
      );
    }
  );
});

app.post("/api/usuarios/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const hashed = await bcrypt.hash(senha, 10);

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Erro no banco de dados" });
      if (results.length > 0)
        return res.status(400).json({ error: "Email já cadastrado" });

      connection.query(
        "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)",
        [nome, email, hashed],
        (err2, result2) => {
          if (err2) return res.status(500).json({ error: "Erro ao cadastrar" });

          return res.status(201).json({
            status: "cadastrado",
            user: { id: result2.insertId, nome, email },
          });
        }
      );
    }
  );
});

app.post("/api/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) return res.status(500).json({ error: "Erro no banco de dados" });
      if (results.length === 0)
        return res.status(404).json({ error: "Usuário não encontrado" });

      const user = results[0];
      const senhaCorreta = await bcrypt.compare(senha, user.senha);

      if (!senhaCorreta)
        return res.status(401).json({ error: "Senha incorreta" });

      res.status(200).json({ status: "logado", user });
    }
  );
});


app.listen(3000, () => {
  console.log("Servidor backend rodando na porta 3000");
});
