import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'
dotenv.config()

const app = express()

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Amigo Pet API - Docs',
      version: '1.0.0'
    }
  },
  // In a learning repo we point to example files (can be extended)
  apis: ['./**/*.js']
}

const openapiSpecification = swaggerJsdoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))

app.get('/', (req, res) => res.json({ msg: 'Swagger UI available at /docs' }))

if (process.env.PORT) {
  const port = process.env.PORT || 3500
  app.listen(port, () => console.log(`Docs server listening on ${port}`))
}

export default app
