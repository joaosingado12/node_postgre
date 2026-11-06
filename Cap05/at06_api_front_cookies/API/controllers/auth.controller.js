import prisma from '../config/database.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const gerarHashSenha = async (senha) => bcrypt.hash(senha, 10)
export const compararSenha = async (senha, hash) => bcrypt.compare(senha, hash)
export const gerarToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' })

export const autenticar = (req, res, next) => {
  try {
    // 1. Lemos o token diretamente dos cookies da requisição
    // O nome 'token_acesso' deve ser exatamente o mesmo que você usou no res.cookie() no login
    const token = req.cookies.token_acesso; 

    // 2. Se o navegador não enviou o cookie, bloqueia o acesso
    if (!token) {
      return res.status(401).json({ statusCode: 401, erro: 'Token não informado' });
    }

    // 3. Verifica se o token é autêntico e não expirou
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. (Opcional, mas muito útil) Guarda os dados do usuário na requisição
    // Isso permite que você saiba quem está logado dentro do controller de Doações, por exemplo
    req.usuario = payload; 

    next(); 
  } catch (error) {
    return res.status(401).json({ statusCode: 401, erro: 'Token inválido ou expirado' });
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

    ////////////////
    res.cookie('token_acesso', token, {
      httpOnly: true, // Bloqueia a leitura via JavaScript (Protege contra XSS)
      secure: false, // Use TRUE em produção (requer HTTPS)
      sameSite: 'lax', // Protege contra ataques CSRF
      maxAge: 3600000 // Tempo de vida em milissegundos (1 hora)
    });

    return res.status(200).json({ 
      mensagem: 'Login realizado com sucesso',
      usuario: { 
        id: usuario.id, 
        nome: usuario.nome, 
        email: usuario.email 
      } 
    });

  } catch (error) {
    res.status(500).json({ statusCode: 500, erro: error.message })
  }
}