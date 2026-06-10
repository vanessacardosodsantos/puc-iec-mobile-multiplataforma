// __tests__/favoritesStore.test.ts
//
// ATIVIDADE 2 — testar useFavoritesStore.
//
// TODO [TASK 9]: gerar testes pra favoritesStore usando IA.
//
// Prompt sugerido:
//   "Gere testes Jest pra useFavoritesStore (Zustand) cobrindo:
//    - toggle adiciona id se não existe
//    - toggle remove id se existe
//    - isFavorite retorna true após add
//    - clear esvazia ids
//    Use describe + beforeEach pra resetar state."
//
// Mínimo 3 testes verdes pra CI passar (somados aos 3 de counterStore = 6 total).

import { useFavoritesStore } from '../src/store/favoritesStore';

describe('favoritesStore', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ ids: [] });
  });

  test('toggle adiciona id se não existe', () => {
    useFavoritesStore.getState().toggle(550);
    expect(useFavoritesStore.getState().ids).toEqual([550]);
  });

  test('toggle remove id se já existe', () => {
    useFavoritesStore.setState({ ids: [550, 238] });
    useFavoritesStore.getState().toggle(550);
    expect(useFavoritesStore.getState().ids).toEqual([238]);
  });

  test('isFavorite retorna true após add', () => {
    useFavoritesStore.getState().add(680);
    expect(useFavoritesStore.getState().isFavorite(680)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(999)).toBe(false);
  });

  test('clear esvazia ids', () => {
    useFavoritesStore.setState({ ids: [550, 238, 680] });
    useFavoritesStore.getState().clear();
    expect(useFavoritesStore.getState().ids).toEqual([]);
  });
});