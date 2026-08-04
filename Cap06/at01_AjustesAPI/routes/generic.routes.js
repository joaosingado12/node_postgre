import { Router } from 'express'
import * as controller from '../controllers/generic.controller.js'
import { autenticar } from '../controllers/auth.controller.js'

const router = Router()

// ==========================================
// ROTAS PÚBLICAS 
// ==========================================

// Cadastro público de usuários
router.post('/usuarios', (req, res, next) => {
  req.params.tabela = 'usuario' 
  next()
}, controller.criar)

// Vitrine pública de Pets (Lista TODOS os pets do sistema, sem filtro de dono)
router.get('/vitrine', (req, res, next) => {
  req.params.tabela = 'pet' 
  next()
}, controller.listar)


// ==========================================
// ROTAS PROTEGIDAS (Admin - Exigem Token)
// ==========================================

// Quando o React chamar /pet (singular), o Express joga na variável :tabela e aplica as travas
router.post('/:tabela', autenticar, controller.criar)
router.get(['/:tabela/:id', '/:tabela'], autenticar, controller.listar)
router.put('/:tabela/:id', autenticar, controller.atualizar)
router.delete('/:tabela/:id', autenticar, controller.remover)

export default router