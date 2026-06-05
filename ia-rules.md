# Regras de IA — Boas Práticas e Arquitetura

Documento consolidado para **IDEs e LLMs fora do Cursor** (Windsurf, Copilot Chat, Claude, ChatGPT, etc.).

> **Cursor:** a fonte da verdade são os arquivos em `.cursor/rules/*.mdc`. Este arquivo é opcional no Cursor — pode ser removido sem impacto. Veja `ia-rules-usage.md` para detalhes.

Objetivo: produzir código que passe em code review de time sênior na primeira tentativa.

---

## 1. Princípios gerais

- **Consistência acima de preferência pessoal.** Antes de escrever código, observe o padrão existente no módulo, pacote ou repositório e replique-o.
- **Mudança mínima necessária.** Resolva o problema pedido sem refatorar, renomear ou reorganizar código não relacionado.
- **Legibilidade > cleverness.** Código óbvio e direto é preferível a abstrações prematuras ou truques difíceis de manter.
- **Fail fast, fail loud.** Valide entradas cedo; erros devem ser explícitos, rastreáveis e com contexto suficiente para debug.
- **Sem código morto.** Não deixe imports, variáveis, comentários obsoletos ou blocos comentados "para depois".
- **Sem segredos no código.** Credenciais, tokens e chaves ficam em variáveis de ambiente ou vault — nunca commitados, logados ou expostos em API (ver seção 11).
- **Sem libs novas por padrão.** Reutilize dependências e utilitários do projeto; peça permissão antes de adicionar pacote externo (ver seção 6).
- **Complexidade controlada.** Se a função ficou difícil de ler ou testar, simplifique antes do PR (ver seção 5).

---

## 1.1 Reutilização antes de criar

**Antes de criar arquivo, função, classe, componente ou utilitário novo**, busque no projeto se já existe equivalente.

### Checklist de descoberta

1. Buscar por nome, responsabilidade e termos do domínio (grep, busca semântica, estrutura de pastas).
2. Verificar módulos compartilhados: `shared/`, `common/`, `lib/`, `utils/`, `helpers/`, `@company/*`.
3. Verificar se a lógica já existe parcialmente em service, hook, middleware ou teste reutilizável.
4. Se existir → **estender ou reutilizar**; não duplicar com outro nome.

### Quando criar algo novo

- Não há implementação equivalente no repo.
- Estender o existente violaria SRP ou acoplaria módulos incompatíveis — documente no PR por quê.
- Arquivo novo segue convenção de pasta e nomenclatura do projeto.

```typescript
// ❌ Criar utils/formatCurrency.ts sem buscar
// ✅ Encontrou formatMoney em shared/currency — reutilizar ou extrair para lá se genérico
```

---

## 2. Idioma e nomenclatura

### 2.1 Idioma do projeto

| Contexto | Regra |
|----------|-------|
| Logs, mensagens de erro, exceções, métricas, eventos de observabilidade | **Mesmo idioma do projeto.** Se o projeto usa inglês, mantenha inglês. Não misture PT/EN no mesmo módulo. |
| Comentários de código | Idioma do time/projeto (geralmente o mesmo dos logs). |
| Nomes de variáveis, funções, classes, arquivos, endpoints, tabelas | **Inglês** (padrão de mercado), salvo convenção explícita do repositório. |
| Documentação de API (OpenAPI, README técnico) | Idioma definido pelo projeto; se não houver, inglês. |
| Commits e PRs | Idioma do time; mensagens claras no imperativo ("Add user validation", "Fix null pointer in checkout"). |

### 2.2 Convenções de nomenclatura

```
CONSTANTS_AND_ENUM_VALUES     → SCREAMING_SNAKE_CASE (UPPER_CASE)
classes / types / interfaces  → PascalCase
functions / methods           → camelCase (JS/TS/Java) ou snake_case (Python/Rust conforme idioma)
variables / parameters        → camelCase ou snake_case conforme linguagem
private/internal members      → prefixo ou convenção da linguagem (_prefix, #field)
files / modules               → kebab-case ou snake_case conforme ecossistema
environment variables         → SCREAMING_SNAKE_CASE
database columns              → snake_case (salvo ORM que imponha outro padrão)
HTTP routes                   → kebab-case, plural para recursos (/users, /order-items)
```

**Constantes:** valores imutáveis, magic numbers nomeados e chaves de config fixa **sempre** em caixa alta.

```typescript
// ✅ Correto
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_PAGE_SIZE = 20;
const HTTP_STATUS_NOT_FOUND = 404;

// ❌ Evitar
const maxRetryAttempts = 3;
const default_page_size = 20;
```

### 2.3 Clareza e legibilidade nos nomes

**Priorize clareza de leitura** — o nome deve revelar intenção, contexto de domínio e unidade quando aplicável.

| Ruim (genérico) | Bom (contextual) |
|-----------------|------------------|
| `data`, `info`, `result` | `orderSummary`, `paymentReceipt`, `validationErrors` |
| `temp`, `aux`, `x` | `retryCount`, `normalizedEmail`, `pendingInvoices` |
| `flag`, `status` | `isPaymentConfirmed`, `subscriptionStatus` |
| `process()` | `calculateOrderTotal()` |
| `handle()` | `sendPasswordResetEmail()` |

Regras:

- Nomeie variáveis pelo **papel no fluxo atual**, não por tipo técnico (`userList` > `array`).
- Booleanos: prefixo `is`, `has`, `can`, `should` (`isEligibleForDiscount`).
- Coleções no plural; item singular (`orders`, `order`).
- Evite abreviações obscuras (`cfg`, `mgr`, `proc`) — salvo siglas do domínio (CPF, IBAN, HTTP).
- Mesmo contexto → mesmos termos (não alternar `customer`/`client`/`user` sem motivo).
- Funções: verbo + objeto (`validatePaymentInput`, `fetchActiveSubscriptions`).

---

## 3. Arquitetura e design

### 3.1 Camadas e responsabilidades

- **Separation of concerns:** controller/handler → service/use-case → repository/gateway. Cada camada com uma responsabilidade clara.
- **Dependency inversion:** dependa de abstrações (interfaces/ports), não de implementações concretas.
- **Domain no centro:** regras de negócio ficam na camada de domínio/application, não em controllers ou ORM.
- **Thin controllers, fat services:** handlers apenas orquestram HTTP/CLI/eventos; lógica fica abaixo.
- **DTOs na borda:** nunca exponha entidades de persistência diretamente na API.

### 3.2 Padrões recomendados

| Situação | Abordagem |
|----------|-----------|
| Lógica de negócio complexa | Use cases / application services |
| Integração externa | Adapters/gateways com interface própria |
| Estado compartilhado | Injeção de dependência; evitar singletons globais mutáveis |
| Configuração | Centralizada, tipada, validada no boot |
| Feature flags | Serviço dedicado ou provider, não `if` espalhado |
| Eventos assíncronos | Outbox pattern ou fila quando consistência importa |

### 3.3 O que evitar em code review

- God classes e funções com mais de ~40 linhas sem justificativa.
- Acoplamento circular entre módulos.
- Lógica duplicada (DRY com moderação — duplicação acidental > abstração errada).
- `any` / tipos frouxos sem motivo documentado.
- Side effects escondidos em getters ou funções com nome que não indica efeito.
- Catch genérico que engole erro (`catch (e) {}` ou `except: pass`).

---

## 4. Código limpo

### 4.1 Funções e métodos

- Uma função, uma responsabilidade.
- Máximo de 3–4 parâmetros; acima disso, use objeto/DTO de entrada.
- Retornos previsíveis: evite `null` quando optional types ou Result/Either forem suportados.
- Early return para reduzir aninhamento.

### 4.2 Comentários

- Comente **por quê**, não **o quê** — o código deve explicar o quê.
- TODO/FIXME devem ter ticket/issue associado (`// TODO(JIRA-123): ...`).
- Não comente código óbvio.

### 4.3 Tratamento de erros

- Mensagens de erro com contexto: o quê falhou, identificadores relevantes (sem PII sensível).
- Use exceções tipadas ou códigos de erro estáveis para APIs.
- Propague ou transforme erros na camada correta; não logue e engula na mesma função.
- Transações: rollback em falha; idempotência em retentativas.

---

## 5. Complexidade e análise estática (SonarQube)

Antes de abrir PR, analise mentalmente (ou rode localmente) como o SonarQube analisaria o código. O objetivo é **zero issues críticas/blocker** e **zero issues médias evitáveis** no código alterado.

### 5.1 Métricas de complexidade — limites recomendados

| Métrica | Limite sugerido | Ação se ultrapassar |
|---------|-----------------|---------------------|
| Complexidade cognitiva (função) | ≤ 15 | Extrair subfunções, early return, reduzir nesting |
| Complexidade ciclomática | ≤ 10 por função | Simplificar condicionais, strategy pattern |
| Linhas por função | ≤ 40 | Dividir responsabilidades |
| Parâmetros por função | ≤ 4 | Agrupar em objeto/DTO |
| Níveis de aninhamento (`if/for`) | ≤ 3 | Guard clauses, extrair bloco |
| Linhas por arquivo | ≤ 300–400 | Dividir módulo por domínio |
| Duplicação de código | 0 blocos idênticos > 5 linhas | Extrair função/componente compartilhado |
| Acoplamento entre classes | Baixo | Interfaces, injeção de dependência |

### 5.2 Sinais de complexidade excessiva — refatore antes do review

- Função difícil de explicar em uma frase.
- Múltiplos `switch`/`if-else` encadeados para o mesmo conceito.
- Flags booleanas que alteram metade do comportamento da função.
- Classe que conhece detalhes de HTTP, banco, fila e regra de negócio ao mesmo tempo.
- Testes que precisam de dezenas de mocks para uma única unidade.
- Comentários longos explicando fluxo que deveria ser código legível.

**Técnicas de redução:** extract method, strategy, polymorphism, pipeline, tabela de decisão, eliminar estado mutável desnecessário.

### 5.3 Issues críticas / blocker (SonarQube) — nunca mergear

| Categoria | Exemplos | Prevenção |
|-----------|----------|-----------|
| **Vulnerabilidades** | SQL injection, command injection, XSS, hardcoded secrets, weak crypto | Ver seção 11 |
| **Bugs graves** | Resource leak, race condition, null dereference não tratado | try-with-resources, null checks, locks adequados |
| **Security hotspots** | Credencial em código, deserialização insegura, `eval()` | Scan de secrets, banir APIs perigosas |
| **Reliability blocker** | Thread não fechada, conexão DB sem close | finally/defer/using, connection pool |

### 5.4 Issues médias (SonarQube) — corrigir no mesmo PR

| Issue comum | Correção |
|-------------|----------|
| Cognitive complexity > 15 | Refatorar função |
| Duplicated blocks | Extrair helper compartilhado |
| Empty catch block | Log + rethrow ou tratamento explícito |
| TODO sem ticket | Associar issue ou remover |
| `@SuppressWarnings` / `eslint-disable` sem motivo | Corrigir causa raiz ou documentar exceção |
| Magic numbers | Constantes nomeadas em UPPER_CASE |
| Função com > 7 parâmetros | DTO de entrada |
| Uso de deprecated API | Migrar para API suportada |
| Condição sempre true/false | Remover dead code |
| String concatenation em loop | StringBuilder/join/template |

### 5.5 Checklist de auto-análise antes do PR

- [ ] Nenhuma função nova ultrapassa limites de complexidade
- [ ] Sem duplicação de blocos copiados de outro arquivo
- [ ] Sem `catch` vazio, `@ts-ignore` ou suppressions desnecessárias
- [ ] Sem secrets, tokens ou URLs internas hardcoded
- [ ] SonarQube/linters locais executados sem issues novas no diff

---

## 6. Dependências e bibliotecas

### 6.1 Regra principal

**Não adicionar bibliotecas externas sem permissão explícita do usuário ou do time.**

Antes de importar um pacote novo:

1. Verifique se o projeto **já possui** lib equivalente (`package.json`, `go.mod`, `requirements.txt`, `pom.xml`, etc.).
2. Verifique utilitários internos do repositório (`shared/`, `common/`, `lib/`, `@company/*`).
3. Se precisar de lib nova → **pergunte primeiro**, informando: nome, motivo, alternativa nativa avaliada, impacto no bundle/tamanho e licença.

### 6.2 Quando reutilizar o que já existe

| Necessidade | Prioridade |
|-------------|------------|
| HTTP client | Lib já usada no projeto (axios, fetch, got, requests…) |
| Validação | Schema lib do projeto (Zod, Joi, Pydantic…) |
| Datas | Lib padrão do repo (date-fns, dayjs, java.time…) |
| UUID/random | Stdlib ou lib já presente |
| Testes | Runner + matchers + Faker já configurados |

### 6.3 Se nova dependência for aprovada

- Versão fixada (sem `*` ou range solto em prod).
- Licença compatível com política da empresa (MIT/Apache OK; GPL pode exigir revisão legal).
- Verificar última manutenção, downloads e CVEs conhecidos.
- Documentar no PR **por que** a lib foi escolhida e quais alternativas foram descartadas.
- Não adicionar lib inteira por uma única função — preferir implementação mínima ou stdlib.

### 6.4 Proibido sem aprovação

- Copiar código de Stack Overflow/npm gist para dentro do repo como "utilitário".
- Dependências de autores desconhecidos ou pacotes com typosquatting risk.
- Libs que executam código remoto, telemetria oculta ou postinstall scripts suspeitos.

---

## 7. Logs e observabilidade

- **Nível adequado:** `debug` (dev), `info` (fluxo normal), `warn` (degradado recuperável), `error` (falha que precisa ação).
- **Estruturado:** preferir JSON/logs estruturados com campos fixos (`level`, `message`, `traceId`, `userId`, `durationMs`).
- **Correlação:** propague `traceId`/`requestId` em toda a cadeia.
- **Não logue:** senhas, tokens, cartões, CPF completo, payloads com dados sensíveis.
- **Consistência de idioma:** mensagens de log no idioma do projeto (ver seção 2.1).
- **Métricas:** contadores para falhas/sucesso, histogramas para latência — nomes em snake_case ou convenção do stack (Prometheus, etc.).

```json
{
  "level": "error",
  "message": "Failed to process payment",
  "traceId": "abc-123",
  "orderId": "ord_456",
  "errorCode": "PAYMENT_GATEWAY_TIMEOUT"
}
```

---

## 8. Testes

### 8.1 Metas mínimas

| Métrica | Meta |
|---------|------|
| Cobertura de linhas (unitários) | **≥ 90%** em código de domínio e services |
| Cobertura de branches | **≥ 85%** em lógica condicional crítica |
| Testes de integração | Fluxos principais e contratos de API |
| Regressão | Todo bug fix deve incluir teste que falharia antes do fix |

Exclua da meta de cobertura: arquivos de config, migrations, generated code, main/bootstrap — documente exclusões no CI.

### 8.2 Pirâmide de testes

```
        /\
       /E2E\          poucos, críticos
      /------\
     / integr \       contratos, DB, filas
    /----------\
   /  unitários \     maioria, rápidos, isolados
  /--------------\
```

### 8.3 Unitários — o que testar

- **Happy path** e **edge cases** (vazio, null, limites, overflow).
- **Erros esperados** (exceções, códigos HTTP, validações).
- **Comportamento, não implementação** — evite testar detalhes internos que mudam com refactor.
- **Determinismo:** testes não podem depender de ordem de execução, horário real ou rede (mock/stub).

### 8.4 Dados de teste — Faker e factories

Use bibliotecas de geração de dados para evitar fixtures frágeis e repetitivas:

| Linguagem | Biblioteca comum |
|-----------|------------------|
| JavaScript/TypeScript | `@faker-js/faker`, `factory.ts`, `@ngneat/falso` |
| Python | `Faker`, `factory_boy`, `hypothesis` (property-based) |
| Java/Kotlin | `javafaker`, `EasyRandom`, `Instancio` |
| Go | `gofakeit`, factories manuais tipadas |
| C# | `Bogus`, `AutoFixture` |

**Padrão recomendado — factory + seed fixo em CI:**

```typescript
import { faker } from '@faker-js/faker';

// Seed fixo em CI para reprodutibilidade; aleatório local opcional
faker.seed(process.env.CI ? 42 : Date.now());

export function buildUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    ...overrides,
  };
}

// No teste: dados específicos só onde importa
const user = buildUser({ email: 'fixed@test.com' });
```

**Fixtures estáticas:** use apenas para cenários golden file ou snapshots estáveis.

**Property-based / inputs aleatórios:** em lógica com muitas combinações (parsers, validadores, pricing), considere `fast-check`, `hypothesis` ou `@fast-check/jest`.

### 8.5 Nomenclatura de testes

Padrão: `should_[expectedBehavior]_when_[condition]`

```
should_return_404_when_user_not_found
should_calculate_discount_when_coupon_is_valid
```

### 8.6 Mocks

- Mock apenas colaboradores externos (DB, HTTP, fila, relógio).
- Prefira fakes in-memory para repositórios quando possível.
- Verifique interações críticas, não cada chamada irrelevante.

### 8.7 CI

- Testes rodam em todo PR; build quebra se cobertura cair abaixo do threshold.
- Sem testes `@skip` / `.only` / `.skip` commitados.
- Paralelização e timeout por suite para evitar flakiness silenciosa.

---

## 9. API e contratos

- Versionamento explícito (`/v1/...`) ou header quando breaking changes forem frequentes.
- Validação de input na borda (schema: Zod, Joi, class-validator, Pydantic).
- Respostas de erro padronizadas: `{ "error": { "code", "message", "details" } }`.
- Paginação consistente (`cursor` ou `offset/limit` — um padrão por API).
- Idempotency-Key em operações mutáveis críticas (pagamentos, pedidos).
- OpenAPI/Swagger atualizado junto com o código.

---

## 10. Banco de dados

- Migrations versionadas e reversíveis quando possível.
- Índices para colunas usadas em WHERE/JOIN/ORDER BY de queries frequentes.
- N+1: use eager loading ou queries batch; detecte em review.
- Transações com escopo mínimo necessário.
- Soft delete vs hard delete: siga o padrão do domínio; documente.
- Nunca concatene SQL com input do usuário — parameterized queries sempre (detalhes na seção 11.4).

---

## 11. Segurança — camadas de defesa

Segurança é **em camadas (defense in depth)**. Nenhuma medida isolada substitui validação na borda + autorização + proteção de dados + observabilidade.

### 11.1 Classificação de dados — o que nunca expor

| Classificação | Exemplos | Regra |
|---------------|----------|-------|
| **Crítico** | Senhas, tokens, API keys, private keys, CVV, PIN | Nunca logar, retornar em API, enviar ao client ou commitar |
| **Sensível (PII)** | CPF, RG, endereço completo, e-mail, telefone, data nascimento | Mascarar em logs/UI; criptografar at rest; minimizar coleta |
| **Financeiro** | Conta bancária, agência, PIX, saldo, extrato, cartão (mesmo parcial) | Tokenização; nunca armazenar PAN/CVV; PCI-DSS quando aplicável |
| **Corporativo** | Estratégia, contratos, credenciais de infra, `.env` completo | Need-to-know; secrets manager (Vault, AWS SM) |
| **Sessão** | Session ID, JWT, refresh token, cookies de auth | HttpOnly, Secure, SameSite; rotação; TTL curto |

**Onde NÃO colocar dados sensíveis:**

- Logs, traces, métricas e APM
- Respostas de API, erros de stack trace em produção
- Query strings e URLs (`?token=`, `?cpf=`)
- LocalStorage / sessionStorage (preferir HttpOnly cookies para tokens)
- Comentários de código, commits, screenshots de PR
- `.env.example` (apenas placeholders: `API_KEY=your_key_here`)
- Frontend bundle / HTML renderizado sem encoding
- Mensagens de erro detalhadas para o usuário final ("user X password invalid" → mensagem genérica)

### 11.2 Variáveis de ambiente e secrets

```typescript
// ❌ Nunca
console.log(process.env);
logger.info({ config: process.env });
res.json({ dbUrl: process.env.DATABASE_URL });

// ✅ Correto
const dbUrl = configService.get('DATABASE_URL'); // validado no boot, não exposto
logger.info('Database connection established'); // sem valor da URL
```

- Secrets vêm de vault/secret manager em produção — `.env` só em dev local.
- Rotacionar credenciais comprometidas; nunca reutilizar secrets entre ambientes.
- Scan de secrets no CI (git-secrets, Gitleaks, Sonar secret detection).
- Princípio: código assume que secret **existe**, nunca **contém** o secret.

### 11.3 Autenticação, sessão e prevenção de roubo de sessão

| Ameaça | Mitigação |
|--------|-----------|
| **Session hijacking** | Cookies `HttpOnly` + `Secure` + `SameSite=Strict/Lax`; HTTPS obrigatório |
| **Session fixation** | Regenerar session ID após login bem-sucedido |
| **Token theft (XSS)** | Não guardar JWT em localStorage; preferir cookie HttpOnly ou BFF pattern |
| **Token replay** | TTL curto (access token), refresh com rotação e revogação |
| **Brute force** | Rate limit + lockout progressivo + CAPTCHA após N tentativas |
| **Credential stuffing** | MFA, detecção de senhas vazadas (Have I Been Pwned), alertas |

**JWT:** assinar com algoritmo forte (RS256/ES256); validar `exp`, `iss`, `aud`; não colocar PII no payload; blacklist/revogação para logout.

**Logout:** invalidar sessão server-side ou revogar refresh token; limpar cookie client-side.

### 11.4 Injection e manipulação de input

#### SQL Injection

```typescript
// ❌ Crítico — Sonar blocker
db.query(`SELECT * FROM users WHERE email = '${email}'`);

// ✅ Parameterized / prepared statements
db.query('SELECT * FROM users WHERE email = $1', [email]);
```

- Proibir SQL dinâmico montado com input do usuário (incluindo nomes de tabela/coluna).
- ORMs: cuidado com `$queryRaw` / `execute()` com strings interpoladas.
- Least privilege no usuário do banco (sem `DROP`, sem `SUPER` em runtime app).

#### NoSQL / LDAP / XPath / Command Injection

- Tratar input como dado, nunca como código ou comando.
- Nunca passar input do usuário para `exec`, `spawn`, `eval`, `Function()`, `os.system`.
- Sanitizar paths de arquivo — prevenir path traversal (`../../etc/passwd`).

#### XSS (Cross-Site Scripting)

- **Output encoding** contextual (HTML, JS, URL, CSS) ao renderizar dados do usuário.
- **CSP** (Content-Security-Policy) restritiva; evitar `unsafe-inline` quando possível.
- Frameworks: preferir binding automático (React escapa por padrão); cuidado com `dangerouslySetInnerHTML`.
- Sanitizar HTML rico com lib allowlist (DOMPurify) se necessário.

#### CSRF (Cross-Site Request Forgery)

- Token CSRF em formulários e mutações com cookie-based auth.
- SameSite cookies + verificar `Origin`/`Referer` em requests sensíveis.
- APIs stateless com JWT em header (não cookie) reduzem CSRF, mas exigem proteção XSS reforçada.

### 11.5 Autorização — IDOR e escalonamento de privilégio

- **Default deny:** toda rota/recurso exige verificação explícita de permissão.
- **IDOR:** nunca confiar só no ID da URL — validar que o usuário autenticado **possui** aquele recurso.

```typescript
// ❌ IDOR — qualquer user acessa pedido de outro
getOrder(req.params.orderId);

// ✅ Verificar ownership
getOrder(req.params.orderId, req.user.id);
```

- RBAC/ABAC consistente; não expor endpoints admin sem guard.
- Mass assignment: whitelist de campos no DTO — nunca `...req.body` direto na entidade (`role: 'admin'`).

### 11.6 Outras ameaças comuns

| Ameaça | Prevenção |
|--------|-----------|
| **SSRF** | Validar URLs; blocklist de IPs internos (169.254.x, 127.0.0.1, metadata AWS); sem redirects automáticos para URL do user |
| **Open redirect** | Whitelist de destinos; nunca `redirect(req.query.url)` |
| **Insecure deserialization** | Não deserializar dados não confiáveis; evitar pickle/yaml.load/Java ObjectInputStream com input externo |
| **File upload** | Validar MIME + extensão + tamanho; armazenar fora do webroot; scan antivírus se aplicável |
| **Broken access control** | Testes automatizados de autorização por role |
| **Sensitive data in cache** | Não cachear respostas com PII sem TTL curto e chave por usuário |
| **Timing attacks** | Comparação constant-time para secrets (`crypto.timingSafeEqual`) |
| **Clickjacking** | Header `X-Frame-Options: DENY` ou CSP `frame-ancestors 'none'` |

### 11.7 Headers e transporte

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; ...
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), ...
```

- HTTPS everywhere; HSTS em produção.
- CORS: origens explícitas — nunca `Access-Control-Allow-Origin: *` com credentials.

### 11.8 Dependências e supply chain

- `npm audit` / `pip audit` / Dependabot — CVEs **críticos e altos** bloqueiam merge.
- Lockfile commitado; builds reproduzíveis.
- Verificar integridade (SRI em CDN, checksums).

### 11.9 Resposta a incidentes no código

- Erros genéricos para o cliente; detalhes só em logs internos (sem PII/secrets).
- Audit log para ações sensíveis (login, alteração de permissão, export de dados, pagamento).
- Capacidade de revogar tokens/sessões em massa se vazamento detectado.

---

## 12. Performance

- Meça antes de otimizar (profiler, APM, EXPLAIN ANALYZE).
- Cache com TTL e estratégia de invalidação definida — não cache infinito sem plano.
- Lazy loading vs eager: decisão consciente, não acidental.
- Evite alocações e I/O desnecessários em hot paths.
- Timeouts e circuit breakers em chamadas externas.

---

## 13. Git e code review

### 13.1 Commits

- Atômicos: um commit = uma mudança lógica coerente.
- Mensagem: imperativo, ≤ 72 chars no subject; corpo explica motivo se não óbvio.

### 13.2 Pull requests

- PR pequeno (< ~400 linhas alteradas quando possível).
- Descrição: o quê, por quê, como testar.
- Self-review antes de pedir review — leia o diff como se fosse de outra pessoa.
- Screenshots/evidência para mudanças visuais.

### 13.3 Checklist pré-review (dev sênior)

**Gate de conclusão (ordem):** pre-check (§ 17) → code-review final (§ 17.4) → checklist abaixo.

- [ ] Pre-check executado: lint, typecheck, test e build passaram (comandos do projeto)
- [ ] Erros do pipeline corrigidos e documentados (se houve falhas)
- [ ] Code-review final (sênior/arquiteto) realizado; blockers resolvidos
- [ ] Segue convenções de idioma, nomenclatura e formatação do repo
- [ ] Buscou no projeto antes de criar arquivo/lógica nova; reutilizou o existente
- [ ] Variáveis e funções com nomes claros e contextuais (legibilidade)
- [ ] Constantes em UPPER_CASE; sem magic numbers soltos
- [ ] Complexidade dentro dos limites (seção 5); sem duplicação evitável
- [ ] Nenhuma lib nova sem aprovação; reutilizou o que o projeto já tem
- [ ] Logs estruturados, nível correto, sem dados sensíveis
- [ ] Nenhum secret, token, PII ou dado bancário exposto (logs, API, env, frontend)
- [ ] Queries parametrizadas; autorização verificada (sem IDOR)
- [ ] Testes unitários com cobertura ≥ 90% no código alterado
- [ ] Dados de teste via factory/Faker; cenários edge cobertos
- [ ] Sem código morto, TODOs sem ticket, ou `@ts-ignore` sem justificativa
- [ ] Erros tratados e propagados corretamente
- [ ] Documentação/API schema atualizados se contrato mudou
- [ ] Migrations e rollback considerados
- [ ] Performance e segurança avaliadas para mudanças sensíveis
- [ ] SonarQube/linters sem issues críticas ou médias novas no diff

---

## 14. Formatação e lint

- Use formatter e linter do projeto (Prettier, ESLint, Ruff, golangci-lint, etc.) — **nunca** desabilite regra globalmente sem consenso.
- Imports ordenados conforme config do repo.
- Linha máxima: respeite limite do projeto (geralmente 80–120 cols).
- Hooks de pre-commit (lint + test) devem passar antes do push.

---

## 15. Documentação mínima exigida

- README com setup, env vars necessárias e como rodar testes.
- ADR (Architecture Decision Record) para decisões estruturais relevantes.
- JSDoc/docstrings apenas em APIs públicas, comportamento não óbvio ou contratos de lib interna.

---

## 16. Prompt-engineering — conduta da IA

Regras de **como a IA deve pensar, planejar e comunicar** antes e durante a execução de tarefas.

### 16.1 Metaprompt e autoconsciência

Antes de agir, a IA deve internalizar seu papel e limites:

- **Papel:** assistente sênior — qualidade de code review, não velocidade a qualquer custo.
- **Escopo:** resolver o pedido do usuário; não expandir escopo sem alinhamento.
- **Limites:** não inventar requisitos, APIs ou arquivos que não existem; não assumir stack não confirmada.
- **Autoavaliação:** "Tenho contexto suficiente? Estou duplicando algo? Minha abordagem viola regras de segurança ou dependências?"

Metaprompt interno (mental, antes de cada tarefa não trivial):

```
Sou um dev/agent sênior. Vou buscar o que já existe no projeto antes de criar.
Vou nomear com clareza, testar, proteger dados sensíveis e pedir confirmação quando houver ambiguidade.
Se o plano mudar durante a execução, informo o usuário.
```

### 16.2 Planejamento com aceite — obrigatório antes de executar

**Tarefas não triviais** (nova feature, refactor, múltiplos arquivos, decisão arquitetural): **não execute imediatamente**.

Primeiro, retorne um **metadado de planejamento** e aguarde aceite do usuário.

#### Template de planejamento

```markdown
## Planejamento — [título da tarefa]

**Objetivo:** [uma frase]
**Contexto assumido:** [o que foi inferido do pedido e do repo]
**Fora de escopo:** [o que não será feito nesta entrega]

### Etapas
| # | Etapa | Arquivos/área | Resultado esperado |
|---|-------|---------------|-------------------|
| 1 | ... | ... | ... |
| 2 | ... | ... | ... |

### Descobertas no projeto
- [ ] Já existe: ... → reutilizar/estender
- [ ] Criar novo: ... → justificativa

### Riscos e decisões
- ...

**Aceite:** Responda **"pode executar"** (ou ajuste o plano) para eu iniciar.
```

#### Quando pular o planejamento formal

- Perguntas informativas ("como funciona X?").
- Correções óbvias de 1–2 linhas explicitamente pedidas.
- Usuário disse "pode executar direto" ou equivalente.

### 16.3 Cadeia de pensamentos (Chain of Thought)

Durante e após a execução, explicar de forma **encadeada e concisa**:

1. **Entendi:** o que o pedido pedia.
2. **Verifiquei:** o que busquei no projeto / o que encontrei.
3. **Decidi:** abordagem escolhida e por quê (alternativas descartadas em 1 linha).
4. **Fiz:** o que foi implementado/alterado.
5. **Validação:** pre-check (lint, typecheck, test, build), correções documentadas, code-review final, checklist aplicados.

Não dump de raciocínio verboso — parágrafos curtos ou bullets. O usuário deve conseguir auditar decisões.

Exemplo pós-implementação:

```
Entendi: adicionar validação de CPF no cadastro.
Verifiquei: já existe validateDocument em shared/validators — reutilizei.
Decidi: estender validateDocument em vez de novo arquivo (evita duplicação).
Fiz: integrei no UserRegistrationService + 3 testes edge.
Validação: cobertura 94% no service; lint ok.
```

### 16.4 Dúvidas — perguntar antes com árvore de decisão

Se faltar contexto, requisito ambíguo ou múltiplas abordagens válidas → **pare e pergunte** antes de codar.

Apresente opções como **árvore de decisão** (ramos claros):

```markdown
Preciso de uma decisão antes de continuar:

**Contexto:** [o que está ambíguo]

**Opção A — [nome]**
- O quê: ...
- Prós: ...
- Contras: ...

**Opção B — [nome]**
- O quê: ...
- Prós: ...
- Contras: ...

**Recomendação:** [A/B] porque ...

Qual opção prefere? (ou descreva outro caminho)
```

#### Quando perguntar (obrigatório)

- Comportamento não especificado e impacto funcional (ex.: soft delete vs hard delete).
- Breaking change em API ou schema.
- Nova dependência ou padrão arquitetural.
- Dados sensíveis ou fluxo de auth/pagamento sem spec clara.
- Conflito entre regra do projeto e pedido do usuário.

#### Quando não perguntar

- Detalhe de implementação coberto por convenção do repo.
- Escolha entre equivalentes triviais (ex.: nome de variável local óbvio).
- Usuário já definiu explicitamente no prompt.

### 16.5 Técnicas complementares

| Técnica | Uso |
|---------|-----|
| **Decomposição** | Dividir tarefa grande em etapas do plano |
| **Few-shot implícito** | Seguir padrão de código existente no mesmo módulo |
| **Restrições explícitas** | Lembrar limites (sem lib nova, cobertura 90%, etc.) |
| **Verificação final** | Checklist pré-review antes de declarar concluído |
| **Rollback mental** | Se abordagem falhar, explicar e propor plano B |

### 16.6 Anti-patterns de conduta da IA

| Evitar | Fazer |
|--------|-------|
| Criar arquivo sem buscar no projeto | Buscar → reutilizar → só então criar |
| Executar refactor grande sem plano | Plano + aceite |
| Assumir requisito silenciosamente | Perguntar com opções A/B |
| Resposta só com código, zero contexto | CoT resumido: entendi → fiz → validei |
| "Pronto!" sem testes em código novo | Pre-check completo + cobertura conforme regras |
| Ignorar ambiguidade | Árvore de decisão |

---

## 17. Pre-check / Pre-CI-CD

**Nunca declare a tarefa concluída** sem executar este pipeline no projeto alterado e registrar o resultado.

Ordem obrigatória:

```
1. Descobrir comandos do projeto
2. Lint → Typecheck → Test → Build
3. Corrigir erros (se houver) e reexecutar até passar
4. Sessão de code-review (sênior/arquiteto)
5. Só então: tarefa concluída
```

### 17.1 Descobrir comandos do projeto

Antes de rodar qualquer comando, **inspecione o repositório** — não assuma npm/yarn se o projeto usa outra stack.

#### Onde buscar (ordem de prioridade)

1. `package.json` → campo `scripts`
2. `Makefile` / `justfile`
3. `pyproject.toml`, `setup.cfg`, `tox.ini`
4. `Cargo.toml`, `go.mod`, `pom.xml`, `build.gradle`, `*.csproj`
5. CI: `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`, `azure-pipelines.yml`
6. `README.md`, `CONTRIBUTING.md`, `docs/`

#### Mapeamento por stack

| Stack | Lint | Typecheck | Test | Build |
|-------|------|-----------|------|-------|
| **Node/TS** | `npm run lint` / `pnpm lint` | `npm run typecheck` / `tsc --noEmit` | `npm test` / `vitest` / `jest` | `npm run build` |
| **Python** | `ruff check` / `flake8` | `mypy` / `pyright` | `pytest` | `python -m build` |
| **Go** | `golangci-lint run` | (compilador) | `go test ./...` | `go build ./...` |
| **Rust** | `cargo clippy` | (compilador) | `cargo test` | `cargo build --release` |
| **Java/Kotlin** | Checkstyle via Gradle | compilador | `./gradlew test` | `./gradlew build` |
| **C#** | `dotnet format --verify-no-changes` | compilador | `dotnet test` | `dotnet build` |

#### Regras de descoberta

- Use **exatamente** o script definido no projeto — não invente comandos genéricos.
- Monorepo: rode comandos **no diretório/workspace correto**.
- Se CI difere do README, **priorize o CI**.
- Sem typecheck explícito → documente "N/A" e prossiga.

#### Template de descoberta

```markdown
**Stack detectada:** [ex.: Node 20 + pnpm]
| Etapa | Comando | Fonte |
|-------|---------|-------|
| Lint | `pnpm lint` | package.json |
| Typecheck | `pnpm typecheck` | package.json |
| Test | `pnpm test` | package.json |
| Build | `pnpm build` | package.json |
```

### 17.2 Executar o pipeline

Execute **cada etapa em sequência**. Se uma falhar, **pare**, corrija, reexecute a etapa e as seguintes.

| Etapa | Objetivo |
|-------|----------|
| **Lint** | Estilo, imports, regras estáticas — corrigir sem desabilitar regras globalmente |
| **Typecheck** | Erros de tipo — evitar `@ts-ignore` sem justificativa |
| **Test** | Regressão + cobertura ≥ 90% no código alterado |
| **Build** | Compilação/bundle sem erro |

```markdown
## Pre-check — execução
| Etapa | Comando | Resultado |
|-------|---------|-----------|
| Lint | `...` | ✅ / ❌ |
| Typecheck | `...` | ✅ / ❌ |
| Test | `...` | ✅ / ❌ |
| Build | `...` | ✅ / ❌ |
```

### 17.3 Tratamento de erros

1. **Identificar** — arquivo, linha, causa.
2. **Corrigir** — fix mínimo alinhado ao projeto.
3. **Documentar** — o que foi resolvido.
4. **Reexecutar** — até pipeline verde.

```markdown
## Correções no pre-check
| Etapa | Erro | Correção |
|-------|------|----------|
| Test | timeout | Ajustado mock async |
```

**Não declarar concluído** com pipeline vermelho.

### 17.4 Sessão de code-review final

Após pipeline verde, self-review como **dev sênior / arquiteto**:

| Lente | Foco |
|-------|------|
| Arquitetura | Camadas, acoplamento, duplicação |
| Segurança | Input, IDOR, secrets, SQL |
| Performance | N+1, I/O, cache |
| Manutenibilidade | Nomes, complexidade, testabilidade |
| Testes | Edge cases, cobertura, determinismo |
| Contratos | API/schema/docs |

Classificar: **Blocker** (corrigir antes de concluir) | **Melhoria** | **Observação**.

```markdown
## Code-review final
**Blockers corrigidos:** ...
**Melhorias aplicadas:** ...
**Veredito:** ✅ Aprovado — pipeline verde + blockers resolvidos
```

Blocker na review → corrigir → rerodar etapas afetadas → revisar de novo.

### 17.5 Resposta final ao usuário

```markdown
## Entrega — [título]
**Pre-check:** lint ✅ | typecheck ✅ | test ✅ | build ✅
**Correções:** [nenhuma / lista]
**Code-review:** [bullets]
**CoT:** Entendi → Verifiquei → Decidi → Fiz → Validei
```

---

## 18. Challenge Workflow — desafio few-shot

**Válido a partir do Prompt 001.** Prompts 000/000b = setup; desafio **ainda não iniciado** até o 001.

### Objetivo

Projeto base (backend **ou** frontend **ou** adaptar/consumir API) usando estratégia de **few-shots**.

### Regras

1. **Estrutura própria** de ensino/preparação da IA — não copiar colega.
2. **Few-shot livre** — participante escolhe estratégias; documentar no log.
3. **Log linear** em `prompts/00X-*.md` + `linear-log.md`. **Meta:** 3 prompts; se precisar de mais, continuar até concluir.
4. **Stack livre** — backend, frontend, API própria ou consumo de API externa.
5. **Obrigatório:** listar com **paginação**, detalhar **por ID**, buscar **com filtro**.
6. **Ao finalizar:** verificar resultado (pre-check) e compartilhar.
7. **Regra principal:** aprender com o processo e se divertir.

### A cada prompt 001+

Registrar prompt verbatim, estratégia few-shot, entregáveis, CoT; atualizar `linear-log.md`; pre-check quando houver código.

### Conclusão

Projeto concluído quando as 3 features obrigatórias existem, resultado verificado e compartilhado. Sem penalidade por >3 prompts.

Ver `README.md` e `docs/few-shots.md` (referência opcional).

---

## Referência rápida — anti-patterns que reprovam review

| Anti-pattern | Correção |
|--------------|----------|
| Log em português em projeto inglês | Unificar idioma |
| `const timeout = 5000` solto | `const REQUEST_TIMEOUT_MS = 5000` |
| Função com complexidade cognitiva 28 | Extrair subfunções; early return |
| `npm install lodash` para `_.get` | Usar optional chaining nativo ou util do repo |
| Nova lib sem aprovação do time | Perguntar antes; justificar no PR |
| Teste só happy path | Adicionar edge cases + erro |
| Cobertura 40% em service novo | Subir para ≥ 90% ou justificar exclusão |
| Dados hardcoded repetidos em 20 testes | Factory + Faker |
| Lógica de negócio no controller | Extrair para service/use case |
| Catch vazio | Log + rethrow ou erro tipado |
| PR de 2000 linhas | Dividir em PRs menores |
| Secret no `.env.example` com valor real | Placeholder fake |
| `console.log(process.env)` | Remover; nunca logar env |
| SQL com string interpolada | Prepared statements / ORM parametrizado |
| JWT no localStorage | HttpOnly cookie ou BFF |
| `GET /users?token=abc123` | Token só em header/cookie HttpOnly |
| Retornar stack trace em produção | Erro genérico ao client; detalhe só em log interno |
| Acesso a `/orders/:id` sem checar owner | Validar autorização + IDOR |
| Criar util/service duplicado | Buscar no projeto; reutilizar ou estender |
| Variáveis `data`, `temp`, `flag` | Nomes contextuais (`orderSummary`, `isPaymentConfirmed`) |
| IA executa feature grande sem plano | Planejamento + aceite antes de executar |
| IA assume requisito ambíguo | Perguntar com árvore de decisão A/B |
| Declarar concluído sem rodar pipeline | Lint → typecheck → test → build do projeto |
| Comando genérico inventado | Ler package.json / Makefile / CI |
| Build/test falhou e foi ignorado | Corrigir, documentar, reexecutar |

---

*Espelho consolidado das regras em `.cursor/rules/`. Ao alterar regras, atualize o `.mdc` correspondente **e** este arquivo — veja `ia-rules-usage.md`.*
