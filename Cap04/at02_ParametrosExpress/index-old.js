import express from 'express'

const app = express()

const PORT = 3000

app.get('/', (req, res) =>res.send('<h1>Pagina inicial</h1>'))

app.get('/bemvindo/:nome', (req, res)=>{
    //console.log(req)
    const { nome } = req.params //desestruturação do atributo nome
    res.send(`<h1>Olá ${nome}, seja bem-vindo!</h1>`)
})

app.listen(PORT, () =>console.log(`Servidor rodando em: http://localhost:${PORT}`))
