# Atividade 2 — App de Feed: Favoritos + MMKV + Reanimated (15 pts)

**Disciplina:** Arquitetura de Aplicações Móveis e Multiplataforma
**Entrega:** até **10/06/2026** (2 semanas)
**Modalidade:** individual
**Tempo estimado:** **~2h-2h30** (estende app construído no hands-on da Aula 2)

---

## Por que essa atividade

Hands-on da Aula 2 te deixou com app rodando: Stack Navigator + Zustand counter + TanStack Query buscando filmes. **Esta atividade estende isso** com 3 conceitos centrais de RN production-grade:

1. **Zustand favorites store** — segundo store, agora com lista (array)
2. **MMKV persistência** — storage síncrono 30x mais rápido que AsyncStorage
3. **Reanimated não-trivial** — animação rodando direto na UI thread

> Saída: app real com data fetching + cache, estado global persistido, e animação fluida. Base sólida pra próximas atividades.

---

## Pré-requisito

App do hands-on da Aula 2 funcionando (Stack + Zustand counter + TanStack Query). Se faltou tempo na aula, **comece pelo starter**: <https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/tree/main/starters/aula-02>.

---

## Tarefa (4 passos em ~2h-2h30)

### 1. Zustand `useFavoritesStore` (~30min)

Criar `src/store/favoritesStore.ts`:

```typescript
type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};
```

- `add`/`remove` mutam o array
- `toggle` adiciona se não estiver, remove se estiver
- `isFavorite` é seletor derivado

Na `MovieList`, cada item tem botão ❤️ que chama `toggle(movie.id)`. Cor do ❤️ muda se `isFavorite(movie.id)`.

### 2. Persistência com MMKV (~30min)

Instalar:
```bash
npx expo install react-native-mmkv
```

Criar `src/storage/mmkv.ts`:
```typescript
import { MMKV } from 'react-native-mmkv';
export const storage = new MMKV();
```

Integrar com Zustand store via `persist` middleware OU manualmente em `subscribe`. Favoritos devem **sobreviver a reloads** do app.

> 💡 MMKV é **síncrono** (diferente de AsyncStorage). Por isso ~30x mais rápido. Funciona no JSI = sem bridge.

### 3. Animação Reanimated não-trivial (~45min)

Escolha **1** (não precisa fazer as 3):

| Opção | O que faz |
|---|---|
| **A — Heart pop** | Tocar ❤️ → escala spring (1 → 1.4 → 1.0) + rotação leve. Worklet puro. |
| **B — Card swipe** | Swipe lateral em card de filme com `useAnimatedGestureHandler`. Threshold pra "favoritar" ou "descartar". |
| **C — Shared element** | Imagem do filme cresce com `withSpring` ao navegar pra `MovieDetail`. Tipo Apple Music. |

Deve usar `useSharedValue` + `useAnimatedStyle` + worklets. **Não vale `Animated` API legado**.

### 4. README + screencast + entrega (~15min)

`README.md` com:
- Nome + opção Reanimated escolhida (A/B/C)
- Comando rodar
- 1 screenshot da `MovieList` mostrando ❤️ ativo
- 1 screencast curto (15-30s) da animação Reanimated funcionando — pode ser GIF via [GIPHY Capture](https://giphy.com/apps/giphycapture) ou screen recording
- 1 referência

---

## Critérios de avaliação

| Critério | Pontos |
|---|---|
| App roda sem erro (`npm install && npx expo start --web` ou device) | 2 |
| `useFavoritesStore` Zustand funcional (toggle, isFavorite) | 3 |
| MMKV persistindo favoritos entre reloads | 3 |
| Reanimated não-trivial rodando na UI thread (com worklets) | 4 |
| README + screenshot + screencast/GIF da animação | 2 |
| 1 referência citada | 1 |

**Total: 15 pts**

> 🎁 **Bonus** (não conta pra máxima, considerado em arredondamento):
> - Deep link funcionando (`expo://detail/<id>`)
> - 2 das 3 opções Reanimated (A/B/C) = +1pt
> - **Bottom Tabs** com aba `Favoritos` mostrando lista persistida = +2pt
> - Hermes habilitado (verificar em `app.json`)
> - TanStack Query com `staleTime` configurado + `prefetchQuery` antes do detail = +1pt

---

## O que você NÃO precisa fazer

- Não precisa app **bonito** (foco em fluxo, animação, persistência)
- Não precisa Bottom Tabs (bonus opcional)
- Não precisa testar (próxima disciplina foca em testes)
- Não precisa rodar em device físico (web é suficiente, mas Reanimated em web tem limitações — preferir simulador iOS/Android)

---

## Recomendado: use IA pra acelerar

```
"Crie store Zustand useFavoritesStore com array ids + actions toggle(id),
add(id), remove(id), clear() e seletor isFavorite(id). Persistir com
MMKV via subscribe — síncrono. TypeScript tipado."
```

```
"Worklet Reanimated 3 que escala um Animated.View de 1.0 → 1.4 → 1.0
com withSpring quando tap no ❤️. useSharedValue + useAnimatedStyle.
TypeScript."
```

> ⚠️ **IA é ajudante.** Cola código sem entender → perde nota na arguição. Reanimated tem armadilhas (`runOnJS`, `worklet` directive) que IA às vezes esquece.

---

## Entrega via GitHub (fork + PR)

Ver [`COMO_ENTREGAR.md`](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/COMO_ENTREGAR.md) na raiz do repo público.

Resumo:
1. Fork do repo público
2. Branch `entrega/atividade-2-<seu-nome>`
3. Pasta `exercicios/02-app-rn-navegacao-estado/<seu-nome>/` no SEU fork
4. Código do app + README.md + screenshot + screencast.gif
5. Commit + push + link no Canvas

---

## Material de apoio (todos no GitHub público)

- **[guia-passo-a-passo.md](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/02-app-rn-navegacao-estado/guia-passo-a-passo.md)** — comandos + código exemplo
- **[template-relatorio.md](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/exercicios/02-app-rn-navegacao-estado/template-relatorio.md)** — README modelo
- **[Starter Aula 2](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/tree/main/starters/aula-02)** — ponto de partida (caso não tenha feito hands-on)
- **[Material aula 2](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/tree/main/material-de-apoio/aula-02)** (Meta New Arch, Hermes, Reanimated)
- **[Slide aula 2](https://github.com/jacksonsmith/puc-iec-mobile-multiplataforma/blob/main/slides/aula-02/aula-02-react-native-new-architecture.pdf)**
- **[Zustand docs](https://github.com/pmndrs/zustand)** + **[TanStack Query](https://tanstack.com/query/latest)** + **[Reanimated](https://docs.swmansion.com/react-native-reanimated/)** + **[MMKV](https://github.com/mrousavy/react-native-mmkv)**
