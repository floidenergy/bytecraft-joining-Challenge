const { Express, request, response } = require('express')
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { version } = require('../package.json')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tasks App API',
      version: version,
      description: 'a bytecraft club joining back-end challenge',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    "./routers/*.js",
    "./utils/*.js",
    "./controllers/*.js"
  ]
}

const swaggerSpec = swaggerJsdoc(options)

const swaggerDocs = (app, port) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get('/docs.json', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  })

  console.log(`Docs are available at http://localhost:${port}/docs`)
}

module.exports = swaggerDocs;