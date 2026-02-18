const jwt = require('jsonwebtoken')

const createUserToken = async (user, req, res) => {
  // cria token com id do usuário no payload
  const token = jwt.sign(
    {
      id: user._id,   // 
      name: user.name,
      email: user.email
    },
    'nossosecret',
    { expiresIn: '7d' } // token expira em 7 dias
  )

  // retorna token para o frontend
  res.status(200).json({
    message: 'Você está autenticado!',
    token: token,
    userId: user._id
  })
}

module.exports = createUserToken