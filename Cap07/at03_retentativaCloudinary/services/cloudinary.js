import { v2 as cloudinary } from 'cloudinary'
import retry from 'retry'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME
const API_KEY = process.env.CLOUDINARY_API_KEY
const API_SECRET = process.env.CLOUDINARY_API_SECRET
const FOLDER = process.env.CLOUDINARY_FOLDER || 'amigo-pet'
const RETRY_ATTEMPTS = Number(process.env.CLOUDINARY_RETRY_ATTEMPTS || 3)
const RETRY_DELAY_MS = Number(process.env.CLOUDINARY_RETRY_DELAY_MS || 500)

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET
})

const upload = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        public_id: filename,
        resource_type: 'image',
        metadata: { uploadedBy: process.env.APP_NAME || 'amigo-pet' }
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    stream.end(buffer)
  })
}

export const uploadBuffer = async (buffer, filename) => {
  const operation = retry.operation({
    retries: RETRY_ATTEMPTS - 1,
    factor: 2,
    minTimeout: RETRY_DELAY_MS,
    maxTimeout: 5000,
    randomize: true
  })

  return new Promise((resolve, reject) => {
    operation.attempt(async () => {
      try {
        const result = await upload(buffer, filename)
        resolve(result)
      } catch (error) {
        if (operation.retry(error)) {
          return
        }
        reject(operation.mainError())
      }
    })
  })
}

export const deleteAsset = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: 'image' }, (error, result) => {
      if (error) return reject(error)
      resolve(result)
    })
  })
}

export default cloudinary
