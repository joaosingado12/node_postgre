const express = require('express')
const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('<h1>Pagina inicial</h1><p>Hello World!</p>')
})
app.get('/cadastro', (req, res) => {
  res.send('<h1>Pagina de cadastro foi acessada</h1>')
})
app.get('/usuario', (req, res) => {
  res.send('<h1>Pagina de usuario foi acessada</h1>')
})
app.get('/consulta', (req, res) => {
  res.send('<h1>Pagina de consulta foi acessada</h1>')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em: http://localhost:${PORT}`)
})
