# README — Atividade 2 — [Seu Nome]

> Use isso como base do README.md do seu projeto.

## Identificação

- **Aluno:** [seu nome]
- **Opção Reanimated escolhida:** [A heart pop / B card swipe / C shared element]
- **Bonus implementado:** [se houver — Bottom Tabs, deep link, etc]
- **Repo (seu fork):** [URL]

## Como rodar

```bash
npm install
npx expo start
```

> ⚠️ MMKV não roda em web. Use simulador iOS (`i`) ou Android (`a`).

## O que o app faz

[2-3 frases descrevendo: lista de filmes da TMDB, toggle favoritos, persistência MMKV, animação Reanimated]

## Screenshot

![Lista com favoritos](./screenshot.png)

## Screencast da animação

![Animação Reanimated](./screencast.gif)

> Substitua pelas mídias reais. GIF deve ter 15-30s mostrando a animação acontecendo.

## Arquitetura

```
src/
├── navigation/
│   └── RootStack.tsx
├── screens/
│   ├── MovieList.tsx
│   └── MovieDetail.tsx
├── components/
│   ├── MovieCard.tsx
│   └── HeartButton.tsx       ← animação Reanimated
├── store/
│   ├── counterStore.ts
│   └── favoritesStore.ts     ← Zustand + persist + MMKV
├── api/
│   └── useMovies.ts          ← TanStack Query
└── storage/
    └── mmkv.ts
```

## Decisões técnicas (3-5 linhas)

[Explique por que escolheu Reanimated A/B/C. Por que MMKV em vez de AsyncStorage. Qualquer trade-off relevante.]

## Referência

[1 referência — Reanimated docs, MMKV docs, Zustand docs, TanStack Query docs, ou material aula 2]

---

## 🎁 Bonus implementado (opcional)

- [ ] **Bottom Tabs com aba Favoritos filtrada — +2pt**
- [ ] Deep link `expo://detail/<id>` — +1pt
- [ ] 2 das 3 opções Reanimated (A/B/C) — +1pt
- [ ] TanStack Query `staleTime` + `prefetchQuery` — +1pt
- [ ] Hermes habilitado (verificar `app.json`) — +0.5pt
- [ ] CI GitHub Actions verde — +0.5pt

[Liste o que implementou e cole código relevante OU print de execução]
