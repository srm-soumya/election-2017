// Previous Year Results data
var previous_data = [
  {'year': 2002, 'party': 'BJP', 'wins': 4},
  {'year': 2002, 'party': 'CONG', 'wins': 20},
  {'year': 2002, 'party': 'OTH', 'wins': 36},
  {'year': 2007, 'party': 'BJP', 'wins': 0},
  {'year': 2007, 'party': 'CONG', 'wins': 30},
  {'year': 2007, 'party': 'OTH', 'wins': 30},
  {'year': 2012, 'party': 'BJP', 'wins': 0},
  {'year': 2012, 'party': 'CONG', 'wins': 42},
  {'year': 2012, 'party': 'OTH', 'wins': 18},
]

var number_seats = (previous_data
  .map(item => {
    return item.wins
  })
  .reduce((a, b) => a+b, 0)) / 3

// Nest Previous Year Results by YEAR
var previous_nest = d3.nest()
    .key(d => d.year)
    .entries(previous_data)

// Set width and height of each Box
var box_width = 160,
    box_height = 130,
    box_margin = { top: 20, right: 10, bottom: 30, left: 30 }

// Create DIV for each YEAR
var div = d3.select('#previous-results')
    .selectAll('div.chart').data(previous_nest)
  .enter().append('div')
    .classed('chart', true)

// Add SVG inside each DIV
var box_svg = div.append('svg')
    .attr('width', box_width + box_margin.left + box_margin.right)
    .attr('height', box_height + box_margin.top + box_margin.bottom)
  .append('g')
    .attr('transform', `translate(${box_margin.left}, ${box_margin.top})`)

var yearLabels = box_svg.append('text')
  .classed('year-label', true)
  .attr('text-anchor', 'middle')
  .attr('x', box_width / 2)
  .attr('y', -7)
  .text(d => d.key)

var party_names = [...new Set(previous_data.map(item => item.party))]
// X-Scale
var box_xscale = d3.scaleBand()
  .domain(party_names)
  .range([0, box_width])
  .padding(0.1)

// Y-Scale
var box_yscale = d3.scaleLinear()
  .domain([0, number_seats])
  .range([box_height, 0])

var box_xaxis = d3.axisBottom(box_xscale)
var box_yaxis = d3.axisLeft(box_yscale)
    .ticks(4)
    .tickSize(-box_width)

// Color-Scale
var color = d3.scaleOrdinal()
    .domain(['BJP', 'CONG', 'AAP', 'OTH', 'SP-CONG', 'BSP', 'SP'])
    .range(['#F97D09', '#23cdc7', '#29bf10', '#999', '#FE0000', '#22409A', '#FE0000'])

// Create Bar Chart
var bars = box_svg
    .selectAll('rect.bar').data(c => c.values)
  .enter().append('rect')
    .attr('x', d => box_xscale(d.party))
    .attr('width', box_xscale.bandwidth())
    .attr('y', d => box_yscale(d.wins))
    .attr('height', d => (box_height - box_yscale(d.wins)))
    .attr('fill', d => color(d.party))

box_svg.append('g')
  .classed('axis', true)
  .classed('x-axis', true)
  .attr('transform', `translate(0, ${box_height})`)
  .call(box_xaxis)

box_svg.append('g')
  .classed('axis', true)
  .classed('y-axis', true)
  .call(box_yaxis)

// Bar Labels
var bars_label = box_svg
    .selectAll('text.bar-label').data(c => c.values)
  .enter().append('text')
    .attr('x', d => box_xscale(d.party) + (box_xscale.bandwidth() / 2))
    .attr('y', d => box_yscale(d.wins))
    .attr('text-anchor', 'middle')
    .attr('dy', '-0.35rem')
    .text(d => d.wins)
