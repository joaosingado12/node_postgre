import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listar, criar } from '../controllers/generic.controller.js'
import prisma from '../config/database.js'

// 1. Simulação do Express (Req, Res)
const mockRequest = (params = {}, body = {}, usuarioId = null) => ({
  params,
  body,
  usuarioId
})

const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

// 2. Falsificação do Prisma (Model)
vi.mock('../config/database.js', () => ({
  default: {
    pet: {
      findMany: vi.fn(),
      create: vi.fn()
    },
    doacao: {
      create: vi.fn()
    }
  }
}))

describe('Generic Controller - Regras de Negócio', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Função Listar (GET)', () => {
    it('Deve listar apenas os pets do usuário logado se o Token estiver presente', async () => {
      // Array falso de retorno
      const petsMock = [{ id: 10, nome: 'Rex', id_cli: 5 }]
      prisma.pet.findMany.mockResolvedValue(petsMock)
      
      // Simula uma requisição para a tabela 'pet' com o usuário ID 5 logado
      const req = mockRequest({ tabela: 'pet' }, {}, 5)
      const res = mockResponse()

      await listar(req, res)

      // Verifica se o Prisma foi chamado com o filtro de Ownership (id_cli: 5)
      expect(prisma.pet.findMany).toHaveBeenCalledWith({ where: { id_cli: 5 } })
      expect(res.status).toHaveBeenCalledWith(200)
      expect(res.json).toHaveBeenCalledWith(petsMock)
    })
  })

  describe('Função Criar (POST)', () => {
    it('Deve injetar automaticamente o id_cli no cadastro de um Pet', async () => {
      prisma.pet.create.mockResolvedValue({ id: 11, nome: 'Bolinha', id_cli: 2 })
      
      // O formulário manda apenas o nome, o Token manda o ID do dono (2)
      const req = mockRequest({ tabela: 'pet' }, { nome: 'Bolinha' }, 2)
      const res = mockResponse()

      await criar(req, res)

      // Verifica se o Controller uniu as informações antes de mandar pro banco
      expect(prisma.pet.create).toHaveBeenCalledWith({
        data: { nome: 'Bolinha', id_cli: 2 }
      })
      expect(res.status).toHaveBeenCalledWith(201)
    })

    it('Deve gerar a data atual e injetar o id_cli_interesse no cadastro de Doação', async () => {
      prisma.doacao.create.mockResolvedValue({ id: 1, status: 'Interessado' })
      
      const req = mockRequest({ tabela: 'doacao' }, { id_pet: 10, status: 'Interessado' }, 3)
      const res = mockResponse()

      await criar(req, res)

      // Captura o que o Controller tentou enviar para o banco
      const chamadasDoPrisma = prisma.doacao.create.mock.calls[0][0].data
      
      expect(chamadasDoPrisma.id_cli_interesse).toBe(3)
      expect(chamadasDoPrisma.data_interesse).toBeDefined()
      expect(typeof chamadasDoPrisma.data_interesse).toBe('string')
      expect(res.status).toHaveBeenCalledWith(201)
    })
  })
})