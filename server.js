
require('dotenv').config()

const express = require("express")
const https = require("https")
const fs = require('fs')
const path = require("path")
const mongoose = require("mongoose")


const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser')

// routes and middelwares
const errorHandler = require('./controllers/erroreHandler');
const JwtValidator = require('./controllers/jwtValidator')
const AuthRouter = require('./routers/AuthRouter');
const TasksRouter = require('./routers/TasksRouter')

const tryCatch = require('./utils/tryCatch')
const swagger = require('./utils/swagger')

const server = express();

server.use(express.json())
server.use(express.urlencoded({extended: false}))
server.use(cookieParser());

server.use(cors({origin: process.env.ALLOWED_ORIGIN.split(', '), credentials: true}))
server.use(morgan('dev'))



// authentification related (register/login/logout)
server.use('/auth', AuthRouter)

// creating req.user if there is a valid token in the cookie
server.use(tryCatch(JwtValidator))

// Tasks Realated router (get users task/ submit a task/ edit a task/ delete a task)
server.use('/task', TasksRouter)

server.get('/', (req, res, next) => res.status(200).send(`Welcome to my supper dupper todo app API <a href="/docs">read docs here</a>`))

// Error Handler
server.use(errorHandler);

mongoose.connect(process.env.DB_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'bytecraft_Challenge'
}).then(() => {
  console.log("Connected to MongoDB!")
  server.listen(3000, () => {
    console.log(`Server is running on port 3000`)
    swagger(server, 3000)
  })
})