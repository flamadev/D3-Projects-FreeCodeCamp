const { json } = d3;

json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json'
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
const kickstarterColors = {
  ProductDesign: '#A7D8B9',
  TabletopGames: '#C3DED7',
  GamingHardware: '#EAD7C1',
  VideoGames: '#F1D4AF',
  Sound: '#FFD3B6',
  Television: '#FFB5A7',
  NarrativeFilm: '#FF9AA2',
  Web: '#FFB7B2',
  Hardware: '#FFDAC1',
  Games: '#FFEDCE',
  G3DPrinting: '#D5E4A7',
  Technology: '#B9D8C2',
  Wearables: '#A5D8D8',
  Sculpture: '#A7C3D9',
  Apparel: '#C1C0E1',
  Food: '#E0C7E2',
  Art: '#E6B1D1',
  Gadgets: '#F0B2A0',
  Drinks: '#FBD2B7',
};
const init = (data) => {
  kickstarterData = data;
  drawContainer();
  generateTreeMap();
  generateLegend(kickstarterColors);
  generateTooltip();
};

const drawContainer = () => {
  d3.select('h1')
    .attr('id', 'title')
    .append('text')
    .text('Kickstarter Pledges')
    .attr('fill', 'black');

  d3.select('h3')
    .attr('id', 'description')
    .text('Top 100 Most Pledged Kickstarter Campaigns Grouped By Category');

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
  kickstarterTiles = hierarchy.leaves();

  treeMap = d3.treemap().size([svgWidth, svgHeight]);

  treeMap(hierarchy);

  block = svg
    .selectAll('g')
    .data(kickstarterTiles)
    .enter()
    .append('g')
    .attr(
      'transform',
      (kickstarter) => `translate(${kickstarter['x0']},${kickstarter['y0']})`
    );

  block
    .append('rect')
    .attr('class', 'tile')
    .attr('fill', (kickstarter) => {
      let category = kickstarter['data']['category'];
      if (category === 'Product Design') {
        return kickstarterColors.ProductDesign;
      } else if (category === 'Tabletop Games') {
        return kickstarterColors.TabletopGames;
      } else if (category === 'Gaming Hardware') {
        return kickstarterColors.GamingHardware;
      } else if (category === 'Video Games') {
        return kickstarterColors.VideoGames;
      } else if (category === 'Sound') {
        return kickstarterColors.Sound;
      } else if (category === 'Television') {
        return kickstarterColors.Television;
      } else if (category === 'Narrative Film') {
        return kickstarterColors.NarrativeFilm;
      } else if (category === 'Web') {
        return kickstarterColors.Web;
      } else if (category === 'Hardware') {
        return kickstarterColors.Hardware;
      } else if (category === 'Games') {
        return kickstarterColors.Games;
      } else if (category === '3D Printing') {
        return kickstarterColors.G3DPrinting;
      } else if (category === 'Technology') {
        return kickstarterColors.Technology;
      } else if (category === 'Wearables') {
        return kickstarterColors.Wearables;
      } else if (category === 'Sculpture') {
        return kickstarterColors.Sculpture;
      } else if (category === 'Apparel') {
        return kickstarterColors.Apparel;
      } else if (category === 'Food') {
        return kickstarterColors.Food;
      } else if (category === 'Art') {
        return kickstarterColors.Art;
      } else if (category === 'Gadgets') {
        return kickstarterColors.Gadgets;
      } else if (category === 'Drinks') {
        return kickstarterColors.Drinks;
      }
    })
    .attr('data-name', (kickstarter) => kickstarter['data']['name'])
    .attr('data-category', (kickstarter) => kickstarter['data']['category'])
    .attr('data-value', (kickstarter) => kickstarter['data']['value'])
    .attr('width', (kickstarter) => kickstarter['x1'] - kickstarter['x0'])
    .attr('height', (kickstarter) => kickstarter['y1'] - kickstarter['y0'])
    .on('mouseover', (kickstarter) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');

      let renueve = kickstarter['data']['value']
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      tooltip.html(`$${renueve}<hr />${kickstarter['data']['name']}`);
      tooltip.attr('data-value', kickstarter['value']);
    })
    .on('mouseout', (kickstarter) => {
      tooltip.transition().style('visibility', 'hidden');
    });

  block
    .append('text')
    .text((kickstarter) => kickstarter['data']['name'])
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

  const legendItems = Object.keys(kickstarterColors);

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
    .style('fill', (d) => kickstarterColors[d]);

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
