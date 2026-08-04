import express from 'express'

const app = express()
const PORT = process.env.PORT || 3200

app.get('/', (req, res) => {
    const { nome, endereco='' } = req.query  // Destructuring para extrair 'nome' do objeto query
    
    if (nome) {
        res.send(`<h1>😁Olá ${nome}, seja bem-vindo!</h1><p>${endereco}</p>`)
    } else {
        res.send(`
            <h1>Informe seu nome</h1>
            <form method="GET">
                <label for="nome">Nome:</label>
                <input type="text" name="nome" id="nome" placeholder="Digite aqui..." required />
                <input type="text" name="endereco" id="endereco" placeholder="Digite aqui..." />
                <input type="submit" value="Enviar" />
            </form>
        `)
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`);
})