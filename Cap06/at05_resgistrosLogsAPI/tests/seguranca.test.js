import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import authRoutes from '../routes/auth.routes.js'

// 1. Falsificação do banco de dados (Model)
// Garantimos que o banco não será sobrecarregado durante o nosso ataque de teste
vi.mock('../config/database.js', () => ({
  default: {
    usuario: { 
      findFirst: vi.fn().mockResolvedValue(null) // Simula que o usuário nunca é encontrado
    }
  }
}))

// 2. Montagem de uma mini-API em memória para o teste
const app = express()
app.use(express.json())
// Injeta as rotas de autenticação (que agora possuem o Rate Limit e o Zod)
app.use(authRoutes)

describe('Testes de Segurança - Defesa contra Força Bruta', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve bloquear o IP com status 429 após 5 tentativas falhas de login', async () => {
    const credenciaisHackers = { email: 'hacker@email.com', senha: 'senha_qualquer' }

    // Dispara 5 requisições seguidas (O limite exato que configuramos no auth.routes.js)
    for (let i = 0; i < 5; i++) {
      const response = await request(app).post('/login').send(credenciaisHackers)
      
      // As 5 primeiras requisições passam pelo segurança, mas falham por credencial inválida
      expect(response.status).toBe(401) 
    }

    // A 6ª requisição é o ataque excedente. Ela deve ser barrada pelo express-rate-limit 
    // ANTES de sequer chegar no Zod ou no Controller.
    const ataqueBloqueado = await request(app).post('/login').send(credenciaisHackers)

    // 429 é o código HTTP oficial para "Too Many Requests" (Muitas requisições)
    expect(ataqueBloqueado.status).toBe(429) 
    
    // Verifica se a nossa mensagem de segurança customizada foi entregue
    expect(ataqueBloqueado.body.erro).toContain('bloqueada por 15 minutos')
  })
})