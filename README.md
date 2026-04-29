# Codeforces Analytics Dashboard

Dashboard analítico para perfis do Codeforces, 100% stateless — sem backend, todos os dados são buscados diretamente da API pública do CF no browser.

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **Recharts** — gráficos de rating, barras e doughnut

## Funcionalidades

### Header
- Input de handle com busca ao submeter
- Exibe o handle ativo, rating atual e tier (cor CF) após carregar

### Rating History
- Gráfico de linha com eixo X **proporcional ao tempo** (`timestampMs`), então contests próximos aparecem agrupados e contests espaçados ficam distantes visualmente
- **Bandas coloridas** no fundo mapeando os tiers oficiais do CF (Newbie → Grandmaster)
- Linha **amarela** para o rating atual e linha **tracejada cinza** para a performance estimada (`oldRating + 3.5 × delta`)
- Checkboxes para ligar/desligar cada série independentemente
- **Brush** (mini-mapa inferior) para zoom e navegação no período

### Activity Heatmap
- Grid estilo GitHub dos últimos 365 dias **ou** qualquer ano específico em que o usuário teve submissões
- Cor de cada quadrado = cor CF do problema mais difícil resolvido naquele dia
- Tooltip ao hover mostra data + lista completa dos problemas resolvidos com seus ratings

### Analytics
- **BarChart**: quantidade de problemas resolvidos por faixa de rating (800, 900, 1000…), barras coloridas com a cor CF da faixa
- **Doughnut**: distribuição das top 15 tags dos problemas resolvidos

### Unsolved Cemetery
- Tabela rolável com todos os problemas que tiveram submissão mas nenhum verdict `OK`
- Links diretos para o problema no Codeforces
- Ordenado por rating decrescente (mais difícil primeiro)

## Estrutura

```
src/
├── utils/
│   ├── cfColors.js       # Paleta de cores e bandas oficiais do CF
│   └── dataTransform.js  # Processamento das submissões (solved, unsolved, tags, heatmap)
├── hooks/
│   └── useCodeforcesData.js  # Promise.all nas rotas user.rating + user.status
└── components/
    ├── Header.jsx
    ├── RatingChart.jsx
    ├── ActivityHeatmap.jsx
    ├── AnalyticsCharts.jsx
    └── UnsolvedCemetery.jsx
```

## Como rodar

```bash
npm install
npm run dev
```

Acesse `http://localhost:5173`. O handle padrão ao carregar é `angeloman`.
