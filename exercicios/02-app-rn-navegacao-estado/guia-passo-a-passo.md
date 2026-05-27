# Guia passo a passo — Atividade 2 (Favoritos + MMKV + Reanimated)

> Manual prático. ~2h-2h30 se seguir o roteiro. Estende app do hands-on da Aula 2.

---

## Pré-requisitos

- App do hands-on da Aula 2 funcionando: Stack Navigator + Zustand counter + TanStack Query buscando filmes da TMDB.
- Se faltou tempo na aula, clone o starter: `starters/aula-02` no repo público.

```bash
node --version    # v20+ ou v22
```

---

## Passo 1 — Zustand `useFavoritesStore` (~30min)

```bash
# zustand já instalado no hands-on; pular se sim
npm install zustand
```

Criar `src/store/favoritesStore.ts`:

```typescript
import { create } from 'zustand';

type FavoritesState = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  isFavorite: (id: number) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: [],
  add: (id) => set((s) => ({ ids: [...s.ids, id] })),
  remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
  toggle: (id) => {
    const current = get().ids;
    if (current.includes(id)) {
      set({ ids: current.filter((x) => x !== id) });
    } else {
      set({ ids: [...current, id] });
    }
  },
  clear: () => set({ ids: [] }),
  isFavorite: (id) => get().ids.includes(id),
}));
```

Componente `MovieCard.tsx`:

```tsx
import { Pressable, Text, View } from 'react-native';
import { useFavoritesStore } from '../store/favoritesStore';

export function MovieCard({ movie }: { movie: { id: number; title: string } }) {
  const isFav = useFavoritesStore((s) => s.isFavorite(movie.id));
  const toggle = useFavoritesStore((s) => s.toggle);

  return (
    <View style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ flex: 1 }}>{movie.title}</Text>
      <Pressable onPress={() => toggle(movie.id)}>
        <Text style={{ fontSize: 24 }}>{isFav ? '❤️' : '🤍'}</Text>
      </Pressable>
    </View>
  );
}
```

Refresh — tocar coração troca cor. Mas ao reload, perde tudo (próximo passo resolve).

---

## Passo 2 — Persistência com MMKV (~30min)

```bash
npx expo install react-native-mmkv
```

> ⚠️ **Atenção web:** `react-native-mmkv` não tem suporte web nativo. Use simulador iOS/Android ou polyfill com `localStorage`.

Criar `src/storage/mmkv.ts`:

```typescript
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'favorites-store' });

// Helpers tipados
export const persistedStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};
```

Integrar com Zustand via `persist` middleware:

```typescript
// favoritesStore.ts — versão persistida
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { persistedStorage } from '../storage/mmkv';

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      // ... mesmas actions do Passo 1
    }),
    {
      name: 'favorites',
      storage: createJSONStorage(() => persistedStorage),
    }
  )
);
```

Refresh app → toggle alguns ❤️ → fechar app → reabrir → favoritos sobreviveram.

> 💡 **Por que MMKV?** Síncrono (não bloqueia JS thread), 30x mais rápido que AsyncStorage, usa C++ via JSI direto. Apps RN production-grade usam MMKV.

---

## Passo 3 — Animação Reanimated não-trivial (~45min)

Reanimated já vem com Expo SDK 50+. Se não veio:
```bash
npx expo install react-native-reanimated
```

### Opção A — Heart pop (mais simples)

`src/components/HeartButton.tsx`:

```tsx
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function HeartButton({ active, onPress }: { active: boolean; onPress: () => void }) {
  const scale = useSharedValue(1);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSequence(
      withTiming(1.4, { duration: 120 }),
      withSpring(1, { damping: 4 })
    );
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <Animated.Text style={[{ fontSize: 24 }, style]}>
        {active ? '❤️' : '🤍'}
      </Animated.Text>
    </Pressable>
  );
}
```

Substituir `<Pressable>` do `MovieCard` por `<HeartButton>`.

### Opção B — Card swipe

Usar `react-native-gesture-handler` + `useAnimatedGestureHandler`. Mais complexo — ver [docs Reanimated gestures](https://docs.swmansion.com/react-native-reanimated/docs/api/hooks/useAnimatedGestureHandler).

### Opção C — Shared element

Animação no `MovieDetail` ao navegar. Imagem cresce com `withSpring`. Ver docs Reanimated transitions.

---

## Passo 4 — README + screencast (~15min)

Copiar `template-relatorio.md` pra `README.md`. Preencher.

Screencast (15-30s) da animação:
- macOS: `Cmd+Shift+5` → gravar área → exportar como `screencast.mov`
- Converter pra GIF: <https://ezgif.com/video-to-gif> ou GIPHY Capture
- Salvar como `screencast.gif` na raiz do projeto

Screenshot da lista com ❤️ ativo: `Cmd+Shift+4` no simulador iOS.

---

## Passo 5 — Entrega

Ver `COMO_ENTREGAR.md` na raiz do repo público.

---

## Troubleshooting

| Problema | Solução |
|---|---|
| `react-native-mmkv` não roda em web | Use simulador iOS/Android. Pra dev web, polyfill com `localStorage`. |
| MMKV `JSI bindings not installed` | Rebuild nativo: `npx expo prebuild` + `npx expo run:ios` ou `run:android` |
| Reanimated `Reanimated 2 failed to create a worklet` | Verifica `babel.config.js` tem `'react-native-reanimated/plugin'` na lista de plugins |
| `withSpring` não anima | Esqueceu `useSharedValue`? Esqueceu envolver com `Animated.View` ou `Animated.Text`? |
| Persist Zustand não restaura | Hydration assíncrona — usa `useFavoritesStore.persist.onHydrate()` pra detectar |
| Coração não muda cor | Está usando seletor (`useFavoritesStore((s) => s.isFavorite(id))`) ou destructuring completo? Seletor força re-render correto. |

---

## Dica: IA pra acelerar

Prompts úteis:

> "Crie favorites store Zustand com middleware persist + MMKV via createJSONStorage. TypeScript tipado. Actions: add, remove, toggle, clear. Seletor isFavorite."

> "Worklet Reanimated 3: ao tap, escalar Animated.Text de 1 → 1.4 → 1 com withSequence + withTiming + withSpring. useSharedValue + useAnimatedStyle. TypeScript."

> "Como configurar babel.config.js pra Reanimated no projeto Expo SDK 51 com TypeScript?"

⚠️ Reanimated tem armadilhas (`'worklet'` directive em funções stand-alone, runOnJS, plugin Babel obrigatório). Valide cada bloco antes de colar.

---

## Apêndice — Bonus

### Bottom Tabs com aba Favoritos (+2pt)

```bash
npx expo install @react-navigation/bottom-tabs
```

3 tabs: `Home` (lista) + `Favoritos` (lista filtrada pelo store) + `Settings`. Aba Favoritos renderiza `FlatList` filtrando `useFavoritesStore` por `ids`.

### Deep link (+1pt)

`linking` config no `NavigationContainer` com prefix `expo://`. Detail abre via `expo://detail/<id>`.

### TanStack Query staleTime + prefetch (+1pt)

```typescript
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }, // 5min
});

// Prefetch antes de navegar:
queryClient.prefetchQuery({
  queryKey: ['movie', id],
  queryFn: () => fetchMovie(id),
});
```
