import http from 'node:http' //Cria um servidor
import fs from 'node:fs' // Sistema de arquivos
import path from 'node:path' //Resolve o caminho
import { fileURLToPath } from 'node:url' //Trata url para rotas e paremetros

const PORTA = 5000

// Necessário em ES Modules para resolver caminhos corretamente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const server = http.createServer((req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`)
    //let dominio = urlObj.pathname.substring(0)
    let pagina = urlObj.pathname.substring(1)

    // Página padrão
    pagina = pagina === '' ? 'index.html' : pagina

    // Garante extensão .html
    if (!pagina.includes('html')) {
        pagina += '.html'
    }
    //Resolve o caminho absoluto do arquivo
    let caminhoArquivo = path.join(__dirname, pagina)

    if (fs.existsSync(caminhoArquivo)) {
        fs.readFile(caminhoArquivo, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' })
                return res.end('<h1>Erro interno do servidor</h1>')
            }

            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end(data)
        })
    } else {
        caminhoArquivo = path.join(__dirname, 'pg404.html')
        fs.readFile(caminhoArquivo, (err, data) => {
            res.writeHead(404, { 'Content-Type': 'text/html' })
            res.end(data)
        })
    }
})

server.listen(PORTA, () => {
    console.log(`Servidor rodando em http://localhost:${PORTA}`)
})
