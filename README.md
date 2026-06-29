# English Dictionary API

API RESTful para dicionário em inglês com autenticação JWT, busca/paginação de palavras, favoritos, histórico, cache e documentação OpenAPI (Swagger).

## 🎯 Propósito

Atender os casos de uso do desafio técnico:

- Cadastro e login de usuários
- Listagem de palavras com paginação e busca
- Detalhe de palavra com proxy para Free Dictionary API
- Registro de histórico de palavras consultadas
- Gestão de palavras favoritas
- Documentação da API e testes automatizados

## 📋 Regras de Negócio

- **Autenticação**: JWT via `/auth/signup` e `/auth/signin`
- **Registro**: email único por usuário e senha hasheada com `bcrypt`
- **Histórico**: toda consulta em `/entries/en/:word` registra a palavra para o usuário autenticado
- **Favoritos**: combinação `user_id + word` única
- **Busca**: ILIKE com paginação por `page` e `limit`
- **Proxy externo**: se a palavra não estiver no banco, busca em `https://api.dictionaryapi.dev`
- **Cache**: resposta de detalhe de palavra com `x-cache: HIT|MISS` e `x-response-time`

## 🏗️ Arquitetura

O projeto segue organização em camadas:

```
src/
├── domain/          # entidades e interfaces de repositório
├── application/     # DTOs, models, use-cases, erros de negócio
├── infrastructure/  # TypeORM, guards, filtros, cache, resposta HTTP
├── presentation/    # controllers e modules por contexto
└── scripts/         # scripts utilitários (importação de palavras)
```

### 🔁 Injeção de Dependência

Os casos de uso dependem de interfaces/tokens (`USER_REPOSITORY`, `WORD_REPOSITORY`, etc), enquanto as implementações concretas ficam em `infrastructure/db/type-orm/repositories`.

## ✅ Boas Práticas Implementadas

- NestJS + TypeScript strict
- Repository Pattern com contratos no domínio
- Migrations TypeORM (`synchronize: false`)
- Filtros globais para erros HTTP e banco
- Validação global com `ValidationPipe`
- Cache em memória com TTL configurável
- Swagger (OpenAPI 3) em `/api`
- Testes unitários + E2E
- Workflows GitHub Actions para unit e e2e

## 📁 Estrutura de Pastas

```
.
├── .github/workflows/
│   ├── run-unit-tests.yml
│   └── run-e2e-tests.yml
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose-e2e.yml
│   └── init.sql
├── migrations/
├── src/
│   ├── application/
│   ├── domain/
│   ├── infrastructure/
│   ├── presentation/
│   └── scripts/
├── test/
│   ├── factories/
│   ├── root.e2e-spec.ts
│   ├── auth.e2e-spec.ts
│   ├── entries.e2e-spec.ts
│   └── user.e2e-spec.ts
└── insomnia-collection.json
```

## 🌐 Acesso em Produção (Vercel)

A aplicação e seus endpoints estão implantados publicamente na Vercel. 
Você pode testar a API através da documentação interativa do Swagger:

👉 **Swagger UI:** [https://english-dictionary-api.vercel.app/api](https://english-dictionary-api.vercel.app/api)

## 🚀 Como Iniciar

### Pré-requisitos

- Node.js 20+
- Docker + Docker Compose

### Passo a passo

```bash
# 1) Instalar dependências
npm install

# 2) Configurar env
cp .env.example .env

# 3) Subir PostgreSQL (dev)
npm run db:up

# 4) Executar migrations
npx typeorm-ts-node-commonjs migration:run -d src/infrastructure/db/data-source.ts

# 5) Iniciar API
npm run start:dev
```

API disponível em `http://localhost:3000`  
Swagger em `http://localhost:3000/api`

## 📌 Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `npm run start:dev` | Inicia API em desenvolvimento |
| `npm run build` | Compila o projeto |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E (com migrations e banco e2e) |
| `npm run import:words` | Baixa e importa palavras do repositório dwyl |
| `npm run db:up` / `npm run db:down` | Sobe/derruba banco local (5436) |
| `npm run db:e2e:up` / `npm run db:e2e:down` | Sobe/derruba banco e2e (5437) |

## 🐳 Docker

- Banco principal: `docker/docker-compose.yml` (porta `5436`)
- Banco E2E: `docker/docker-compose-e2e.yml` (porta `5437`)

`docker/init.sql` cria extensão `pgcrypto` e função `uuid_v7_generate()`.

## 🧪 Testes E2E

Os E2E estão separados por path e usam factories para reuso:

- `root.e2e-spec.ts`
- `auth.e2e-spec.ts`
- `entries.e2e-spec.ts`
- `user.e2e-spec.ts`

Factory de autenticação: `test/factories/auth.factory.ts`

Para rodar:

```bash
npm run db:e2e:up
npm run test:e2e
```

## 📚 Endpoints Principais

| Método | Rota | Protegida |
|---|---|---|
| GET | `/` | Não |
| POST | `/auth/signup` | Não |
| POST | `/auth/signin` | Não |
| GET | `/entries/en` | Sim |
| GET | `/entries/en/:word` | Sim |
| POST | `/entries/en/:word/favorite` | Sim |
| DELETE | `/entries/en/:word/unfavorite` | Sim |
| GET | `/user/me` | Sim |
| GET | `/user/me/history` | Sim |
| GET | `/user/me/favorites` | Sim |

## 🛠️ Stack

| Tecnologia | Versão |
|---|---|
| Node.js | 20+ |
| NestJS | 11 |
| TypeScript | 5 |
| TypeORM | 0.3+ |
| PostgreSQL | 16 |
| JWT + Passport | 11 / 0.7 |
| Jest + Supertest | 30 / 7 |
| Swagger | OpenAPI 3 |
