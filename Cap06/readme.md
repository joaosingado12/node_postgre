# Cap06 - Ajustes de API e Qualidade

[⬅ Voltar ao projeto principal](../README.md)

Este capítulo apresenta ajustes em APIs, validação, testes unitários, segurança, registros e documentação.

## Conteúdo
- `at01_AjustesAPI/`
- `at02_validacaoDadosAPI/`
- `at03_testesUnitariosAPI/`
- `at04_securityAPI/`
- `at05_resgistrosLogsAPI/`
- `at06_documentation/`
- `at07_fromtEnd/`

## Objetivos
- Refinar APIs Express
- Adicionar validação de dados
- Escrever testes unitários
- Aplicar segurança básica em APIs
- Gerar logs e documentação

## Configuração
- Entre na pasta da atividade desejada.
- Execute `npm install` para instalar as dependências.
- Crie um arquivo `.env` com as variáveis abaixo antes de iniciar a aplicação.

## Comandos
```bash
cd Cap06/at03_testesUnitariosAPI
npm install
npm test
```

## Variáveis de ambiente
- `PORT` - porta da aplicação.
- `DATABASE_URL` - string de conexão com o banco.
- `JWT_SECRET` - chave para geração de tokens.
- `CLOUDINARY_CLOUD_NAME` - nome da conta Cloudinary.
- `CLOUDINARY_API_KEY` - chave de API Cloudinary.
- `CLOUDINARY_API_SECRET` - segredo da API Cloudinary.
- `CLOUDINARY_FOLDER` - pasta de upload opcional.

## Observações
Cada subatividade tem sua própria configuração. Verifique `package.json` e `prisma/schema.prisma` antes de executar.
