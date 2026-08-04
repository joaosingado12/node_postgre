import express from 'express'
import cors from 'cors'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as bd from './bd.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3200
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baseDir = path.join(__dirname, 'templates')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Páginas
app.get('/', (req, res) => res.sendFile(path.join(baseDir, 'index.html')))

// --- API GENÉRICA ---

// CREATE: Insere em qualquer tabela
app.post('/:tabela', async (req, res) => {
  try { res.status(201).json(await bd.inserir(req.params.tabela, req.body)) }
  catch (e) { res.status(400).json({ erro: e.message }) }
})

// READ: Ajuste para Express 5 (Parâmetro opcional usando array de rotas)
// Isso resolve o erro "Unexpected ? at index..."
app.get(['/:tabela', '/:tabela/:id'], async (req, res) => {
  try { res.json(await bd.ler(req.params.tabela, req.params.id)) }
  catch (e) { res.status(400).json({ erro: e.message }) }
})

// UPDATE: Atualiza baseado na PK dinâmica definida no bd.js
app.put('/:tabela/:id', async (req, res) => {
  try { res.json(await bd.atualizar(req.params.tabela, req.body, req.params.id)) }
  catch (e) { res.status(400).json({ erro: e.message }) }
})

// DELETE: Remove baseado na PK dinâmica
app.delete('/:tabela/:id', async (req, res) => {
  try { res.json(await bd.deletar(req.params.tabela, req.params.id)) }
  catch (e) { res.status(400).json({ erro: e.message }) }
})

app.listen(PORT, () => console.log(`🚀 Server: http://localhost:${PORT}`))