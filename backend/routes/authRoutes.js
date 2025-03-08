const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db"); // Conexão com o banco de dados
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// Rota de cadastro
router.post("/register", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    // Verifica se o e-mail já está cadastrado
    const [existingUser] = await db.promise().query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    // Insere no banco
    await db.promise().query(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hashedPassword]
    );

    res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota de login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const user = rows[0]; // Capturando o primeiro usuário

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword) {
      return res.status(400).json({ error: "E-mail ou senha incorretos." });
    }

    const token = jwt.sign(
      { id: user.id, permissao: user.permissao },
      process.env.JWT_SECRET,
      { expiresIn: "1h", algorithm: "HS256" } // Melhor segurança no token
    );

    res.json({ message: "Login bem-sucedido!", token });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota protegida: obter informações do usuário autenticado
router.get("/user", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      "SELECT id, nome, email, permissao FROM usuarios WHERE id = ?",
      [req.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

module.exports = router;
