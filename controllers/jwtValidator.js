const jwt = require('jsonwebtoken')
const taskAppError = require('../utils/errorClass')

const User = require('../models/user')

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader?.split(' ')[1];

  if (token == null) return next()

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN,
    async (err, decoded) => {
      if (!decoded || err) {
        return next();
      } else {
        req.user = await User.findById(decoded.userID)
        next()
      }
    }
  )

}