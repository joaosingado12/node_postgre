import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

import authRoutes from './routes/auth.routes.js'
import genericRoutes from './routes/generic.routes.js'

const app = express()

// ==========================================
// 1. HELMET: Proteção de Cabeçalhos HTTP
// ==========================================
// Oculta a tecnologia usada (X-Powered-By) e protege contra XSS e Clickjacking
app.use(helmet())

// ==========================================
// 2. CORS ESTRITO: Bloqueio de Origens
// ==========================================
// Altere a string abaixo para a URL oficial do seu Front-end na Vercel quando publicar
const origensPermitidas = [
    //'https://seu-amigopet.vercel.app', // URL de Produção
    'http://localhost:5173', // Ambiente local
]

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origem (como ferramentas de linha de comando/Postman) 
    // ou requisições que venham da lista permitida
    if (!origin || origensPermitidas.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Acesso bloqueado pela política de CORS.'))
    }
  }
}))

// ==========================================
// 3. RATE LIMIT GLOBAL: Proteção contra DDoS
// ==========================================
// Limita cada IP a 100 requisições a cada 15 minutos
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { erro: 'Volume anormal de requisições. Tente novamente mais tarde.' },
  standardHeaders: true, 
  legacyHeaders: false,
})

app.use(limiterGlobal)
app.use(express.json())

// ==========================================
// 4. ROTEAMENTO
// ==========================================
app.use(authRoutes)
app.use(genericRoutes)

const PORTA = process.env.PORT || 3200

app.listen(PORTA, () => {
  console.log(`Servidor blindado e rodando na porta ${PORTA}`)
})