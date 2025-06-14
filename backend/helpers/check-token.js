const jwt = require("jsonwebtoken");
const getUserByToken = require("../helpers/get-user-by-token"); // se você quiser reutilizar
const getToken = require("../helpers/get-token");

const checkToken = async (req, res, next) => {
  const token = getToken(req);

  if (!token) return res.status(401).json({ message: "Acesso negado!" });

  try {
    const user = await getUserByToken(token);
    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado!" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ message: "O Token é inválido!" });
  }
};

module.exports = checkToken;