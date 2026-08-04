import pool from '../config/database.js'

const obterChavePrimaria = async (tabela) => {
  const [rows] = await pool.query(`SHOW KEYS FROM ${tabela} WHERE Key_name = 'PRIMARY'`)
  return rows[0].Column_name
}

const obterCampos = async (tabela) => {
  const pk = await obterChavePrimaria(tabela)
  const [campos] = await pool.query(`DESCRIBE ${tabela}`)

  return {
    pk,
    semPK: campos.filter(c => c.Field !== pk).map(c => c.Field)
  }
}

export const inserir = async (tabela, dados) => {
  const info = await obterCampos(tabela)

  const campos = info.semPK.filter(c => dados[c] !== undefined)

  const sql = `
    INSERT INTO ${tabela} (${campos.join(',')})
    VALUES (${campos.map(() => '?').join(',')})
  `
  const valores = campos.map(c => dados[c])
  const [result] = await pool.execute(sql, valores)
  return {id: result.insertId, criado: true}
}

export const listar = async (tabela, id = null) => {
  const pk = await obterChavePrimaria(tabela)
  const sql = id? `SELECT * FROM ${tabela} WHERE ${pk} = ?`
                : `SELECT * FROM ${tabela}`
  const [rows] = await pool.execute(sql, id ? [id] : [])
  return rows
}

export const atualizar = async (tabela, dados, id) => {
  const info = await obterCampos(tabela)
  const campos = info.semPK.filter(c => dados[c] !== undefined)
  const sql = `UPDATE ${tabela}
               SET ${campos.map(c => `${c}=?`).join(',')}
               WHERE ${info.pk} = ?
            `
  const valores = campos.map(c => dados[c])
  const [result] = await pool.execute(sql, [...valores, id])

  return { atualizado: !!result.affectedRows }
}

export const remover = async (tabela, id) => {
  const pk = await obterChavePrimaria(tabela)
  const [result] = await pool.execute(
    `DELETE FROM ${tabela} WHERE ${pk} = ?`, [id])
  return {excluido: !!result.affectedRows}
}
