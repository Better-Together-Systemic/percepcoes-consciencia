# Arquitetura

## Visão geral

```
 Navegador ──HTTPS──▶  API Fastify (mesma origem)  ──HTTPS──▶  Anthropic API
   SPA React           ├─ /api/auth      (sessão)
                       ├─ /api/users     (admin)
                       ├─ /api/analysis  (IA)
                       └─ /*             (SPA estático)
                              │
                           SQLite
```

## Decisões

### 1. Monólito modular, não microserviços

O domínio tem três capacidades pequenas (autenticação, usuários, análise) e um
único time. Microserviços trariam rede, deploy e observabilidade distribuídos sem
ganho real. Cada módulo em `apps/api/src/modules/*` tem rotas, serviço e
repositório próprios e só se comunica por interfaces. O módulo `analysis` depende
apenas da porta `AnalysisGenerator`, então pode virar um serviço separado (por
exemplo, uma fila de análises) sem mexer no resto.

### 2. A chave da IA vive só no servidor

O protótipo chamava `api.anthropic.com` direto do navegador. Agora a API é o
único cliente da Anthropic: o navegador nunca vê a chave, e a API aplica
autenticação e rate limit antes de qualquer chamada paga.

### 3. Structured outputs com o schema compartilhado

O schema Zod `analysisResultSchema` (em `@percepcoes/shared`) é enviado como
formato de saída ao Claude. Os campos de catálogo (`dinamica`, `lei`, `feridas`,
`origem`, músicas) são `enum`, então o modelo não consegue inventar nomes, e o
frontend recebe um tipo garantido. Isso substitui as quatro tentativas de
`JSON.parse` com regex do protótipo.

### 4. Pacote `shared` como contrato único

Catálogo de domínio, schemas de request/response e tipos ficam num só lugar, usados
pela API, pelo prompt e pelo frontend. As cores ficam fora: o tema visual é
responsabilidade do frontend (`features/analysis/theme.ts`). Constantes usadas
pelo navegador ficam em `constants.ts`, sem Zod, para o bundle não carregar a
biblioteca.

### 5. SQLite

Volume de dados pequeno (dezenas de usuários), sem escrita concorrente
significativa. SQLite em modo WAL num volume persistente é simples, rápido e
fácil de copiar para backup. O repositório isola o SQL; migrar para Postgres
exige trocar só `db/` e `users.repository.ts`.

## Segurança

| Risco (protótipo)                        | Mitigação                                                                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Senhas em texto puro no HTML             | Hash scrypt (N=2¹⁷) com salt; admin inicial só via variável de ambiente                                                                                               |
| Login validado no navegador              | Autenticação e autorização no servidor, em todas as rotas                                                                                                             |
| Chave da IA exposta ao cliente           | Chamada à Anthropic só pela API                                                                                                                                       |
| Usuários perdidos ao recarregar a página | Persistência em SQLite                                                                                                                                                |
| Sessão                                   | JWT HS256 em cookie `httpOnly`, `SameSite=Strict`, `Secure` em produção; o usuário é recarregado do banco a cada request (remover um usuário revoga o acesso na hora) |
| CSRF                                     | SameSite=Strict + checagem do header `Origin` + só aceita `application/json`                                                                                          |
| XSS                                      | React escapa todo conteúdo (inclusive o texto gerado pela IA); CSP sem `unsafe-inline`                                                                                |
| Força bruta / abuso de custo             | Rate limit: login 5/min, análise 20/hora                                                                                                                              |
| Enumeração de usuários                   | Mesma mensagem e mesmo tempo de resposta para usuário inexistente e senha errada                                                                                      |
| Prompt injection                         | Relato enviado delimitado e marcado como dado; a saída é restrita pelo schema                                                                                         |
| Vazamento em logs                        | Cookies e headers de autorização são mascarados; o relato nunca é logado                                                                                              |
| Clickjacking / sniffing                  | Helmet: `frame-ancestors 'none'`, `nosniff`, HSTS                                                                                                                     |

### Privacidade (LGPD)

Os relatos são dados sensíveis de saúde emocional. A API **não armazena** relatos
nem resultados: eles passam pela memória, vão para a Anthropic e voltam ao
navegador. Os logs registram só metadados (usuário, tamanho, duração). Se um dia
houver histórico de análises, ele vai precisar de base legal, consentimento
explícito e criptografia em repouso.
