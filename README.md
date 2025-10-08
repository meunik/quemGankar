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

O ranking é **100% dinâmico** e baseado em dados reais da API da Riot Games, sem nenhum dado hardcoded.

### Sistema de Strong Side vs Weak Side

**Strong Side** �
- Campeões **early game** que precisam de ganks para criar vantagem e snowball
- Exemplos: Samira (ADC agressiva), Draven (dominância early), Renekton (lane bully)
- **Características**: 
  - Alto dano de ataque com baixa defesa (frágeis, precisam de vantagem)
  - Tags como Assassin/Fighter (agressivos early)
  - Alto attack/defense ratio (>1.5)
- **Prioridade alta** - Esses campeões PRECISAM de ganks para funcionar!

**Weak Side** ⚖️
- Campeões que **escalam bem** e podem ficar sozinhos sem ganks
- Exemplos: K'Sante (tank escalável), Jinx (late game), Orianna (control mage)
- **Características**:
  - Tags como Tank/Mage (escalam com itens e níveis)
  - Alta defesa ou magia (>7)
  - Podem farmar seguro e ficam fortes naturalmente
- **Prioridade menor** - Podem esperar, vão ficar fortes de qualquer forma

### Algoritmo de Ordenação

Os campeões são ordenados por **três critérios em ordem de prioridade**:

1. **Potencial de Gank** (1-5 estrelas) 🌟
   - Baseado em: CC potencial, burst damage, mobilidade do campeão inimigo
   - Calculado dinamicamente usando tags e stats da API
   - Fatores: Tanks (CC pesado), Marksman (vulneráveis), Fighters (engage), etc.
   
2. **Strong/Weak Side** �
   - Strong Side aparece **PRIMEIRO** no ranking
   - Weak Side aparece **DEPOIS**
   - Determina quem PRECISA vs quem PODE ESPERAR por ganks
   
3. **Pick Rate** 📊
   - Taxa de escolha do campeão na posição (valor percentual)
   - Usado como desempate entre campeões do mesmo potencial e side
   - Exibido em badge roxo no card do campeão

### Cálculo Dinâmico

Todos os valores são calculados em tempo real a partir das APIs:

```javascript
// Strong/Weak Side - baseado em características do campeão
if (tags.includes('Assassin')) strongSideScore += 2
if (tags.includes('Fighter')) strongSideScore += 1.5
if (attackDefenseRatio > 1.5) strongSideScore += 1.5
if (tags.includes('Tank')) strongSideScore -= 1.5
if (tags.includes('Mage') && !Assassin) strongSideScore -= 1

// Gank Potential - facilidade de gankar a lane
if (tags.includes('Tank')) gankPotential += 2      // CC pesado
if (tags.includes('Marksman')) gankPotential += 2  // Vulnerável
if (defense <= 3) gankPotential += 1.5             // Imóvel
```

Isso garante que o sistema se adapta automaticamente a:
- ✅ Mudanças de meta e patches
- ✅ Novos campeões lançados
- ✅ Reworks de campeões existentes
- ✅ Ajustes de balanceamento da Riot

### Critérios de Avaliação

- **Pick Rate Dinâmico**: Extraído da API da Community Dragon
- **Sem dados estáticos**: Zero linhas de código hardcoded com nomes de campeões
- **Meta atual**: Reflete exatamente o que está sendo jogado agora no patch atual
- **Multi-posição**: Um campeão pode ser Strong em uma lane e Weak em outra

### Exemplo Prático

Se Jinx tem 9.4% de pick rate e a média de ADCs é 3.5%:
- **9.4% ≥ 3.85% (110% de 3.5%)** → Jinx é **STRONG SIDE**
- Aparece no topo do ranking de Bot Lane
- Prioridade alta para gank

Se Kalista tem 1.0% de pick rate:
- **1.0% < 3.85%** → Kalista é **WEAK SIDE**
- Aparece mais abaixo no ranking
- Prioridade menor para gank

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