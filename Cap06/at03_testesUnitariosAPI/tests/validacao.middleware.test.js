import { describe, it, expect, vi } from 'vitest'
import { validarLogin } from '../middlewares/validacao.middleware.js'

// Simulação do Express
const mockRequest = (body = {}) => ({ body })
const mockResponse = () => {
  const res = {}
  res.status = vi.fn().mockReturnValue(res)
  res.json = vi.fn().mockReturnValue(res)
  return res
}

describe('Middleware de Validação - Login (Zod)', () => {
  
  it('Deve bloquear a requisição (Erro 400) se o body estiver vazio', () => {
    const req = mockRequest({})
    const res = mockResponse()
    const next = vi.fn() // Simula a função que libera a passagem

    validarLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    // Garante que a requisição não foi liberada para o Controller
    expect(next).not.toHaveBeenCalled() 
  })

  it('Deve bloquear se o e-mail for inválido', () => {
    const req = mockRequest({ email: 'email_sem_arroba', senha: '123' })
    const res = mockResponse()
    const next = vi.fn()

    validarLogin(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ erro: 'Falha na validação de credenciais.' })
    )
    expect(next).not.toHaveBeenCalled()
  })

  it('Deve chamar next() e liberar a passagem se os dados forem perfeitos', () => {
    const req = mockRequest({ email: 'aluno@senac.br', senha: 'senha_segura' })
    const res = mockResponse()
    const next = vi.fn()

    validarLogin(req, res, next)

    // Como os dados estão certos, o Zod deve liberar a passagem
    expect(next).toHaveBeenCalledTimes(1)
  })
})