import bcrypt from 'bcrypt'
import prisma from '../config/database.js'

export const listar = async (req, res, next) => {
  try {
    const { tabela } = req.params
    let queryArgs = {}

    if (tabela === 'pet' && req.usuarioId) {
      queryArgs.where = { id_cli: req.usuarioId }
    }

    const dados = await prisma[tabela].findMany(queryArgs)
    res.status(200).json(dados)
  } catch (error) {
    next(handlePrismaError(error))
  }
}

const handlePrismaError = (error) => {
  if (error.status) return error

  const prismaError = new Error(error.message || 'Erro de banco de dados')
  prismaError.status = error.code === 'P2002' ? 409 : error.code === 'P2025' ? 404 : 400
  return prismaError
}

export const criar = async (req, res, next) => {
  try {
    const { tabela } = req.params
    const dados = req.body

    if (tabela === 'pet' && req.usuarioId) {
      dados.id_cli = req.usuarioId
    }

    if (tabela === 'usuario' && dados.senha) {
      const salt = await bcrypt.genSalt(10)
      dados.senha = await bcrypt.hash(dados.senha, salt)
    }

    if (tabela === 'doacao') {
      if (req.usuarioId) {
        dados.id_cli_interesse = req.usuarioId
      }
      dados.data_interesse = new Date().toISOString()
      if (dados.data_doacao) {
        dados.data_doacao = new Date(dados.data_doacao).toISOString()
      }
    }

    const novo = await prisma[tabela].create({ data: dados })
    if (tabela === 'usuario') delete novo.senha
    res.status(201).json(novo)
  } catch (error) {
    next(handlePrismaError(error))
  }
}

export const atualizar = async (req, res, next) => {
  try {
    const { tabela, id } = req.params
    
    // REGRA 3: Trava de Posse para Atualização de Pets
    if (tabela === 'pet' && req.usuarioId) {
      const pet = await prisma.pet.findUnique({ where: { id: Number(id) } })
      if (!pet || pet.id_cli !== req.usuarioId) {
        return res.status(403).json({ erro: 'Acesso negado. Este pet não pertence a você.' })
      }
    }

    // Se houver atualização de senha, criptografa novamente
    if (tabela === 'usuario' && req.body.senha) {
      const salt = await bcrypt.genSalt(10)
      req.body.senha = await bcrypt.hash(req.body.senha, salt)
    }

    // REGRA DE FORMATAÇÃO: Conversão de datas para o Prisma no PUT
    if (tabela === 'doacao') {
      if (req.body.data_interesse) {
        req.body.data_interesse = new Date(req.body.data_interesse).toISOString()
      }
      if (req.body.data_doacao) {
        req.body.data_doacao = new Date(req.body.data_doacao).toISOString()
      }
    }

    const atualizado = await prisma[tabela].update({
      where: { id: Number(id) },
      data: req.body
    })
    
    if (tabela === 'usuario') delete atualizado.senha

    res.status(200).json(atualizado)
  } catch (error) {
    next(handlePrismaError(error))
  }
}

export const remover = async (req, res, next) => {
  try {
    const { tabela, id } = req.params
    
    // REGRA 4: Trava de Posse para Exclusão de Pets
    if (tabela === 'pet' && req.usuarioId) {
      const pet = await prisma.pet.findUnique({ where: { id: Number(id) } })
      if (!pet || pet.id_cli !== req.usuarioId) {
        return res.status(403).json({ erro: 'Acesso negado. Você não pode excluir este pet.' })
      }
    }

    await prisma[tabela].delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    next(handlePrismaError(error))
  }
}