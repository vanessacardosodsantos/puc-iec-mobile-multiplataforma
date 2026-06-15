/**
 * Tipo canônico do resultado do autograder.
 * Cada validator gera GradeResult e escreve em grade.json.
 */
export interface GradeCriterion {
  id: string;
  description: string;
  weight: number; // pontos do critério
  earned: number; // ponto obtido (0..weight)
  publicNote?: string; // nota visível no comment do PR
  privateNote?: string; // detalhe só no artifact
  /**
   * Critério SUBJETIVO (qualidade de README, screencast, reflexão, referência…)
   * que o bot não consegue PROVAR. NÃO conta no piso automático — é listado como
   * informativo e avaliado à mão no Canvas. Garante que a "nota mínima" seja um piso real.
   */
  manual?: boolean;
}

export interface GradeResult {
  atividade: string;
  total: number; // soma de pesos (rubrica cheia)
  score: number; // nota MÍNIMA postada = soma do auto-verificável (= autoScore)
  autoScore?: number; // piso automático (idem score)
  autoTotal?: number; // pts auto-verificáveis (denominador do piso)
  manualTotal?: number; // pts que a revisão no Canvas ainda pode somar
  minimo: number; // pontuação mínima pra status check verde
  pass: boolean;
  criteria: GradeCriterion[];
  publicBreakdown: string; // markdown pro comment
  privateBreakdown: string; // markdown pro artifact
  metadata: {
    studentLogin: string;
    entregaPath: string;
    timestamp: string;
    commitSha: string;
  };
}

export function computeScore(criteria: GradeCriterion[]): {
  total: number;
  score: number;
} {
  const total = criteria.reduce((acc, c) => acc + c.weight, 0);
  const score = criteria.reduce((acc, c) => acc + c.earned, 0);
  return { total, score };
}

/**
 * Piso AUTOMÁTICO: soma só os critérios auto-verificáveis (não-manual).
 * `autoScore` é o número que o bot posta como "nota mínima"; `manualTotal` é
 * quanto a revisão no Canvas ainda pode SOMAR a partir daí.
 */
export function computeAuto(criteria: GradeCriterion[]): {
  autoScore: number;
  autoTotal: number;
  manualTotal: number;
} {
  const auto = criteria.filter((c) => !c.manual);
  const autoScore = auto.reduce((acc, c) => acc + c.earned, 0);
  const autoTotal = auto.reduce((acc, c) => acc + c.weight, 0);
  const manualTotal = criteria.filter((c) => c.manual).reduce((acc, c) => acc + c.weight, 0);
  return { autoScore: +autoScore.toFixed(2), autoTotal, manualTotal };
}

export function buildBreakdowns(criteria: GradeCriterion[]): {
  publicBreakdown: string;
  privateBreakdown: string;
} {
  const publicLines = criteria.map((c) => {
    const note = c.publicNote ? ` — ${c.publicNote}` : '';
    if (c.manual) {
      // não pontua no piso: mostra como checklist informativo p/ revisão no Canvas
      return `- 📝 **${c.description}** _(avaliação manual no Canvas)_${note}`;
    }
    const status = c.earned === c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌';
    return `- ${status} **${c.description}** (${c.earned}/${c.weight})${note}`;
  });

  const privateLines = criteria.map((c) => {
    const status = c.earned === c.weight ? '✅' : c.earned > 0 ? '⚠️' : '❌';
    const pub = c.publicNote ? `\n  - Público: ${c.publicNote}` : '';
    const prv = c.privateNote ? `\n  - Privado: ${c.privateNote}` : '';
    return `- ${status} **${c.description}** (${c.earned}/${c.weight})${pub}${prv}`;
  });

  return {
    publicBreakdown: publicLines.join('\n'),
    privateBreakdown: privateLines.join('\n'),
  };
}

export function passThreshold(total: number, percentMin = 60): number {
  return Math.ceil((total * percentMin) / 100);
}
