const { json } = d3;

json(
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'
).then((data) => init(data));

let movieData,
  svg,
  hierarchy,
  treeMap,
  movieTiles,
  block,
  tooltip,
  legend,
  svgWidth = 1000,
  svgHeight = 600,
  padding = 60;

const movieColors = {
  action: '#FFC300',
  drama: '#FF5733',
  adventure: '#F9609E',
  family: '#43D345',
  animation: '#99B9FA',
  comedy: '#27DA76',
  biography: '#B3F5EE',
};

const init = (data) => {
  movieData = data;
  drawContainer();
  generateTreeMap();
  generateLegend(movieColors);
  generateTooltip();
};

const drawContainer = () => {
  d3.select('h1')
    .attr('id', 'title')
    .append('text')
    .text('Movie Sales')
    .attr('fill', 'black');

  d3.select('h3')
    .attr('id', 'description')
    .text('Top 95 Highest Grossing Movies Grouped By Genre');

  svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#F6F0D5');
};

const generateTreeMap = () => {
  hierarchy = d3
    .hierarchy(movieData, (node) => node['children'])
    .sum((node) => node['value'])
    .sort((node1, node2) => node2['value'] - node1['value']);
  movieTiles = hierarchy.leaves();

  treeMap = d3.treemap().size([svgWidth, svgHeight]);

  treeMap(hierarchy);

  block = svg
    .selectAll('g')
    .data(movieTiles)
    .enter()
    .append('g')
    .attr('transform', (movie) => `translate(${movie['x0']},${movie['y0']})`);

  block
    .append('rect')
    .attr('class', 'tile')
    .attr('fill', (movie) => {
      let category = movie['data']['category'];
      if (category === 'Action') {
        return movieColors.action;
      } else if (category === 'Drama') {
        return movieColors.drama;
      } else if (category === 'Adventure') {
        return movieColors.adventure;
      } else if (category === 'Family') {
        return movieColors.family;
      } else if (category === 'Animation') {
        return movieColors.animation;
      } else if (category === 'Comedy') {
        return movieColors.comedy;
      } else if (category === 'Biography') {
        return movieColors.biography;
      }
    })
    .attr('data-name', (movie) => movie['data']['name'])
    .attr('data-category', (movie) => movie['data']['category'])
    .attr('data-value', (movie) => movie['data']['value'])
    .attr('width', (movie) => movie['x1'] - movie['x0'])
    .attr('height', (movie) => movie['y1'] - movie['y0'])
    .on('mouseover', (movie) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');

      let renueve = movie['data']['value']
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      tooltip.html(`$${renueve}<hr />${movie['data']['name']}`);
      tooltip.attr('data-value', movie['data']['value']);
    })
    .on('mouseout', (movie) => {
      tooltip.transition().style('visibility', 'hidden');
    });

  block
    .append('text')
    .text((movie) => movie['data']['name'])
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

  const legendItems = Object.keys(movieColors);

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
    .style('fill', (d) => movieColors[d]);

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
