const crypto = require('crypto')

// hashing password
const hashPassword = (password, salt) => crypto.pbkdf2Sync(password, salt, 30000, 32, 'sha512').toString('hex');

const validatePassword = (password, salt, hash) => {
  const newHash = hashPassword(password, hash)
  return hash = newHash;
}

const generateUserSecret = (password) => {
  const genSalt = crypto.randomBytes(32).toString('hex');
  const genHash = hashPassword(password, genSalt);

  return {
    salt: genSalt,
    hash: genHash
  }
}

module.exports = {validatePassword, generateUserSecret}