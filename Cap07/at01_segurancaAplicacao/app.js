import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import authRoutes from './routes/auth.routes.js'
import genericRoutes from './routes/generic.routes.js'
import imagesRoutes from './routes/images.routes.js'

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas requisições. Tente novamente mais tarde.' }
})

app.use(helmet())
app.use(limiter)

// Obtém diretório atual
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Configuração do CORS - Libera o acesso para o ambiente de desenvolvimento do Vite
app.use(cors({
  origin: 'http://localhost:5173', // URL padrão do front-end React
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

// Rotas da API
app.use('/', genericRoutes)
app.use('/', imagesRoutes)

export default app
