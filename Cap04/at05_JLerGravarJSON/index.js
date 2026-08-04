import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { lerJSON, salvarJSON } from './rwJson.js';

const app = express();
const porta = 3200;
const arquivo = 'pets.json';

// equivalente ao __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.join(__dirname, 'templates');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// rotas
app.get('/', (req, res) => {
  res.sendFile(path.join(baseDir, 'index.html'));
});

app.get('/cadastrar', (req, res) => {
  res.sendFile(path.join(baseDir, 'cadastrar.html'));
});

app.get('/registros', async (req, res) => {
  try {
    const dados = await lerJSON(arquivo);
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao ler dados' });
  }
});

app.post('/cadastrar', async (req, res) => {
  try {
    const novoDado = req.body;

    const dados = await lerJSON(arquivo);
    dados.push(novoDado);

    await salvarJSON(dados, arquivo);

    res.json(novoDado);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao salvar dados' });
  }
});

app.listen(porta, () => {
  console.log(`Servidor rodando em: http://localhost:${porta}`);
});