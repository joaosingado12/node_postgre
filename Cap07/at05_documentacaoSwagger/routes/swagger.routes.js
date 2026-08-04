import { Router } from 'express'

const router = Router()

router.get('/docs', (req, res) => {
  res.redirect(302, '/docs/')
})

export default router
