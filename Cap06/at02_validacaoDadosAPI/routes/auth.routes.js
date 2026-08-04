import { Router } from 'express'
import { login } from '../controllers/auth.controller.js'
import { validarLogin } from '../middlewares/validacao.middleware.js'

const router = Router()

// O middleware "validarLogin" bloqueia requisições malformadas antes de bater no banco de dados
router.post('/login', validarLogin, login)

export default router