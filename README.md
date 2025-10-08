# Quem Gankar - League of Legends

Uma aplicação web que mostra o ranking dos melhores campeões para o jungle gankar em cada rota (Mid, Top, ADC, Suporte) no League of Legends, especializada em ganks de níveis 2, 3 e 6.

## 🎮 Características

- **Ranking por Rota**: Campeões organizados por Mid Lane, Top Lane, Bot Lane (ADC) e Suporte
- **Filtros por Nível**: Especialização em ganks de nível 2, 3 e 6
- **Dados Atualizados**: Integração com APIs oficiais da Riot Games
- **Interface Responsiva**: Design otimizado para desktop e mobile
- **Tema Gaming**: Visual inspirado no League of Legends

## 🛠️ Tecnologias

- **Vue 3** - Framework JavaScript reativo
- **Tailwind CSS 4** - Framework de CSS utilitário
- **Vite** - Build tool e dev server
- **Axios** - Cliente HTTP para APIs
- **APIs da Riot Games** - Dados oficiais dos campeões

## 🚀 Como usar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd quemGankar
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador:
```
http://localhost:3000
```

### Build para produção

```bash
npm run build
```

## 📊 Fontes de Dados

A aplicação utiliza **apenas dados dinâmicos** das APIs oficiais:

- **Versões do Jogo**: `https://ddragon.leagueoflegends.com/realms/br.json`
- **Dados dos Campeões**: `https://ddragon.leagueoflegends.com/cdn/{version}/data/pt_BR/champion.json`
- **Posições dos Campeões**: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-statistics/global/default/rcp-fe-lol-champion-statistics.js`
  - Extrai dinamicamente o JSON com IDs de campeões por posição
  - Atualizado automaticamente quando novos campeões são lançados
  - Mapeia automaticamente campeões multi-posição (ex: Yasuo em Mid/Top)
- **Imagens dos Campeões**: `https://ddragon.leagueoflegends.com/cdn/{version}/img/champion/{champion}.png`
- **Ícones das Posições**: Community Dragon CDN

### Como funciona o mapeamento de posições

1. O sistema baixa o arquivo JS da Community Dragon
2. Extrai o JSON que contém objetos por posição: `{ BOTTOM: {...}, SUPPORT: {...}, JUNGLE: {...}, MIDDLE: {...}, TOP: {...} }`
3. Cada objeto de posição contém IDs de campeões como chaves: `{ "15": 0.03844, "18": 0.02515, ... }`
4. O sistema mapeia esses IDs para os nomes dos campeões usando a API da Riot
5. Campeões que aparecem em múltiplas posições são automaticamente detectados

Isso garante que:
- ✅ Novos campeões aparecem automaticamente
- ✅ Mudanças de meta são refletidas instantaneamente
- ✅ Nenhum dado hardcoded ou desatualizado

## 🎯 Metodologia de Ranking

O ranking é baseado no potencial de gank de cada campeão em diferentes níveis:

### Nível 2
- Foco em campeões com CC early ou burst rápido
- Prioriza champions com skills de gap closer no nível 2

### Nível 3
- Considera combo completo de skills básicas
- Avalia mobilidade e potencial de follow-up

### Nível 6
- Ultimate disponível aumenta drasticamente o potencial
- Prioriza champions com ultimates de engage ou pick potential

### Critérios Gerais
- **Mid Lane**: Mobilidade, roaming, burst damage
- **Top Lane**: Teleport potential, tankiness, engage
- **Bot Lane**: Follow-up damage, positioning, range
- **Suporte**: Engage tools, peel, crowd control

## 🔧 Estrutura do Projeto

```
src/
├── components/
│   ├── ChampionCard.vue      # Card individual do campeão
│   └── LaneRanking.vue       # Ranking por rota
├── services/
│   └── riotApi.js           # Serviços da API da Riot
├── App.vue                  # Componente principal
├── main.js                  # Entry point
└── style.css               # Estilos globais
```

## 📱 Responsividade

- **Mobile**: Grid de 2 colunas
- **Tablet**: Grid de 3-4 colunas  
- **Desktop**: Grid de 5 colunas
- **Layout adaptativo** para diferentes tamanhos de tela

## ⚠️ Disclaimer

Este produto não é endossado, certificado ou de outra forma aprovado pela Riot Games, Inc. ou por qualquer de suas afiliadas.

## 📄 Licença

Este projeto é apenas para fins educacionais e demonstrativos.