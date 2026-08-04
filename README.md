# NodeJS 2026 - Curso de Back-end com Node.js

Este repositório reúne atividades práticas e exemplos organizados por capítulos para aprender desenvolvimento back-end com Node.js. O conteúdo evolui desde scripts básicos até APIs completas, com foco em segurança, testes, banco de dados e documentação.

## Estrutura do repositório

- [Cap01](Cap01/) - Fundamentos do Node.js e primeiros scripts.
- [Cap02](Cap02/) - Manipulação de arquivos, variáveis de ambiente, módulos e rotas básicas.
- [Cap03](Cap03/) - Criação de aplicações HTTP simples e renderização de HTML.
- [Cap04](Cap04/) - Introdução ao Express e implementação de APIs REST.
- [Cap05](Cap05/) - Conexão com banco de dados, CRUD completo e exemplos com ORM.
- [Cap06](Cap06/) - Ajustes de API, validação de dados, testes, segurança e logs.
- [Cap07](Cap07/) - Atividades avançadas com segurança, tratamento de erros, upload de imagens Cloudinary, testes avançados e documentação Swagger.

Cada capítulo contém um README com descrição, objetivos e instruções de execução.

## Configuração geral

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```
2. Acesse a pasta do projeto:
   ```bash
   cd nodejs2026
   ```
3. Instale as dependências da atividade desejada:
   ```bash
   npm install
   ```
4. Crie um arquivo `.env` com as variáveis necessárias para o capítulo que você for executar.
5. Inicie o servidor ou rode o script correspondente:
   ```bash
   node server.js
   ```
   ou
   ```bash
   node <arquivo>.js
   ```

## Variáveis de ambiente por capítulo

- Cap01, Cap02, Cap03 e Cap04: nenhuma variável de ambiente é obrigatória para os exemplos básicos.
- Cap05: `PORT`, `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- Cap06: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`.
- Cap07: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRATION`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_FOLDER`, `CORS_ORIGIN`, `BASE_URL`.

## Tecnologias utilizadas

- Node.js
- Express
- Prisma ORM
- PostgreSQL (Neon, entre outros)
- Cloudinary
- JWT para autenticação
- `express-validator` para validação de entrada
- `helmet` e `express-rate-limit` para segurança
- `vitest` e `supertest` para testes automatizados
- `swagger-jsdoc` e `swagger-ui-express` para documentação de API

## Objetivos do repositório

1. Demonstrar a evolução de uma aplicação Node.js desde scripts básicos até APIs robustas.
2. Ensinar integração com banco de dados usando Prisma.
3. Apresentar padrões de segurança para APIs REST.
4. Mostrar a importância de validação de dados e tratamento centralizado de erros.
5. Implementar testes automatizados para garantir a qualidade do código.
6. Documentar APIs com Swagger para facilitar uso e manutenção.

## Observações

- Cada capítulo e atividade possui seu próprio `package.json`, arquivos de configuração e dependências.
- Consulte o arquivo `Introdução - Desenvolvedor Web Back-end_Node_js.pdf` como suporte teórico.

## Contato

Este repositório serve como material didático e de referência para desenvolvedores que desejam aprofundar conhecimentos em back-end com Node.js e práticas modernas de API.
