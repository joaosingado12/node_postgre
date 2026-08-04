import { Router } from 'express'

import * as controller from '../controllers/generic.controller.js'
import { autenticar } from '../controllers/auth.controller.js'

const router = Router()

// Cadastro público de usuários
router.post('/usuarios', controller.criar)

// Listagem pública de pets
router.get('/pets', controller.listar)

// Rotas protegidas
router.post('/:tabela', autenticar, controller.criar)
router.get(['/:tabela/:id', '/:tabela'], autenticar, controller.listar)
router.put('/:tabela/:id', autenticar, controller.atualizar)
router.delete('/:tabela/:id', autenticar, controller.remover)

export default router
