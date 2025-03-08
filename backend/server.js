require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const authRoutes = require("./routes/authRoutes");
const db = require("./db"); // Importando o pool de conexões
const path = require("path"); // Para trabalhar com caminhos de arquivos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir arquivos estáticos
app.use(express.static("../public"));



// Middleware
app.use(express.json());
app.use(cors());

// Função para gerar o token JWT
const generateToken = (userId, permissao) => {
  return jwt.sign({ userId, permissao }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Rota de login (para gerar token JWT)
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Buscar o usuário no banco de dados
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err) {
      return res.status(500).send("Erro no servidor");
    }

    const user = results[0];

    if (!user) {
      return res.status(404).send("Usuário não encontrado");
    }

    // Comparar a senha com a criptografada
    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) {
      return res.status(401).send("Credenciais inválidas");
    }

    // Gerar o token JWT
    const token = generateToken(user.id, user.permissao);
    return res.json({ token });
  });
});

// Middleware para verificar o token JWT nas rotas privadas
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Pega o token no header

  if (!token) {
    return res.status(401).send("Token não fornecido");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Token inválido");
    }

    req.userId = decoded.userId;
    req.permissao = decoded.permissao;
    next();
  });
};

// Rota protegida (somente acessível com JWT válido)
app.get("/private", verifyToken, (req, res) => {
  res.send("Acesso permitido a rota privada");
});

// Rotas de autenticação
app.use("/auth", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
