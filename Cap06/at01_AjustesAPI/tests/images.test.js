import request from 'supertest'
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest'
import app from '../app.js'

// Mocks
vi.mock('../services/cloudinary.js', () => ({
  uploadBuffer: vi.fn().mockResolvedValue({ secure_url: 'https://example.com/img.jpg', public_id: 'public_1' })
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

    expect([200, 201]).toContain(res.statusCode)
  })
})
