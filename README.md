# Percepções & Consciência · Visão Sistêmica

Aplicação de apoio a constelação familiar: a pessoa descreve uma situação e recebe uma
leitura sistêmica (dinâmica, lei, feridas, origem, perguntas de investigação, frases,
exercícios e músicas) gerada pelo Claude.

Reescrita em React + API Node a partir do protótipo de arquivo único, que está
preservado em [`legacy/`](legacy/) apenas como referência.

## Stack

| Camada    | Tecnologia                                                              |
| --------- | ----------------------------------------------------------------------- |
| Frontend  | React 19, Vite 8, TypeScript, TanStack Query, React Router, CSS Modules |
| API       | Node 24, Fastify 5, TypeScript, SQLite (better-sqlite3)                 |
| IA        | Anthropic SDK, structured outputs validados com Zod                     |
| Contratos | Pacote `@percepcoes/shared` (catálogo de domínio + schemas Zod)         |
| Qualidade | Vitest, ESLint, Prettier, GitHub Actions                                |

## Estrutura

```
.
├── apps/
│   ├── api/                      # API Fastify (BFF + auth + proxy da IA)
│   │   ├── src/
│   │   │   ├── config/env.ts     # variáveis de ambiente validadas com Zod
│   │   │   ├── db/               # conexão SQLite + migrações
│   │   │   ├── lib/              # erros de domínio, hash de senha (scrypt)
│   │   │   ├── plugins/          # segurança, sessão, erros, SPA estático
│   │   │   ├── modules/
│   │   │   │   ├── auth/         # login, logout, sessão
│   │   │   │   ├── users/        # CRUD de usuários (admin)
│   │   │   │   └── analysis/     # prompt + integração com o Claude
│   │   │   ├── app.ts            # composition root (testável, sem rede)
│   │   │   └── server.ts         # bootstrap + graceful shutdown
│   │   └── test/                 # testes de integração via fastify.inject
│   └── web/                      # SPA React
│       └── src/
│           ├── app/              # providers, router, query client
│           ├── features/         # auth, admin, analysis (fatias verticais)
│           ├── shared/           # cliente HTTP, UI kit, layout, hooks
│           └── styles/           # design tokens + global
├── packages/
│   └── shared/                   # catálogo + schemas compartilhados
├── docs/ARCHITECTURE.md          # decisões de arquitetura e segurança
├── Dockerfile / docker-compose.yml
└── legacy/                       # HTML original (não é servido)
```

## Rodando localmente

Pré-requisito: **Node 24** (ver `.nvmrc`). O `better-sqlite3` é compilado para a versão
do Node usada no `npm install`; `npm run dev` recusa iniciar com outra versão.

```bash
nvm use                      # usa o Node 24 do .nvmrc
npm install
cp .env.example .env
# edite .env: JWT_SECRET (openssl rand -hex 32), ANTHROPIC_API_KEY, ADMIN_PASSWORD
npm run dev                  # API em :3333 e web em :5173
```

Acesse http://localhost:5173 e entre com o `ADMIN_USERNAME`/`ADMIN_PASSWORD` do `.env`.
O admin inicial é criado só no primeiro boot; depois disso, remova `ADMIN_PASSWORD` do
`.env` e cadastre os demais usuários pelo painel **Admin**.

Sem `ANTHROPIC_API_KEY` o app funciona, mas a análise responde 503.

## Scripts

| Comando             | O que faz                                     |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | API (tsx watch) + web (Vite) com proxy `/api` |
| `npm test`          | testes da API                                 |
| `npm run lint`      | ESLint em todo o monorepo                     |
| `npm run typecheck` | `tsc` em todos os pacotes                     |
| `npm run build`     | build do web (Vite) e da API (tsup)           |
| `npm start`         | sobe a API compilada                          |

## Produção

Uma única imagem serve a API e o SPA na mesma origem (o cookie de sessão é
`SameSite=Strict`, então a mesma origem é necessária):

```bash
docker compose up --build
```

Ou sem Docker: `npm run build` e então `WEB_DIST_PATH=../web/dist NODE_ENV=production npm start`.

Checklist:

- `NODE_ENV=production` (ativa cookie `Secure` e HSTS), servido atrás de HTTPS.
- `APP_ORIGIN` igual à URL pública (ex.: `https://app.seudominio.com`).
- `TRUST_PROXY=true` se houver proxy reverso/load balancer na frente.
- `JWT_SECRET` aleatório e exclusivo por ambiente; trocar invalida todas as sessões.
- Volume persistente para `DATABASE_PATH` e backup do arquivo SQLite.

## API

| Método | Rota               | Acesso  | Descrição                       |
| ------ | ------------------ | ------- | ------------------------------- |
| GET    | `/api/health`      | público | healthcheck                     |
| POST   | `/api/auth/login`  | público | login (5 tentativas/min por IP) |
| POST   | `/api/auth/logout` | público | encerra a sessão                |
| GET    | `/api/auth/me`     | logado  | usuário da sessão               |
| GET    | `/api/users`       | admin   | lista usuários                  |
| POST   | `/api/users`       | admin   | cria aluno                      |
| DELETE | `/api/users/:id`   | admin   | remove aluno                    |
| POST   | `/api/analysis`    | logado  | gera a análise (20/hora por IP) |

Erros seguem sempre o formato `{ "error": { "code": "...", "message": "..." } }`.
# percepcoes-consciencia
