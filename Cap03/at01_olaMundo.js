// server.js
import http from 'node:http'
// Cria o serviço HTTP com uma callback que processa e responde as requisições.
const server = http.createServer((req, res) => {
    // Configura o cabeçalho da resposta
    res.setHeader('Content-Type', 'text/html')

    // Responde a requisição
    res.end(`
    <head> <meta charset="UTF-8"></head>
    <body>
        <h1>Olá Mundo!!!</h1>
        <h1>Olá turma Nodejs2026!!!</h1>
    </body>
    `)
})
server.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000')
})
