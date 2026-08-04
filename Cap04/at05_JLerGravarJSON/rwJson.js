import { readFile, writeFile } from 'node:fs/promises';

export async function lerJSON(arquivo) {
  try {
    const data = await readFile(arquivo, 'utf-8');
    return JSON.parse(data);
  } catch (erro) {
    // Se o arquivo não existir, retorna array vazio
    if (erro.code === 'ENOENT') return [];
    throw erro;
  }
}

export async function salvarJSON(dados, arquivo) {
  const json = JSON.stringify(dados, null, 2); 
  await writeFile(arquivo, json);
}