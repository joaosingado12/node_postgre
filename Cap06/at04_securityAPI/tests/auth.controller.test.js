import { describe, it, expect, vi, beforeEach } from 'vitest'
import { login } from '../controllers/auth.controller.js'
import prisma from '../config/database.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// 1. Simulação do Express (View / Rotas)
const mockRequest = (body = {}) => ({ body })
const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

// 2. Falsificação do Prisma e Bibliotecas (Model / Sec)
vi.mock('../config/database.js', () => ({
  default: {
    usuario: { findFirst: vi.fn() }
  }
}))
vi.mock('bcrypt')
vi.mock('jsonwebtoken')

describe('Auth Controller - Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('Deve retornar erro 401 se o e-mail não existir', async () => {
    // Configura o Prisma para não encontrar o usuário
    prisma.usuario.findFirst.mockResolvedValue(null)
    
    const req = mockRequest({ email: 'inexistente@email.com', senha: '123' })
    const res = mockResponse()

    await login(req, res)

    expect(prisma.usuario.findFirst).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' })
  })

  it('Deve retornar erro 401 se a senha for incorreta', async () => {
    // Configura o Prisma para encontrar o usuário
    prisma.usuario.findFirst.mockResolvedValue({ id: 1, email: 'leo@email.com', senha: 'hash_falso' })
    // Configura o Bcrypt para reprovar a senha
    bcrypt.compare = vi.fn().mockResolvedValue(false)
    
    const req = mockRequest({ email: 'leo@email.com', senha: 'senha_errada' })
    const res = mockResponse()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ erro: 'Credenciais inválidas' })
  })

  it('Deve retornar status 200 e o Token JWT em caso de sucesso', async () => {
    const usuarioMock = { id: 1, nome: 'Leonardo', email: 'leo@email.com', senha: 'hash_verdadeiro' }
    
    prisma.usuario.findFirst.mockResolvedValue(usuarioMock)
    bcrypt.compare = vi.fn().mockResolvedValue(true)
    jwt.sign = vi.fn().mockReturnValue('token_falso_gerado')
    
    const req = mockRequest({ email: 'leo@email.com', senha: 'senha_correta' })
    const res = mockResponse()

    await login(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      token: 'token_falso_gerado',
      usuario: { id: 1, nome: 'Leonardo' }
    })
  })
})