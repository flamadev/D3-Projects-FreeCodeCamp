const { json } = d3;

json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json'
).then((data) => init(data));

let kickstarterData,
  svg,
  block,
  tooltip,
  legend,
  hierarchy,
  svgWidth = 1000,
  svgHeight = 600,
  padding = 60;

const gamesColors = {
  2600: '#1f77b4',
  wii: '#FF7F0E',
  NES: '#2ca02c',
  GB: '#d62728',
  DS: '#9467bd',
  X360: '#8c564b',
  PS3: '#e377c2',
  PS2: '#7f7f7f',
  SNES: '#bcbd22',
  GBA: '#17becf',
  PS4: '#FADBD8',
  G3DS: '#BB8FCE',
  N64: '#48C9B0',
  PS: '#F4D03F',
  XB: '#E67E22',
  PC: '#808B96',
  PSP: '#EC7063',
  XOne: '#5499C7',
};

const init = (data) => {
  kickstarterData = data;
  drawContainer();
  generateTreeMap();
  generateLegend(gamesColors);
  generateTooltip();
};

const drawContainer = () => {
  d3.select('h1')
    .attr('id', 'title')
    .append('text')
    .text('Video Game Sales')
    .attr('fill', 'black');

  d3.select('h3')
    .attr('id', 'description')
    .text('Top 100 Most Sold Video Games Grouped by Platform');

  svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#F6F0D5');
};

const generateTreeMap = () => {
  hierarchy = d3
    .hierarchy(kickstarterData, (node) => node['children'])
    .sum((node) => node['value'])
    .sort((node1, node2) => node2['value'] - node1['value']);
  gameTiles = hierarchy.leaves();

  treeMap = d3.treemap().size([svgWidth, svgHeight]);

  treeMap(hierarchy);

  block = svg
    .selectAll('g')
    .data(gameTiles)
    .enter()
    .append('g')
    .attr('transform', (game) => `translate(${game['x0']},${game['y0']})`);

  block
    .append('rect')
    .attr('class', 'tile')
    .attr('fill', (game) => {
      let category = game['data']['category'];
      if (category === '2600') {
        return gamesColors[2600];
      } else if (category === 'Wii') {
        return gamesColors.wii;
      } else if (category === 'NES') {
        return gamesColors.NES;
      } else if (category === 'GB') {
        return gamesColors.GB;
      } else if (category === 'DS') {
        return gamesColors.DS;
      } else if (category === 'X360') {
        return gamesColors.X360;
      } else if (category === 'PS3') {
        return gamesColors.PS3;
      } else if (category === 'PS2') {
        return gamesColors.PS2;
      } else if (category === 'SNES') {
        return gamesColors.SNES;
      } else if (category === 'GBA') {
        return gamesColors.GBA;
      } else if (category === 'PS4') {
        return gamesColors.PS4;
      } else if (category === '3DS') {
        return gamesColors.G3DS;
      } else if (category === 'N64') {
        return gamesColors.N64;
      } else if (category === 'PS') {
        return gamesColors.PS;
      } else if (category === 'XB') {
        return gamesColors.XB;
      } else if (category === 'PC') {
        return gamesColors.PC;
      } else if (category === 'PSP') {
        return gamesColors.PSP;
      } else if (category === 'XOne') {
        return gamesColors.XOne;
      }
    })
    .attr('data-name', (game) => game['data']['name'])
    .attr('data-category', (game) => game['data']['category'])
    .attr('data-value', (game) => game['data']['value'])
    .attr('width', (game) => game['x1'] - game['x0'])
    .attr('height', (game) => game['y1'] - game['y0'])
    .on('mouseover', (game) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');

      let renueve = game['data']['value']
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      tooltip.html(`$${renueve}<hr />${game['data']['name']}`);
      tooltip.attr('data-value', game['value']);
    })
    .on('mouseout', (game) => {
      tooltip.transition().style('visibility', 'hidden');
    });

  block
    .append('text')
    .text((game) => game['data']['name'])
    .attr('x', 5)
    .attr('y', 20);
};
const generateLegend = (colors) => {
  legend = d3
    .select('#legend')
    .append('svg')
    .attr('width', 200)
    .attr('height', 300)
    .attr('id', 'legend')
    .style('border', '1px solid #ccc');

  const legendItems = Object.keys(gamesColors);

  const legendGroup = legend
    .selectAll('g')
    .data(legendItems)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(0, ${i * 40})`);
  legendGroup
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', 10)
    .attr('y', 5)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', (d) => gamesColors[d]);

  legendGroup
    .append('text')
    .attr('x', 50)
    .attr('y', 25)
    .text((d) => d)
    .attr('fill', 'black')
    .style('font-size', '14px');

  const legendHeight = legendItems.length * 40 + 20;
  legend.attr('height', legendHeight);
};

const generateTooltip = () => {
  tooltip = d3
    .select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('background', 'grey')
    .style('color', 'white')
    .style('border-radius', '5px')
    .style('visibility', 'hidden')
    .style('position', 'absolute')
    .style('padding', '10px')
    .style('top', '0')
    .style('left', `${svgWidth + padding}px`);
};
