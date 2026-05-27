# Atividade 2 — Mini-app RN: Navegação + Estado (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** até **10/06/2026** (2 semanas)
**Modalidade:** individual
**Tempo estimado:** **~1h-1h30** (alvo iniciante em RN)

---

## Por que essa atividade

Aula 2 cobriu **React Native New Architecture** (JSI, Fabric, TurboModules) + ferramentas modernas (React Navigation, **Zustand**, TanStack Query, Reanimated, MMKV). Esta atividade exercita **o mínimo viável** pra você ter um app RN navegando + gerenciando estado — base pra todas as próximas.

## Tarefa (3 passos em ~1h30)

### 1. Criar app Expo (~10min)

Pré-requisito: Node 20+ instalado (vimos na aula 1).

```bash
npx create-expo-app@latest meu-app --template blank-typescript
cd meu-app
npx expo start --web
```

Deve abrir browser com app rodando. **Se não rodar, não passe pro próximo passo.**

### 2. Adicionar navegação (~30min)

Instalar React Navigation v7 + dependências:

```bash
npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

Implementar **Stack Navigator** com 2 telas:
- `Home` com botão que navega pro `Detail` passando 1 parâmetro
- `Detail` exibe o parâmetro recebido

> Bottom Tabs vai pra seção de bonus — não obrigatório aqui.

### 3. Adicionar estado com Zustand (~25min)

```bash
npm install zustand
```

Implementar **store counter** em `src/store/counterStore.ts` com:
- State: `count: number` (começa em 0)
- Actions: `increment`, `decrement`, `reset`
- Exibido na tela `Home` com 3 botões disparando as actions

Store deve:
- **1 arquivo** (sem Provider, sem configureStore)
- Hook gerado pelo `create()` consumido direto em qualquer componente
- UI lê state via hook e re-renderiza ao tocar no botão

### 4. README + entrega (~10min)

`README.md` na raiz do projeto com:
- Nome da atividade + seu nome
- Comando pra rodar (`npm install && npx expo start --web`)
- 1 screenshot da `Home` mostrando counter funcionando
- 1 referência

---

## Critérios de avaliação

| Critério | Pontos |
|---|---|
| App roda sem erro com `expo start --web` | 4 |
| Stack Navigator: 2 telas + push com parâmetro funcionando | 3 |
| Zustand store counter: action → state → UI atualiza | 5 |
| README + screenshot | 2 |
| 1 referência citada | 1 |

**Total: 15 pts**

> 🎁 **Bonus** (não conta pra máxima, considerado em arredondamento):
> - **Bottom Tabs** com 2 tabs (Home + Settings) = +2pt
> - Deep link funcionando (`expo://detail/<id>`)
> - MMKV persistindo estado entre reloads
> - 1 animação Reanimated não-trivial (shared element, gesture, spring)
> - **TanStack Query** integrando com 1 API real (JSONPlaceholder, PokéAPI)
> - Hermes habilitado (verificar em `app.json`)
> - Store `favorites` ou `theme` em vez de counter (mais complexo)

---

## Recomendado: use IA pra acelerar

Você pode (e deve!) usar **Cursor / Gemini CLI / Claude Code / ChatGPT** pra acelerar — vimos na aula 1.

Prompts úteis:

> "Configure React Navigation v7 stack + tabs no meu app Expo blank-typescript."

> "Crie um store Zustand chamado `useCounterStore` com count + increment/decrement/reset. Sem Provider, sem configureStore."

> "Como passar parâmetro entre telas do Stack Navigator com TypeScript?"

> ⚠️ **IA é ajudante.** Cola código sem entender → perde nota em arguição.

---

## Entrega via GitHub (fork + PR)

1. Fork do repo público: <https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma>
2. Branch `entrega/atividade-2-<seu-nome>` no seu fork
3. **Criar pasta** `exercicios/02-app-rn-navegacao-estado/<seu-nome>/` no SEU fork (não no upstream)
4. Colocar dentro: código do app + README.md + screenshot
5. Commit + push pro seu fork
6. Submeter no Canvas com link do commit (ou PR opcional pro upstream)

**Detalhes do workflow:** ver página *"Como entregar atividades pelo GitHub"* no Canvas módulo Início.

> **Dica de tamanho:** não comite `node_modules/`, `.expo/`, `dist/`. Já tem `.gitignore` padrão Expo — só não force.

## O que você NÃO precisa fazer

- Não precisa app **bonito** (foco em fluxo, não design)
- **Não precisa Bottom Tabs** (bonus opcional)
- Não precisa Reanimated, MMKV, TanStack Query (bonus)
- Não precisa testar (próxima disciplina foca em testes)
- Não precisa rodar em device físico (web é suficiente)

## Material de apoio (todos no GitHub público)

- **[template-relatorio.md](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/02-app-rn-navegacao-estado/template-relatorio.md)** — README modelo
- **[guia-passo-a-passo.md](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/02-app-rn-navegacao-estado/guia-passo-a-passo.md)** — comandos + troubleshooting
- **[Material aula 2](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/tree/main/material-de-apoio/aula-02)** (Meta New Arch, Hermes, Reanimated, Discord Eng)
- **[Slide aula 2](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/slides/aula-02/aula-02-react-native-new-architecture.pdf)**
- **[Docs oficiais React Navigation v7](https://reactnavigation.org/docs/getting-started)** + **[Zustand](https://github.com/pmndrs/zustand)**
