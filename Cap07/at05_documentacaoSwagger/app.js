import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import authRoutes from './routes/auth.routes.js'
import genericRoutes from './routes/generic.routes.js'
import imagesRoutes from './routes/images.routes.js'
import swaggerRoutes from './routes/swagger.routes.js'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import { errorHandler } from './middlewares/error.middleware.js'

const app = express()

// Obtém diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuração do CORS - Libera o acesso para o ambiente de desenvolvimento do Vite
app.use(helmet())
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
}))

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Disponibiliza arquivos estáticos
app.use(express.static(path.join(__dirname, 'views')))

// Página inicial pública
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

// Rotas públicas de autenticação
app.use('/', authRoutes)

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Amigo Pet API',
      version: '1.0.0',
      description: 'API de gerenciamento de pets com autenticação, upload de imagens e documentação Swagger.'
    },
    servers: [
      { url: process.env.BASE_URL || 'http://localhost:3500', description: 'Servidor local' }
    ]
  },
  apis: ['./routes/*.js', './controllers/*.js', './docs/swagger.yaml']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Rotas da API
app.use('/', genericRoutes)
app.use('/', imagesRoutes)

// Middleware de tratamento de erro centralizado
app.use(errorHandler)

export default app
