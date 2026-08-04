import { Router } from 'express'
import multer from 'multer'
import * as imagesController from '../controllers/images.controller.js'
import { autenticar } from '../controllers/auth.controller.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

// Upload de imagem para um pet (form field: 'imagem')
router.post('/pet/:id/imagens', autenticar, upload.single('imagem'), imagesController.uploadPetImage)
router.get('/pet/:id/imagens', imagesController.listarImagensPet)

export default router
