const jwt = require('jsonwebtoken')
const taskAppError = require('../utils/errorClass')

const User = require('../models/user')
const { generateUserSecret, validatePassword } = require('../utils/passwordUtils')

/**
 * @openapi
 * /auth/register:
 *  post:
 *    tags:
 *    - Authentification
 *    description: Creating a new user in database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '400': 
 *          description: Bad Request, Couldn't Register User
 *      '406':
 *          description: Not Acceptable, Username Already exist
 *      '201':
 *          description: Ok, User Registered Successfuly
 *          
 */
const Register = async (req, res, next) => {

  const { username, password } = req.body;

  const usernameExist = await User.findOne({ username })
  if (usernameExist)
    throw new taskAppError(406, "Not Acceptable, Username Already exist")

  const secret = generateUserSecret(password)
  const user = new User({
    username,
    hash: secret.hash,
    salt: secret.salt
  })

  const result = await user.save();

  if (!result)
    throw new taskAppError(401, 'Couldn\'t Register User')

  res.status(201).json({
    message: 'User Registered Successfully'
  })
}

/**
 * @openapi
 * /auth/login:
 *  post:
 *    tags:
 *    - Authentification
 *    description: Authenticate User
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      '401': 
 *          description: Unauthorized, Invalid Credentials
 *      '200':
 *          description: Logged In Successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                  token:
 *                    type: string
 *                    description: jwt access token that will expire in 5 minutes
 *                  user:
 *                    type: object
 *                    description: user data
 *                    properties:
 *                      id: 
 *                        type: string
 *                      username: 
 *                        type: string
 */
const Login = async (req, res, next) => {

  const { username, password } = req.body;

  const foundUser = await User.findOne({ username: username });

  if (!foundUser)
    throw new taskAppError(401, "invalid credentials");

  // compare passwords
  const isMatch = validatePassword(password, foundUser.salt, foundUser.hash)

  if (!isMatch)
    throw new taskAppError(401, "invalid credentials");

  const token = jwt.sign({ userID: foundUser.id }, process.env.JWT_ACCESS_TOKEN, { expiresIn: "1d" }); // expire in 5 minutes

  const user = {
    id: foundUser.id,
    username: foundUser.username,
  }

  res.status(200).json({
    message: 'User Logged In Successfully',
    token,
    user: user
  })
}

module.exports = { Register, Login }