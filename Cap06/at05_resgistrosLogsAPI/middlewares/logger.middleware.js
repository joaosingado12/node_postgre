import prisma from '../config/database.js'

export const registrarLog = (req, res, next) => {
  // Marca o início do cronômetro da requisição
  const dataInicio = Date.now()

  // Escuta o evento 'finish' (quando o Express despacha o JSON para o cliente)
  res.on('finish', () => {
    const tempoDeResposta = Date.now() - dataInicio

    // Captura o IP real, considerando as camadas de proxy da nuvem (Render, Vercel, etc.)
    const ipReal = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'IP Desconhecido'

    const dadosDoLog = {
      ip: ipReal,
      metodo: req.method,
      rota: req.originalUrl,
      status: res.statusCode,
      tempoMs: tempoDeResposta,
      userAgent: req.headers['user-agent'] || 'Desconhecido',
      // O req.usuarioId é populado automaticamente pelo auth.middleware.js nas rotas protegidas
      usuarioId: req.usuarioId || null
    }

    // Salva no banco em segundo plano (Assíncrono sem 'await' para não travar a API)
    prisma.logRequisicao.create({ data: dadosDoLog })
      .catch(erro => console.error('Falha crítica ao gravar log de auditoria:', erro.message))
  })

  next()
}