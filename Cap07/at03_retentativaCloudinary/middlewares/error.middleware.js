export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  const status = error.status || (error.code === 'P2002' ? 409 : error.code === 'P2025' ? 404 : 500)
  const message = error.message || 'Erro interno do servidor'
  res.status(status).json({ erro: message })
}
