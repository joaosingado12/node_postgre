import prisma from '../config/database.js'
import { uploadBuffer, deleteAsset } from '../services/cloudinary.js'

export const uploadPetImage = async (req, res, next) => {
  let result
  try {
    const { id } = req.params
    const userId = req.usuarioId

    const pet = await prisma.pet.findUnique({ where: { id: Number(id) } })
    if (!pet) return res.status(404).json({ erro: 'Pet não encontrado' })
    if (pet.id_cli !== userId) return res.status(403).json({ erro: 'Acesso negado. Este pet não pertence a você.' })

    const file = req.file
    if (!file) return res.status(400).json({ erro: 'Arquivo não enviado' })

    const publicId = `pet_${pet.id}_${Date.now()}`
    result = await uploadBuffer(file.buffer, publicId)

    const img = await prisma.petImage.create({
      data: {
        petId: pet.id,
        url: result.secure_url,
        publicId: result.public_id
      }
    })

    res.status(201).json(img)
  } catch (error) {
    if (result?.public_id) {
      try {
        await deleteAsset(result.public_id)
      } catch (_cleanupError) {
        // Falha no cleanup não deve esconder o erro original
      }
    }
    next(error)
  }
}

export const listarImagensPet = async (req, res, next) => {
  try {
    const { id } = req.params
    const imagens = await prisma.petImage.findMany({ where: { petId: Number(id) } })
    res.status(200).json(imagens)
  } catch (error) {
    next(error)
  }
}
