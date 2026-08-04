import { z } from 'zod'

// 1. Definição dos Schemas (Regras Rigorosas)
const usuarioSchema = z.object({
  nome: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  email: z.string().email('Formato de e-mail inválido.'),
  cpf: z.string().length(11, 'O CPF deve ter exatamente 11 dígitos numéricos sem pontuação.'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  telefone: z.string().optional(),
  whatsapp: z.string().optional()
})

const petSchema = z.object({
  nome: z.string().min(2, 'O nome do pet é obrigatório.'),
  especie: z.string().min(2, 'A espécie é obrigatória.'),
  raca: z.string().min(2, 'A raça é obrigatória.'),
  tamanho: z.string().min(2, 'O tamanho é obrigatório.'),
  sexo: z.enum(['M', 'F'], { errorMap: () => ({ message: 'Sexo deve ser M ou F.' }) }).optional(),
  peso: z.number().positive('O peso deve ser maior que zero.').optional(),
  idade: z.number().int().nonnegative('A idade não pode ser negativa.').optional(),
  doenca: z.string().optional(),
  obs: z.string().optional()
})

const doacaoSchema = z.object({
  id_pet: z.number().int().positive('O ID do pet é obrigatório.'),
  status: z.string().min(2, 'O status é obrigatório.'),
  data_doacao: z.string().datetime({ message: 'Formato de data inválido. Use ISO-8601.' }).optional().nullable()
})

// Schema específico para a tela de Login
const loginSchema = z.object({
  email: z.string().email('Formato de e-mail inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.')
})

// Mapa de ligação para rotas genéricas
const schemas = {
  usuario: usuarioSchema,
  pet: petSchema,
  doacao: doacaoSchema
}

// 2. Middleware Dinâmico (Para rotas genéricas /:tabela)
export const validarRequisicao = (req, res, next) => {
  const { tabela } = req.params
  const schema = schemas[tabela]

  if (!schema) {
    return res.status(400).json({ erro: `Nenhuma regra de validação definida para a tabela: ${tabela}` })
  }

  const schemaAUsar = req.method === 'PUT' ? schema.partial() : schema
  
  const result = schemaAUsar.safeParse(req.body)

  if (!result.success) {
    const errosFormatados = result.error.issues.map(issue => ({
      campo: issue.path[0],
      mensagem: issue.message
    }))
    return res.status(400).json({ 
      erro: 'Falha na validação dos dados de entrada.', 
      detalhes: errosFormatados 
    })
  }

  req.body = result.data
  next()
}

// 3. Middleware Específico (Para a rota de Login)
export const validarLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    const errosFormatados = result.error.issues.map(issue => ({
      campo: issue.path[0],
      mensagem: issue.message
    }))
    return res.status(400).json({
      erro: 'Falha na validação de credenciais.',
      detalhes: errosFormatados
    })
  }

  req.body = result.data
  next()
}