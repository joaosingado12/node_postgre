import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { login } from '../controllers/auth.controller.js'
import { validarLogin } from '../middlewares/validacao.middleware.js'

const router = Router()

// Limitador agressivo exclusivo para a rota de Login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos de penalidade
  max: 5, // Bloqueia após a 5ª tentativa de login a partir do mesmo IP
  message: { 
    erro: 'Muitas tentativas de login malsucedidas. Por segurança, sua rede foi bloqueada por 15 minutos.' 
  },
  standardHeaders: true,
  legacyHeaders: false
})

// A requisição agora passa pelo Limitador de tentativas -> Validador Zod -> Controller de Login
router.post('/login', loginLimiter, validarLogin, login)

export default router