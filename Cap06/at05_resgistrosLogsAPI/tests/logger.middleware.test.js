import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import express from 'express'
import { registrarLog } from '../middlewares/logger.middleware.js'
import prisma from '../config/database.js'

// 1. Falsificação do Prisma (Não queremos encher o banco Neon com logs de teste)
vi.mock('../config/database.js', () => ({
  default: {
    logRequisicao: {
      create: vi.fn().mockResolvedValue({}) // Finge que salvou com sucesso
    }
  }
}))

// 2. Montagem de um mini-servidor Express de testes
const app = express()
app.use(express.json())

// Injetamos o Olho de Sauron globalmente
app.use(registrarLog)

// Rota simulando um acesso público (Vitrine)
app.get('/vitrine', (req, res) => {
  res.status(200).json({ mensagem: 'Lista de pets' })
})

// Rota simulando um acesso protegido (O auth.middleware já teria injetado o usuarioId)
app.post('/pet', (req, res) => {
  req.usuarioId = 99 // Simulando a injeção feita pelo Token JWT
  res.status(201).json({ mensagem: 'Pet cadastrado' })
})

describe('Middleware de Observabilidade - Logger', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve registrar um log de visitante anônimo corretamente', async () => {
    // Dispara a requisição
    await request(app).get('/vitrine').set('User-Agent', 'Navegador de Teste')

    // PAUSA DIDÁTICA: Como o Prisma é acionado de forma assíncrona ("fire and forget")
    // após o término da resposta, damos uma folga de 10 milissegundos para o Event Loop 
    // do Node.js terminar de executar a chamada do banco antes de testá-la.
    await new Promise(resolve => setTimeout(resolve, 10))

    // Verifica se a função create do Prisma foi chamada exatamente uma vez
    expect(prisma.logRequisicao.create).toHaveBeenCalledTimes(1)

    // Captura os dados que o middleware tentou mandar pro banco
    const dadosSalvos = prisma.logRequisicao.create.mock.calls[0][0].data

    expect(dadosSalvos.metodo).toBe('GET')
    expect(dadosSalvos.rota).toBe('/vitrine')
    expect(dadosSalvos.status).toBe(200)
    expect(dadosSalvos.usuarioId).toBeNull() // Visitante anônimo
    expect(dadosSalvos.userAgent).toBe('Navegador de Teste')
    expect(typeof dadosSalvos.tempoMs).toBe('number') // Garante que o cronômetro funcionou
  })

  it('Deve registrar um log de usuário autenticado corretamente', async () => {
    // Dispara a requisição simulando um POST
    await request(app).post('/pet')

    await new Promise(resolve => setTimeout(resolve, 10))

    expect(prisma.logRequisicao.create).toHaveBeenCalledTimes(1)

    const dadosSalvos = prisma.logRequisicao.create.mock.calls[0][0].data

    expect(dadosSalvos.metodo).toBe('POST')
    expect(dadosSalvos.rota).toBe('/pet')
    expect(dadosSalvos.status).toBe(201)
    expect(dadosSalvos.usuarioId).toBe(99) // Identificou o dono do token!
  })
})