# ADR-0001: Stack mobile para marketplace de moda omnichannel

> Padrão baseado em Michael Nygard (2011)

## Status

`Aceito` (2026-05-25)

**Autor:** Equipe Mobile · ModaX Marketplace  
**Stakeholders consultados:** Head de Engenharia, Diretor de Produto, Tech Lead Mobile

---

## Contexto

- **Produto:** marketplace de moda omnichannel para América Latina
- **Escala:** 8 milhões de usuários ativos mensais
- **Distribuição:** 78% Android / 22% iOS
- **Time atual:** 10 engenheiros frontend web, 4 mobile e 5 backend
- **Janela:** lançamento do MVP em 8 meses devido à expansão regional
- **Restrições:**
    - Pico de acesso durante Black Friday e campanhas sazonais
    - Deep linking vindo de Instagram, TikTok e campanhas de influenciadores
    - Grande volume de imagens e vídeos em catálogo e feed
    - Push notifications segmentadas em larga escala
    - Alta frequência de atualização de produtos, estoque e promoções
    - Aplicação deve funcionar adequadamente em dispositivos Android intermediários
    - Necessidade de reduzir custo de manutenção entre plataformas
    - Time-to-market é prioridade estratégica

Cerca de 70% das funcionalidades consistem em catálogo, busca, checkout, favoritos e tracking de pedidos. Aproximadamente 30% envolvem integrações nativas, notificações, analytics e processamento multimídia.

---

## Decisão

Adotar **React Native (Expo bare workflow)** como stack mobile principal, utilizando módulos nativos em Kotlin e Swift para recursos críticos de performance, notificações e integrações específicas do sistema operacional.

---

## Alternativas consideradas

### Critérios de avaliação e pesos

| Critério | Peso | Justificativa |
|---|---|---|
| Time-to-market | 25% | Expansão regional exige entrega rápida |
| Performance em Android médio | 20% | Maioria da base utiliza dispositivos intermediários |
| Reuso de código | 15% | Redução de custo operacional |
| Experiência nativa | 15% | Checkout e navegação precisam fluidez |
| Talent pool | 10% | Facilidade de contratação |
| Manutenção | 10% | Equipes separadas aumentam custo |
| Maturidade do ecossistema | 5% | Redução de risco técnico |

---

### Matriz quantitativa (nota 0–10)

| Alternativa | TTM | Perf | Reuso | UX | Talent | Manut. | Maturidade | Score |
|---|---|---|---|---|---|---|---|---|
| Nativo (Kotlin + Swift) | 4 | 10 | 2 | 10 | 7 | 4 | 10 | 6.45 |
| **React Native + módulos nativos** | **9** | **8** | **9** | **8** | **9** | **8** | **9** | **8.45** |
| Flutter | 8 | 9 | 9 | 8 | 7 | 8 | 8 | 8.10 |
| Kotlin Multiplatform | 6 | 8 | 7 | 8 | 5 | 6 | 6 | 6.45 |
| PWA | 10 | 5 | 10 | 5 | 9 | 9 | 8 | 7.55 |

**Cálculo:** `score = Σ(nota_i × peso_i)`

React Native apresentou melhor equilíbrio entre velocidade de entrega, disponibilidade de profissionais, maturidade do ecossistema e reuso de código, mantendo performance adequada para o contexto do marketplace.

---

## Consequências

### Positivas

- Reuso de aproximadamente 80% do codebase entre Android e iOS
- Redução do time-to-market do MVP
- Facilidade de contratação devido ao ecossistema JavaScript/TypeScript
- Integração eficiente com analytics, deep linking e push notifications
- Menor custo de manutenção em comparação ao desenvolvimento nativo duplo

### Negativas

- Recursos críticos podem exigir bridging nativo
- Atualizações de dependências React Native podem gerar incompatibilidades
- Performance inferior ao nativo em listas muito pesadas e animações complexas
- Dependência elevada de bibliotecas de terceiros
- Necessidade de especialistas em Kotlin/Swift para módulos específicos

### Mitigações

- Isolar integrações críticas em módulos nativos auditáveis
- Realizar atualização controlada de dependências semestrais
- Monitorar performance continuamente via profiling e observabilidade mobile
- Capacitação cruzada entre desenvolvedores React Native e nativos

---

## Referências

1. **Nygard, M.** (2011). *Documenting Architecture Decisions*. Disponível em: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions

2. **Charland, A.; Leroux, B.** (2011). *Mobile Application Development: Web vs. Native*. Communications of the ACM, 54(5), pp. 49–53. DOI:10.1145/1941487.1941504

3. **Eisenman, B.** (2018). *Learning React Native* (2ª ed.). O'Reilly Media.

4. **Airbnb Engineering** (2018). *Sunsetting React Native*. Disponível em: https://medium.com/airbnb-engineering/sunsetting-react-native-1868ba28e30a

5. **React Native Documentation**. Disponível em: https://reactnative.dev/