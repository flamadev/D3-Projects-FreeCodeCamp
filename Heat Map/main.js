const { json } = d3;

let jsonData,
  svg,
  xScale,
  yScale,
  xAxis,
  yAxis,
  minYear,
  maxYear,
  baseTemp,
  xPosition,
  yPosition,
  tooltip,
  legend,
  svgWidth = 1200,
  svgHeight = 600,
  padding = 60,
  legendWidth = 400,
  legendHeight = 300,
  height = 33 * 12,
  fontSize = 16,
  legendPadding = {
    left: 9 * fontSize,
    right: 9 * fontSize,
    top: 1 * fontSize,
    bottom: 8 * fontSize,
  };

json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'
).then((data) => init(data));

const init = (data) => {
  jsonData = data.monthlyVariance;
  baseTemp = data.baseTemperature;
  generateGraph();
  generateScales();
  generateAxes();
  generateCells();
  generateTooltip();
  generateReferences();
};

const generateGraph = () => {
  d3.select('h1')
    .attr('id', 'title')
    .append('text')
    .text('Monthly Global Land-Surface Temperature')
    .attr('fill', 'black');

  d3.select('h3')
    .attr('id', 'description')
    .text('Temperatures from 1753 - 2015 . Average is 8.66℃');

  svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#F6F0D5');

  d3.select('body').append('div').attr('id', 'legend');
};

const generateScales = () => {
  minYear = d3.min(jsonData, (item) => item['year']);
  maxYear = d3.max(jsonData, (item) => item['year']);
  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, svgWidth - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0), new Date(0, 11)])
    .range([svgHeight - padding, padding]);
};

const generateAxes = () => {
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

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

const generateCells = () => {
  svg
    .selectAll('rect')
    .data(jsonData)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('fill', (item) => {
      let variance = item['variance'];
      if (variance <= -1) {
        return '#1D6DF5';
      } else if (variance <= 0) {
        return '#C0FAF3';
      } else if (variance <= 1) {
        return '#FFB142';
      } else {
        return '#F90D0D';
      }
    })
    .attr('data-month', (d) => d['month'] - 1)
    .attr('data-year', (d) => d['year'])
    .attr('data-temp', (d) => baseTemp + d['variance'])
    .attr('height', (svgHeight - padding) / 12)
    .attr('y', (item) => yScale(new Date(0, item['month'])))
    .attr('width', (item) => {
      let countYears = maxYear - minYear;
      return (svgWidth - padding) / countYears;
    })
    .attr('x', (item) => xScale(item['year']))
    .on('mouseover', (item) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');
      let monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      tooltip.text(
        item['year'] +
          ' ' +
          monthNames[item['month'] - 1] +
          ' : ' +
          item['variance']
      );

      tooltip.attr('data-year', item['year']);
    })
    .on('mouseout', (item) => {
      tooltip.transition().style('visibility', 'hidden');
    });
};

const generateReferences = () => {
  let width = 5 * Math.ceil(jsonData.length / 12);
  const legendData = [
    { color: '#1D6DF5', label: 'Variance of -1 or less' },
    { color: '#C0FAF3', label: 'On or Below Average' },
    { color: '#FFB142', label: 'Above Average' },
    { color: '#F90D0D', label: 'Variance of +1 or more' },
  ];
  let legendContainer = d3.select('#legend').attr('height', 180);

  let legendGroups = legendContainer
    .selectAll('.legend-group')
    .data(legendData)
    .enter()
    .append('g')
    .attr('class', 'legend-group')
    .attr('transform', (d, i) => `translate(10, ${i * 40})`);
  legendGroups
    .append('rect')
    .attr('x', 10)
    .attr('y', 0)
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', (d) => d.color);
  legendGroups
    .append('text')
    .attr('x', 60)
    .attr('y', 30)
    .attr('fill', 'black')
    .text((d) => d.label);
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
