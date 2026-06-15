/**
 * Validator — Atividade 2 — App RN: Favoritos + MMKV + Reanimated (Mobile Multiplataforma).
 *
 * Calibrado pela RUBRICA REAL do enunciado (15 pts):
 *   1. App roda sem erro (entry point + Expo/RN no package.json)            — 2pts
 *   2. useFavoritesStore Zustand (toggle, isFavorite, add, remove, clear)   — 3pts
 *   3. MMKV persistindo favoritos                                           — 2pts
 *   4. Reanimated worklets não-triviais (useSharedValue + useAnimatedStyle) — 3pts
 *   5. ≥ 6 testes Jest                                                      — 2pts
 *   6. README + screenshot + screencast/GIF                                 — 2pts
 *   7. 1 referência citada                                                  — 1pt
 *
 * PRINCÍPIO: NOTA MÍNIMA. Só credita o que consegue PROVAR estaticamente —
 * "na dúvida, não dá ponto". A revisão manual no Canvas só SOMA a partir daqui.
 * Min pra status check verde: 60% (9/15).
 */

import { readFileSync, existsSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import {
  type GradeCriterion,
  type GradeResult,
  buildBreakdowns,
  computeScore,
  computeAuto,
  passThreshold,
} from '../compute-score.js';

interface CliArgs {
  entrega: string;
  output: string;
  studentLogin: string;
  commitSha: string;
}

function parseArgs(): CliArgs {
  const args = process.argv.slice(2);
  const get = (flag: string, defaultValue?: string) => {
    const idx = args.indexOf(flag);
    if (idx === -1) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Missing required flag: ${flag}`);
    }
    return args[idx + 1] ?? '';
  };
  return {
    entrega: get('--entrega'),
    output: get('--output'),
    studentLogin: get('--student-login', 'unknown'),
    commitSha: get('--commit-sha', 'unknown'),
  };
}

function readFileSafe(path: string): string | null {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/** Busca recursiva por extensão, ignorando node_modules e ocultos. */
function findFiles(dir: string, exts: string[], depth = 6): string[] {
  if (!existsSync(dir) || depth <= 0) return [];
  const result: string[] = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry.startsWith('.')) continue;
    const path = join(dir, entry);
    try {
      const stat = statSync(path);
      if (stat.isDirectory()) result.push(...findFiles(path, exts, depth - 1));
      else if (exts.some((e) => entry.endsWith(e))) result.push(path);
    } catch {
      // skip
    }
  }
  return result;
}

const codeExts = ['.tsx', '.ts', '.jsx', '.js'];

/** Concatena o conteúdo de todos os arquivos de código (1 leitura por arquivo). */
function readAllCode(files: string[]): string {
  return files.map((f) => readFileSafe(f) ?? '').join('\n');
}

/** Quantos dos regexes batem no corpo. */
function countMatches(body: string, patterns: RegExp[]): number {
  return patterns.reduce((n, p) => (p.test(body) ? n + 1 : n), 0);
}

async function main() {
  const args = parseArgs();
  const criteria: GradeCriterion[] = [];

  // ---- leitura base ----
  const pkgRaw = readFileSafe(join(args.entrega, 'package.json'));
  let pkg: any = null;
  try {
    pkg = pkgRaw ? JSON.parse(pkgRaw) : null;
  } catch {
    pkg = null;
  }
  const allDeps = pkg ? { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) } : {};
  const codeFiles = findFiles(args.entrega, codeExts);
  const code = readAllCode(codeFiles);

  // ---- Critério 1: App roda (proxy estático conservador) — 2pts ----
  const entryFound = ['App.tsx', 'App.js', 'index.tsx', 'index.js', 'src/App.tsx', 'src/App.js'].some(
    (c) => existsSync(join(args.entrega, c)),
  );
  const hasRnDep = 'react-native' in allDeps || 'expo' in allDeps;
  const c1 = entryFound && pkg && hasRnDep ? 2 : entryFound && pkg ? 1 : 0;
  criteria.push({
    id: 'app-roda',
    description: 'App roda (entry point + Expo/RN no package.json)',
    weight: 2,
    earned: c1,
    publicNote:
      c1 === 2
        ? 'Entry point + Expo/RN presentes'
        : !pkg
          ? 'package.json ausente/inválido'
          : !entryFound
            ? 'Não achei App.tsx/index.tsx na raiz da entrega'
            : 'package.json sem expo/react-native nas deps',
    privateNote: `entry=${entryFound} pkg=${!!pkg} rnDep=${hasRnDep}`,
  });

  // ---- Critério 2: useFavoritesStore Zustand (5 métodos) — 3pts ----
  const hasZustand =
    /from\s+['"]zustand['"]/.test(code) || /\bcreate<[^>]*>\(|\bcreate\(\s*(\(|persist)/.test(code);
  const methodHits = countMatches(code, [
    /\btoggle(Favorit)?\w*\b/i,
    /\bisFavorit\w*\b/i,
    /\badd(Favorit)?\w*\b/i,
    /\bremove(Favorit)?\w*\b/i,
    /\bclear(Favorit|All)?\w*\b/i,
  ]);
  // conservador: precisa do store Zustand E dos métodos; nota proporcional aos métodos achados
  const c2 = hasZustand ? Math.round((methodHits / 5) * 3 * 100) / 100 : 0;
  criteria.push({
    id: 'favorites-store',
    description: 'useFavoritesStore Zustand (toggle, isFavorite, add, remove, clear)',
    weight: 3,
    earned: Math.min(c2, 3),
    publicNote: hasZustand
      ? `Zustand + ${methodHits}/5 métodos detectados`
      : 'Não encontrei um store Zustand (create(...) de "zustand")',
    privateNote: `zustand=${hasZustand} methodHits=${methodHits}`,
  });

  // ---- Critério 3: MMKV persistência — 2pts ----
  const hasMmkvImport = /from\s+['"]react-native-mmkv['"]/.test(code) || /new\s+MMKV\s*\(/.test(code);
  const hasPersistUse = /\.set\s*\(|\.getString\s*\(|useMMKV|subscribe\s*\(|loadInitial|persist\s*\(/.test(code);
  const c3 = hasMmkvImport && hasPersistUse ? 2 : hasMmkvImport ? 1 : 0;
  criteria.push({
    id: 'mmkv',
    description: 'MMKV persistindo favoritos entre reloads',
    weight: 2,
    earned: c3,
    publicNote:
      c3 === 2
        ? 'MMKV + leitura/escrita (set/get ou subscribe) detectados'
        : c3 === 1
          ? 'Importou MMKV mas não vi escrita/leitura persistente'
          : 'Não encontrei react-native-mmkv',
    privateNote: `mmkvImport=${hasMmkvImport} persistUse=${hasPersistUse}`,
  });

  // ---- Critério 4: Reanimated worklets não-triviais — 3pts ----
  const hasReaImport = /from\s+['"]react-native-reanimated['"]/.test(code);
  const hasSharedValue = /useSharedValue\s*\(/.test(code);
  const hasAnimatedStyle = /useAnimatedStyle\s*\(/.test(code);
  const hasAnimPrimitive = /withSpring\s*\(|withTiming\s*\(|withSequence\s*\(|withRepeat\s*\(/.test(code);
  const reaSignals = [hasReaImport, hasSharedValue, hasAnimatedStyle, hasAnimPrimitive].filter(Boolean).length;
  // conservador: 3 só com import + sharedValue + animatedStyle; senão proporcional aos sinais
  const c4 =
    hasReaImport && hasSharedValue && hasAnimatedStyle ? 3 : Math.round((reaSignals / 4) * 3 * 100) / 100;
  criteria.push({
    id: 'reanimated',
    description: 'Reanimated worklets (useSharedValue + useAnimatedStyle na UI thread)',
    weight: 3,
    earned: Math.min(c4, 3),
    publicNote:
      c4 === 3
        ? 'useSharedValue + useAnimatedStyle detectados'
        : reaSignals > 0
          ? `Reanimated parcial (${reaSignals}/4 sinais: import/sharedValue/animatedStyle/withX)`
          : 'Não encontrei react-native-reanimated',
    privateNote: `import=${hasReaImport} shared=${hasSharedValue} style=${hasAnimatedStyle} prim=${hasAnimPrimitive}`,
  });

  // ---- Critério 5: ≥6 testes Jest — 2pts (checagem estática, NÃO executa) ----
  const testFiles = codeFiles.filter((f) => /\.(test|spec)\.(t|j)sx?$/.test(f) || /__tests__/.test(f));
  const testBody = readAllCode(testFiles);
  const testCount = (testBody.match(/\b(it|test)\s*\(/g) ?? []).length;
  const c5 = testCount >= 6 ? 2 : testCount >= 3 ? 1 : 0;
  criteria.push({
    id: 'jest-tests',
    description: '≥ 6 testes Jest (CI verde — aqui contagem estática)',
    weight: 2,
    earned: c5,
    publicNote:
      testCount >= 6
        ? `${testCount} testes encontrados (execução verde é validada pelo CI do exercício)`
        : `Só ${testCount} testes encontrados (mínimo 6)`,
    privateNote: `testFiles=${testFiles.length} testCount=${testCount}`,
  });

  // ---- Critério 6: README + screenshot + screencast — 2pts (conservador) ----
  const readmePath = ['README.md', 'README.MD', 'readme.md'].map((n) => join(args.entrega, n)).find(existsSync);
  const readme = readmePath ? (readFileSafe(readmePath) ?? '') : '';
  const hasImage = /!\[[^\]]*\]\([^)]+\.(png|jpe?g|webp|svg)/i.test(readme) || /<img[^>]+src=/i.test(readme);
  const hasMedia =
    /\.(gif|mp4|mov|webm)/i.test(readme) || /(loom\.com|youtu\.?be|youtube\.com|streamable)/i.test(readme);
  const c6 = (hasImage ? 1 : 0) + (hasMedia ? 1 : 0);
  criteria.push({
    id: 'readme-media',
    description: 'README + screenshot + screencast/GIF',
    weight: 2,
    manual: true, // autenticidade/qualidade do README não é auto-verificável → Canvas
    earned: c6,
    publicNote: !readmePath
      ? 'README.md ausente na raiz da entrega'
      : `${hasImage ? '✅ screenshot' : '❌ sem screenshot'} · ${hasMedia ? '✅ screencast/GIF' : '❌ sem screencast/GIF'}`,
    privateNote: `readme=${!!readmePath} img=${hasImage} media=${hasMedia}`,
  });

  // ---- Critério 7: 1 referência — 1pt (link http no README, fora de imagem/badge) ----
  const refLinks = (readme.match(/https?:\/\/[^\s)]+/g) ?? []).filter(
    (u) => !/\.(png|jpe?g|gif|webp|svg|mp4|mov|webm)(\?|$)/i.test(u) && !/shields\.io|badge/i.test(u),
  );
  const c7 = refLinks.length >= 1 ? 1 : 0;
  criteria.push({
    id: 'referencia',
    description: '1 referência citada',
    weight: 1,
    manual: true, // relevância da referência não é auto-verificável → Canvas
    earned: c7,
    publicNote: c7 ? 'Referência (link) encontrada no README' : 'Nenhum link de referência no README',
    privateNote: `refLinks=${refLinks.length}`,
  });

  const { total } = computeScore(criteria);
  const { autoScore, autoTotal, manualTotal } = computeAuto(criteria);
  const minimo = passThreshold(total, 60);
  const { publicBreakdown, privateBreakdown } = buildBreakdowns(criteria);

  const result: GradeResult = {
    atividade: 'MOBILE-A2-RN-App',
    total,
    score: autoScore, // nota MÍNIMA = piso auto-verificável (manual soma no Canvas)
    autoScore,
    autoTotal,
    manualTotal,
    minimo,
    pass: autoScore >= minimo,
    criteria,
    publicBreakdown,
    privateBreakdown,
    metadata: {
      studentLogin: args.studentLogin,
      entregaPath: args.entrega,
      timestamp: new Date().toISOString(),
      commitSha: args.commitSha,
    },
  };

  writeFileSync(args.output, JSON.stringify(result, null, 2));
  console.log(`Grade: ${result.score}/${result.total} (min ${result.minimo}) — ${result.pass ? 'PASS' : 'FAIL'}`);
  process.exit(result.pass ? 0 : 1);
}

main().catch((e) => {
  console.error('Validator error:', e);
  process.exit(2);
});
