import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import prisma from '../config/database.js'

const SECRET = process.env.JWT_SECRET || 'chave_secreta_padrao'

// Função de Login Atualizada com Bcrypt
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body

    // 1. Busca o usuário apenas pelo e-mail
    const usuario = await prisma.usuario.findFirst({
      where: { email }
    })

    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    // 2. Compara a senha enviada (texto) com a senha guardada (hash)
    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' })
    }

    // 3. Se passou, gera o token normalmente
    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome }, 
      SECRET, 
      { expiresIn: '1d' }
    )

    return res.status(200).json({ 
      token, 
      usuario: { id: usuario.id, nome: usuario.nome } 
    })
  } catch (error) {
    return res.status(500).json({ erro: error.message })
  }
}

// Middleware rigoroso (Para rotas administrativas)
export const autenticar = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ erro: 'Token não informado' })

    const token = authHeader.split(' ')[1]
    const payload = jwt.verify(token, SECRET)
    
    req.usuarioId = payload.id 
    next() 
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' })
  }
}

// Middleware brando (Para a vitrine pública de pets)
export const autenticarOpcional = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (authHeader) {
      const token = authHeader.split(' ')[1]
      const payload = jwt.verify(token, SECRET)
      req.usuarioId = payload.id
    }
  } catch (error) {
    // Visitante anônimo
  }
  next()
}