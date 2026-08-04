// server.js
import http from 'node:http'
const server = http.createServer((req, res) => {
    // Converte parâmetros da URL
    const urlObj = new URL(req.url, `http://${req.headers.host}`)
    const nome = urlObj.searchParams.get('nome')

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/html')

    if (nome) {
        res.end(`
            <head><meta charset="UTF-8"></head>
            <body>
                <h1>Olá ${nome}!!!</h1>
            </body>
        `)
    } else {
        res.end(`
            <head><meta charset="UTF-8"></head>
            <body>
                <h1>Informe seu nome</h1>
                <form method="GET">
                    <label for="nome">Nome:</label>
                    <input type="text" name="nome" placeholder="Informe seu nome" />
                    <input type="submit" value="Enviar" />
                </form>
            </body>
        `)
    }
})

server.listen(3200, () => {
    console.log('Servidor rodando em http://localhost:3200')
})