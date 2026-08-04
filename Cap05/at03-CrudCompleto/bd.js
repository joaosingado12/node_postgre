import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
dotenv.config()
// Configuração utilizando Pool para melhor performance e estabilidade
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'amigo_do_pet',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// Identifica dinamicamente qual coluna é a Chave Primária da tabela
const obterChavePrimaria = async (tabela) => {
  try {
    const [colunas] = await pool.query(`SHOW KEYS FROM ${tabela} WHERE Key_name = 'PRIMARY'`)
    if (colunas.length === 0) throw new Error(`A tabela ${tabela} não possui chave primária definida`)
    return colunas[0].Column_name
  } catch (e) {
    throw new Error(`Erro ao identificar PK da tabela ${tabela}: ${e.message}`)
  }
}

// Obtém os metadados das colunas para filtrar o que deve ser inserido/atualizado
const obterCampos = async (tabela) => {
  try {
    const pk = await obterChavePrimaria(tabela)
    const [campos] = await pool.query(`DESCRIBE ${tabela}`)
    return {
      todos: campos.map(c => c.Field),
      semPK: campos.filter(c => c.Field !== pk).map(c => c.Field),
      pk: pk
    }
  } catch (e) {
    throw new Error(`Tabela ${tabela} inválida: ${e.message}`)
  }
}

export const inserir = async (tabela, dados) => {
  const info = await obterCampos(tabela)
  const campos = info.semPK.join(',')
  const placeholders = info.semPK.map(() => '?').join(',')
  
  const sql = `INSERT INTO ${tabela} (${campos}) VALUES (${placeholders})`
  
  // Mapeia os valores que existem na tabela
  const valores = info.semPK.map(campo => dados[campo])
  
  const [res] = await pool.execute(sql, valores)
  return { [info.pk]: res.insertId, status: 201 }
}

export const ler = async (tabela, id = '') => {
  const pk = await obterChavePrimaria(tabela)
  const sql = id ? `SELECT * FROM ${tabela} WHERE ${pk} = ?` : `SELECT * FROM ${tabela}`
  
  const [rows] = await pool.execute(sql, id ? [id] : [])
  return rows.length ? rows : { msg: 'Nenhum registro encontrado' }
}

export const atualizar = async (tabela, dados, id) => {
  const info = await obterCampos(tabela)
  // Filtra apenas os campos enviados no body que realmente existem na tabela (exceto PK)
  const camposParaAtualizar = info.semPK.filter(c => dados[c] !== undefined)
  const setClause = camposParaAtualizar.map(c => `${c}=?`).join(',')
  
  const sql = `UPDATE ${tabela} SET ${setClause} WHERE ${info.pk} = ?`
  const valores = camposParaAtualizar.map(campo => dados[campo])
  
  const [res] = await pool.execute(sql, [...valores, id])
  return { atualizado: !!res.affectedRows }
}

export const deletar = async (tabela, id) => {
  const pk = await obterChavePrimaria(tabela)
  const sql = `DELETE FROM ${tabela} WHERE ${pk} = ?`
  
  const [res] = await pool.execute(sql, [id])
  return { excluido: !!res.affectedRows }
}