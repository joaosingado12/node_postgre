import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dbConnection from './bd.js'

const app = express()
const PORT = process.env.PORT || 3200
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const baseDir = path.join(__dirname, 'templates')

//interpreta dados vindos do corpo do formulários HTML
app.use(express.urlencoded({ extended: true })) //extended: true permite interpretar dados complexos

//interpreta requisições no formato JSON
app.use(express.json()) //converte a string JSON em um objeto JavaScript

// Rotas de Páginas
app.get('/', (req, res) => res.sendFile(path.join(baseDir, 'index.html')))
app.get('/cadastrar', (req, res) => res.sendFile(path.join(baseDir, 'cadastrar.html')))

// API - Cadastro
app.post('/cadastrar/pets', async (req, res) => {
    try {
        const { id_cli, nome, sexo, especie, raca, peso, tamanho, idade, doenca, obs } = req.body
        const sql = "INSERT INTO pets (id_cli, nome, sexo, especie, raca, peso, tamanho, idade, doenca, obs) VALUES (?,?,?,?,?,?,?,?,?,?)"
        const con = await dbConnection()
        const [r] = await con.execute(sql, [id_cli, nome, sexo, especie, raca, parseFloat(peso), tamanho, parseInt(idade), doenca, obs]);
        await con.end()
        res.status(201).json({ status: 201, id: r.insertId })
    } catch (e) {
        res.status(400).json({ erro: e.message })
    }
})

// API - Listagem Geral
app.get('/consultar/pets', async (req, res) => {
    try {
        const con = await dbConnection()
        const sql = 'SELECT * FROM pets'
        const [rows] = await con.query(sql)
        await con.end()
        res.json(rows)
    } catch (e) {
        res.status(500).json({ erro: e.message })
    }
})

// API - Busca por ID
app.get('/consultar/pets/:id', async (req, res) => {
    try {
        const con = await dbConnection()
        sql = 'SELECT * FROM pets WHERE id = ?'
        const [rows] = await con.execute(sql, [req.params.id])
        await con.end()
        res.json(rows[0] || { msg: 'Não encontrado' })
    } catch (e) {
        res.status(500).json({ erro: e.message })
    }
})


app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`))