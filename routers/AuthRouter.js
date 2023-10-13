const {Router} = require('express') 

const {Register, Login} = require('../controllers/Authentification')
const tryCatch = require('../utils/tryCatch')

const AuthRouter = Router()

AuthRouter
  .post('/register', tryCatch(Register))

AuthRouter
  .post('/login', tryCatch(Login))

module.exports = AuthRouter