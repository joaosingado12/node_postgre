import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const PORT = process.env.PORT || 3200

//  __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Definição do diretório de "templates" como repositório de views 
const baseDir = path.join(__dirname, 'templates')

// Rotas para as páginas
app.get('/', (req, res) =>res.status(200).sendFile(path.join(baseDir, 'index.html')))

app.get('/cadastrar', (req, res)=> res.status(200).sendFile(path.join(baseDir, 'cadastrar.html')))

// Middleware para Erro 404
app.use((req, res)=>res.status(404).sendFile(path.join(baseDir, '404.html')))

app.listen(PORT, ()=>console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`))
