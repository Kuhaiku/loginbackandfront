const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Acesso negado. Nenhum token fornecido." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Token inválido." });
        }

        req.userId = decoded.id;
        req.userPermissao = decoded.permissao;
        next();
    });
};

module.exports = verifyToken;
