import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../server.js'

describe('Swagger docs', () => {
  it('GET /docs should return HTML', async () => {
    const res = await request(app).get('/docs')
    expect(res.statusCode).toBe(200)
    expect(res.headers['content-type']).toMatch(/html/)
  })
})
