import pg from "pg"
import dotenv from 'dotenv'
dotenv.config()
// Configuração utilizando Pool para melhor performance e estabilidade
const { Pool } = pg
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: {
    rejectUnauthorized: false
  }
})

// Identifica dinamicamente qual coluna é a Chave Primária da tabela
const obterChavePrimaria = async (tabela) => {
  try {
    const sql = `
      SELECT kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_name = $1
        AND tc.constraint_type = 'PRIMARY KEY'
    `
    const result = await pool.query(sql, [tabela])
    if (result.rows.length === 0) throw new Error(`A tabela ${tabela} não possui chave primária definida`)
    return result.rows[0].column_name
  } catch (e) {
    throw new Error(`Erro ao identificar PK da tabela ${tabela}: ${e.message}`)
  }
}

// Obtém os metadados das colunas para filtrar o que deve ser inserido/atualizado
const obterCampos = async (tabela) => {
  try {
    const pk = await obterChavePrimaria(tabela)
    const sql = `
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `
    const result = await pool.query(sql, [tabela])
    const campos = result.rows
    return {
      todos: campos.map(c => c.column_name),
      semPK: campos.filter(c => c.column_name !== pk).map(c => c.column_name),
      pk: pk
    }
  } catch (e) {
    throw new Error(`Tabela ${tabela} inválida: ${e.message}`)
  }
}

export const inserir = async (tabela, dados) => {
  const info = await obterCampos(tabela)
  const campos = info.semPK.join(',')
  const placeholders = info.semPK.map((_, i) => `$${i + 1}`).join(',')
  
  const sql = `INSERT INTO ${tabela} (${campos}) VALUES (${placeholders}) RETURNING ${info.pk}`
  
  // Mapeia os valores que existem na tabela
  const valores = info.semPK.map(campo => dados[campo])
  
  const result = await pool.query(sql, valores)
  return { [info.pk]: result.rows[0][info.pk], status: 201 }
}

export const ler = async (tabela, id = '') => {
  const pk = await obterChavePrimaria(tabela)
  const sql = id ? `SELECT * FROM ${tabela} WHERE ${pk} = $1` : `SELECT * FROM ${tabela}`
  
  const result = await pool.query(sql, id ? [id] : [])
  return result.rows.length ? result.rows : { msg: 'Nenhum registro encontrado' }
}

export const atualizar = async (tabela, dados, id) => {
  const info = await obterCampos(tabela)
  // Filtra apenas os campos enviados no body que realmente existem na tabela (exceto PK)
  const camposParaAtualizar = info.semPK.filter(c => dados[c] !== undefined)
  const setClause = camposParaAtualizar.map((c, i) => `${c}=$${i + 1}`).join(',')
  
  const sql = `UPDATE ${tabela} SET ${setClause} WHERE ${info.pk} = $${camposParaAtualizar.length + 1}`
  const valores = camposParaAtualizar.map(campo => dados[campo])
  
  const result = await pool.query(sql, [...valores, id])
  return { atualizado: !!result.rowCount }
}

export const deletar = async (tabela, id) => {
  const pk = await obterChavePrimaria(tabela)
  const sql = `DELETE FROM ${tabela} WHERE ${pk} = $1`
  
  const result = await pool.query(sql, [id])
  return { excluido: !!result.rowCount }
}