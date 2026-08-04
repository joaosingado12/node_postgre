import request from 'supertest'
import { describe, it, vi, expect } from 'vitest'
import app from '../app.js'

// Mocks
vi.mock('../services/cloudinary.js', () => ({
  uploadBuffer: vi.fn().mockResolvedValue({ secure_url: 'https://example.com/img.jpg', public_id: 'public_1' }),
  deleteAsset: vi.fn().mockResolvedValue({ result: 'ok' })
}))

vi.mock('../config/database.js', () => ({
  default: {
    pet: {
      findUnique: vi.fn().mockResolvedValue({ id: 1, id_cli: 1, nome: 'Toto' })
    },
    petImage: {
      create: vi.fn().mockResolvedValue({ id: 1, petId: 1, url: 'https://example.com/img.jpg', publicId: 'public_1' }),
      findMany: vi.fn().mockResolvedValue([])
    }
  }
}))

vi.mock('../controllers/auth.controller.js', () => ({
  autenticar: (req, res, next) => { req.usuarioId = 1; next() },
  login: () => {},
  autenticarOpcional: (req, res, next) => { next() }
}))

describe('Upload de imagens', () => {
  it('deve aceitar upload de imagem para pet pertencente ao usuário', async () => {
    const res = await request(app)
      .post('/pet/1/imagens')
      .attach('imagem', Buffer.from('abc'), { filename: 'foto.jpg' })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('url')
  })

  it('deve retornar 400 quando nenhum arquivo for enviado', async () => {
    const res = await request(app)
      .post('/pet/1/imagens')
      .send({})

    expect(res.statusCode).toBe(400)
    expect(res.body).toEqual({ erro: 'Arquivo não enviado' })
  })
})
