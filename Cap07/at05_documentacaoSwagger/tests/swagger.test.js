import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../app.js'

describe('Swagger Documentation', () => {
  it('should expose the Swagger UI at /docs', async () => {
    const res = await request(app).get('/docs')
    expect([301, 302]).toContain(res.statusCode)
    expect(res.headers.location).toContain('/docs/')
  })

  it('should expose Swagger JSON at /docs/', async () => {
    const res = await request(app).get('/docs/')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('Swagger UI')
  })
})
