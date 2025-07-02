// backend/server.js
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Conexão com banco de dados
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

// Função para gerar token
function gerarToken(usuarioId) {
  // eslint-disable-next-line no-undef
  return jwt.sign({ id: usuarioId }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
}

// Middleware para proteger rotas
function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token ausente" });

  // eslint-disable-next-line no-undef
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.usuarioId = decoded.id;
    next();
  });
}

// Login com Google
app.post("/api/usuarios/google", (req, res) => {
  const { nome, email, photo } = req.body;

  if (!nome || !email || !photo) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Erro no banco de dados" });

      if (results.length > 0) {
        const token = gerarToken(results[0].id);
        return res.status(200).json({ status: "login", user: results[0], token });
      }

      connection.query(
        "INSERT INTO users (nome, email, photo) VALUES (?, ?, ?)",
        [nome, email, photo],
        (err2, result2) => {
          if (err2) return res.status(500).json({ error: "Erro ao cadastrar usuário" });

          const novoUsuario = { id: result2.insertId, nome, email, photo };
          const token = gerarToken(novoUsuario.id);
          return res.status(201).json({ status: "cadastrado", user: novoUsuario, token });
        }
      );
    }
  );
});

// Cadastro manual
app.post("/api/usuarios/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const hashed = await bcrypt.hash(senha, 10);

  connection.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no banco de dados" });
    if (results.length > 0) return res.status(400).json({ error: "Email já cadastrado" });

    connection.query(
      "INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hashed],
      (err2, result2) => {
        if (err2) return res.status(500).json({ error: "Erro ao cadastrar" });

        const token = gerarToken(result2.insertId);
        return res.status(201).json({
          status: "cadastrado",
          user: { id: result2.insertId, nome, email },
          token,
        });
      }
    );
  });
});

// Login manual
app.post("/api/usuarios/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  connection.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no banco de dados" });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    const user = results[0];
    const senhaCorreta = await bcrypt.compare(senha, user.senha);

    if (!senhaCorreta) return res.status(401).json({ error: "Senha incorreta" });

    const token = gerarToken(user.id);
    res.status(200).json({ status: "logado", user, token });
  });
});

// Rota protegida: buscar usuário autenticado
app.get("/api/usuarios/me", autenticar, (req, res) => {
  const id = req.usuarioId;

  connection.query(
    "SELECT id, nome, email, photo FROM users WHERE id = ?",
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Erro ao buscar usuário" });
      if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });
      res.status(200).json({ user: results[0] });
    }
  );
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
