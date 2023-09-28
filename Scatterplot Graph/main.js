const { json } = d3;

let jsonData,
  svg,
  xScale,
  yScale,
  xAxis,
  yAxis,
  tooltip,
  xPosition,
  yPosition,
  svgWidth = 1000,
  svgHeight = 550;
padding = 40;

json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
).then((data) => init(data));

const init = (data) => {
  jsonData = data;
  drawGraph();
  generateScales();
  generateAxes();
  drawPoints();
  generateTooltip();
};

const drawGraph = () => {
  svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#484747');

  d3.select('svg')
    .append('text')
    .attr('id', 'title')
    .text('Doping in proffesional Bycicle Racing')
    .attr('fill', 'white')
    .attr('x', 280)
    .attr('y', 40);

  d3.select('body')
    .append('div')
    .attr('id', 'legend')
    .text(
      ' Year(x) vs. Time(y) Pink= Doping Allegation | Blue = No Doping Allegation'
    );
};

const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([
      d3.min(jsonData, (item) => item['Year'] - 1),
      d3.max(jsonData, (item) => item['Year'] + 1),
    ])
    .range([padding, svgWidth - padding]);

  yScale = d3
    .scaleTime()
    .domain([
      d3.min(jsonData, (item) => new Date(item['Seconds'] * 1000)),
      d3.max(jsonData, (item) => new Date(item['Seconds'] * 1000)),
    ])
    .range([svgHeight - padding, padding]);
};

const generateAxes = () => {
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
  svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0,${svgHeight - padding})`);

  svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding},0)`);
};

const drawPoints = () => {
  svg
    .selectAll('circle')
    .data(jsonData)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', '5')
    .attr('data-xvalue', (i) => i['Year'])
    .attr('data-yvalue', (i) => new Date(i['Seconds'] * 1000))
    .attr('cx', (item) => xScale(item['Year']))
    .attr('cy', (item) => yScale(new Date(item['Seconds'] * 1000)))
    .attr('fill', (item) => (item['Doping'] != '' ? '#E0115F' : '#0000fF'))
    .on('mouseover', (item) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');

      if (item['Doping'] != '') {
        tooltip.html(
          `${item['Year']} - ${item['Name']} - ${item['Time']} - ${item['Doping']}`
        );
      } else {
        tooltip.html(
          `${item['Year']} - ${item['Name']} - ${item['Time']} - No Allegations`
        );
      }
      tooltip.attr('data-year', item['Year']);
    })
    .on('mouseout', () => {
      tooltip.transition().style('visibility', 'hidden');
    });
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
