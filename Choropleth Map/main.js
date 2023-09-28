const { json, geoPath } = d3;
let jsonEducation =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
let jsonMap =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';

let countyData,
  educationData,
  svg,
  country,
  legend,
  xScaleLegend,
  referenceColor,
  tooltip,
  g,
  svgWidth = 1000,
  svgHeight = 650,
  padding = 40,
  colors = {
    colorA: '#F7B0E1',
    colorB: '#FA5AC9',
    colorC: '#DF2AA8',
    colorD: '#B801AA',
    colorE: '#9409C4',
  };

d3.json(jsonMap).then((data, err) => {
  if (err) {
    console.log(err);
  } else {
    countyData = topojson.feature(data, data.objects.counties).features;

    json(jsonEducation).then((data, err) => {
      if (err) console.log(err);
      else {
        educationData = data;
        init();
      }
    });
  }
});

const init = () => {
  drawContainer();
  drawMap();
  generateTooltip();
  generateLegend();
};

const drawContainer = () => {
  d3.select('h1')
    .attr('id', 'title')
    .append('text')
    .text('United States Educational Attainment')
    .attr('fill', 'black');

  d3.select('h3')
    .attr('id', 'description')
    .text(
      'Percentage of adults age 25 and older with a bachelors degree or higher'
    );

  svg = d3
    .select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)
    .style('background-color', '#F6F0D5');
};

const getCounty = (countyItem) => {
  let id = countyItem['id'];
  let county = educationData.find((item) => {
    return item['fips'] === id;
  });
  return county;
};
const drawMap = () => {
  svg
    .selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr('fill', (countyItem) => {
      let county = getCounty(countyItem);
      let percentaje = county['bachelorsOrHigher'];
      if (percentaje <= 15) return colors.colorD;
      else if (percentaje <= 30) return colors.colorC;
      else if (percentaje <= 45) return colors.colorB;
      else return colors.colorA;
    })
    .attr('data-fips', (countyItem) => countyItem['id'])
    .attr('data-education', (countyItem) => {
      let county = getCounty(countyItem);
      let percentaje = county['bachelorsOrHigher'];
      return percentaje;
    })
    .on('mouseover', (countyItem) => {
      xPosition = d3.event.pageX;
      yPosition = d3.event.pageY;

      tooltip
        .style('left', `${xPosition + 10}px`)
        .style('top', `${yPosition}px`)
        .transition()
        .style('visibility', 'visible');
      let id = countyItem['id'];
      let county = educationData.find((item) => {
        return item['fips'] === id;
      });

      tooltip.text(
        `${county['fips']}- ${county['area_name']},${county['state']}:${county['bachelorsOrHigher']}% `
      );

      tooltip.attr('data-education', county['bachelorsOrHigher']);
    })
    .on('mouseout', (countyItem) => {
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

const generateLegend = () => {
  legend = d3
    .select('#legend')
    .append('g')
    .attr('transform', 'translate(0,40)');

  xScaleLegend = d3.scaleLinear().domain([3, 45]).rangeRound([600, 800]);

  referenceColor = d3
    .scaleThreshold()
    .domain([3, 15, 30, 45, 66])
    .range(['#F7B0E1', '#FA5AC9', '#DF2AA8', '#B801AA', '#9409C4']);

  legend
    .selectAll('rect')
    .data(
      referenceColor.range().map((d) => {
        d = referenceColor.invertExtent(d);
        if (d[0] === null) {
          d[0] = xScaleLegend.domain()[0];
        }
        if (d[1] === null) {
          d[1] = xScaleLegend.domain()[1];
        }
        return d;
      })
    )
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', (d) => xScaleLegend(d[0]))
    .attr('width', (d) =>
      d[0] && d[1]
        ? xScaleLegend(d[1]) - xScaleLegend(d[0])
        : xScaleLegend(null)
    )
    .attr('fill', (d) => referenceColor(d[0]));

  legend
    .append('text')
    .attr('class', 'caption')
    .attr('x', xScaleLegend.range()[0])
    .attr('y', -6)
    .attr('fill', '#000')
    .attr('text-anchor', 'start')
    .attr('font-weight', 'bold');

  legend
    .call(
      d3
        .axisBottom(xScaleLegend)
        .tickSize(13)
        .tickFormat((xScaleLegend) => Math.round(xScaleLegend) + '%')
        .tickValues(referenceColor.domain())
    )
    .select('.domain')
    .remove();
};
