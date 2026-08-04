# Cap07 - Recursos Avançados de API

[⬅ Voltar ao projeto principal](../README.md)

O capítulo 7 agrega melhorias profissionais à API, com segurança reforçada, tratamento de erros, retry em upload Cloudinary, testes avançados e documentação Swagger.

## Conteúdo
- `at01_segurancaAplicacao/`
- `at02_validacaoTratamentoErros/`
- `at03_retentativaCloudinary/`
- `at04_testesAvancados/`
- `at05_documentacaoSwagger/`

## Objetivos
- Fortalecer segurança com Helmet e rate limiting
- Implementar middleware centralizado de erros
- Adicionar retry e cleanup para uploads Cloudinary
- Validar comportamentos por testes automatizados
- Documentar a API com Swagger UI

## Configuração
- Entre na pasta da atividade desejada.
- Execute `npm install` para instalar as dependências.
- Crie um arquivo `.env` com as variáveis abaixo antes de iniciar a aplicação.

## Comandos
```bash
cd Cap07/at05_documentacaoSwagger
npm install
npm test
```

## Variáveis de ambiente
- `PORT` - porta da aplicação.
- `DATABASE_URL` - conexão com o banco de dados.
- `JWT_SECRET` - chave para autenticação.
- `JWT_EXPIRATION` - tempo de expiração do token.
- `CLOUDINARY_CLOUD_NAME` - nome da conta Cloudinary.
- `CLOUDINARY_API_KEY` - chave de API Cloudinary.
- `CLOUDINARY_API_SECRET` - segredo da API Cloudinary.
- `CLOUDINARY_FOLDER` - pasta para upload.
- `CORS_ORIGIN` - origem permitida para o frontend.
- `BASE_URL` - URL base da API para documentação Swagger.

## Observações
Cap07 foi projetado para estender a API existente com práticas de produção e apresentar a evolução do projeto em um contexto mais profissional.
