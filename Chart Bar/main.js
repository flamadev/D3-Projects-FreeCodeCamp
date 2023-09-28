const { json, select, scaleLinear, scaleUtc } = d3;

let gdpData,
  xScale,
  yScale,
  xAxis,
  yAxis,
  svg,
  dateDisplay,
  gdpDisplay,
  gdpInfo,
  tooltip,
  quarter,
  svgWidth = 1000,
  svgHeight = 550,
  padding = 40,
  yearRegex = /[0-9]{4}/;
hyphenRegex = /-[0-9]{2}/;
monthRegex = /[0-9]{2}/;

json(
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
).then((data) => init(data));

const init = (data) => {
  gdpData = data.data;
  d3.select('body')
    .style('padding', `${padding * 3}px`)
    .style('box-sizing', 'border-box');
  drawGraph();
  generateScales();
  generateAxes();
  drawBars();
  generateTooltip();
};

const drawGraph = () => {
  svg = d3
    .select('body')
    .append('svg')
    .attr('id', 'body')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

  d3.select('svg')
    .append('text')
    .attr('id', 'title')
    .text('ChartBar')
    .attr('fill', 'black')
    .attr('x', 500)
    .attr('y', 40);
};
const generateScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([1947, 2015.75])
    .range([padding, svgWidth - padding]);

  yScale = scaleLinear()
    .domain([0, d3.max(gdpData, (d) => d[1])])
    .range([svgHeight - padding, padding]);
};

const generateAxes = () => {
  xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
  yAxis = d3.axisLeft(yScale);
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

  dateDisplay = tooltip
    .append('div')
    .style('height', '40px')
    .style('width', '140px');

  gdpDisplay = tooltip
    .append('div')
    .style('height', '40px')
    .style('width', '150px');
};

const drawBars = () => {
  svg
    .selectAll('rect')
    .data(gdpData)
    .enter()
    .append('rect')
    .attr('fill', 'red')
    .attr('class', 'bar')
    .attr('x', (d, i) => {
      const year = Number(d[0].match(yearRegex));
      const hyphenMonth = d[0].match(hyphenRegex);
      const month = Number(hyphenMonth[0].match(monthRegex));

      if (month === 1) {
        return xScale(year);
      }
      if (month === 4) {
        return xScale(year + 0.25);
      }
      if (month === 7) {
        return xScale(year + 0.5);
      }
      if (month === 10) {
        return xScale(year + 0.75);
      }
      return xScale(year + month / 12);
    })
    .attr('y', (d) => yScale(d[1]))
    .attr('width', (svgWidth - padding - padding) / gdpData.length)
    .attr('height', (d) => svgHeight - yScale(d[1]) - padding)
    .attr('data-date', (d) => d[0])
    .attr('data-gdp', (d) => d[1])
    .on('mouseover', (d) => {
      gdpInfo = d;
      tooltip
        .html(`Date: ${gdpInfo[0]}<br>GDP: $${gdpInfo[1]} Billion`)
        .style('left', `${d3.event.pageX}px`)
        .attr('data-date', (gdpInfo) => d[0])
        .attr('data-gdp', (gdpInfo) => d[1])
        .style('top', '420px')
        .transition()
        .style('visibility', 'visible');

      const year = Number(gdpInfo[0].match(yearRegex));
      const hyphenMonth = gdpInfo[0].match(hyphenRegex);
      const month = Number(hyphenMonth[0].match(monthRegex));
      quarter = null;
      if (month === 1) {
        quarter = 1;
      }
      if (month === 4) {
        quarter = 2;
      }
      if (month === 7) {
        quarter = 3;
      }
      if (month === 10) {
        quarter = 4;
      }
      tooltip.attr('data-date', gdpInfo[0]);
      dateDisplay.data(gdpInfo).text(`Q${quarter} ${year}`);

      gdpDisplay.data(gdpInfo).text(`$${gdpInfo[1]} Billion`);
    })

    .on('mouseout', (d) => {
      tooltip.transition().style('visibility', 'hidden');
    });
};
