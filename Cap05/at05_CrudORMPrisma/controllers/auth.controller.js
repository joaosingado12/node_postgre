import prisma from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const gerarHashSenha = async (senha) => bcrypt.hash(senha, 10)
export const compararSenha = async (senha, hash) => bcrypt.compare(senha, hash)
export const gerarToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })

export const autenticar = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ statusCode: 401, erro: 'Token não informado' })

    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.JWT_SECRET)
    next() 
  } catch (error) {
    return res.status(401).json({ statusCode: 401, erro: 'Token inválido' })
  }
}

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    // Aqui está a mágica do Prisma! Adeus "SELECT * FROM usuarios WHERE email = ?"
    const usuario = await prisma.usuario.findUnique({
      where: { email: email } // O Prisma sabe que 'email' é @unique graças ao schema.prisma
    })

    if (!usuario) {
      return res.status(401).json({ statusCode: 401, erro: 'Usuário não encontrado' })
    }

    const senhaValida = await compararSenha(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ statusCode: 401, erro: 'Senha inválida' })
    }

    const token = gerarToken({ id: usuario.id, email: usuario.email })
    res.json({ autenticado: true, token })
  } catch (error) {
    res.status(500).json({ statusCode: 500, erro: error.message })
  }
}