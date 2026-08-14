import pool from '../config/database.js'

const obterChavePrimaria = async (tabela) => {
  const { rows } = await pool.query(
    `SELECT a.attname AS column_name
     FROM   pg_index i
     JOIN   pg_attribute a ON a.attrelid = i.indrelid
                          AND a.attnum = ANY(i.indkey)
     WHERE  i.indrelid = $1::regclass
     AND    i.indisprimary`,
    [tabela]
  )
  return rows[0].column_name
}

const obterCampos = async (tabela) => {
  const pk = await obterChavePrimaria(tabela)
  const { rows: campos } = await pool.query(
    `SELECT column_name
     FROM information_schema.columns
     WHERE table_name = $1
     ORDER BY ordinal_position`,
    [tabela]
  )

  return {
    pk,
    semPK: campos.filter(c => c.column_name !== pk).map(c => c.column_name)
  }
}

export const inserir = async (tabela, dados) => {
  const info = await obterCampos(tabela)

  const campos = info.semPK.filter(c => dados[c] !== undefined)

  const sql = `
    INSERT INTO ${tabela} (${campos.join(',')})
    VALUES (${campos.map((_, i) => `$${i + 1}`).join(',')})
    RETURNING ${info.pk}
  `
  const valores = campos.map(c => dados[c])
  const { rows } = await pool.query(sql, valores)
  return { id: rows[0][info.pk], criado: true }
}

export const listar = async (tabela, id = null) => {
  const pk = await obterChavePrimaria(tabela)
  const sql = id ? `SELECT * FROM ${tabela} WHERE ${pk} = $1`
                 : `SELECT * FROM ${tabela}`
  const { rows } = await pool.query(sql, id ? [id] : [])
  return rows
}

export const atualizar = async (tabela, dados, id) => {
  const info = await obterCampos(tabela)
  const campos = info.semPK.filter(c => dados[c] !== undefined)

  const setClause = campos.map((c, i) => `${c}=$${i + 1}`).join(',')
  const sql = `UPDATE ${tabela}
               SET ${setClause}
               WHERE ${info.pk} = $${campos.length + 1}
            `
  const valores = campos.map(c => dados[c])
  const { rowCount } = await pool.query(sql, [...valores, id])

  return { atualizado: !!rowCount }
}

export const remover = async (tabela, id) => {
  const pk = await obterChavePrimaria(tabela)
  const { rowCount } = await pool.query(
    `DELETE FROM ${tabela} WHERE ${pk} = $1`, [id])
  return { excluido: !!rowCount }
}