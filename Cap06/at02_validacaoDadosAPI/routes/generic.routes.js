import { Router } from 'express'
import * as controller from '../controllers/generic.controller.js'
import { autenticar } from '../controllers/auth.controller.js'
import { validarRequisicao } from '../middlewares/validacao.middleware.js'

const router = Router()

// ==========================================
// ROTAS PÚBLICAS 
// ==========================================

// Cadastro público de usuários (Interceptado pela validação)
router.post('/usuarios', (req, res, next) => {
  req.params.tabela = 'usuario' 
  next()
}, validarRequisicao, controller.criar)

// Vitrine pública de Pets (Não recebe dados no body, não precisa de validação)
router.get('/vitrine', (req, res, next) => {
  req.params.tabela = 'pet' 
  next()
}, controller.listar)


// ==========================================
// ROTAS PROTEGIDAS (Admin - Exigem Token)
// ==========================================

// Injeção do middleware "validarRequisicao" antes da função criar e atualizar
router.post('/:tabela', autenticar, validarRequisicao, controller.criar)
router.get(['/:tabela/:id', '/:tabela'], autenticar, controller.listar)
router.put('/:tabela/:id', autenticar, validarRequisicao, controller.atualizar)
router.delete('/:tabela/:id', autenticar, controller.remover)

export default router