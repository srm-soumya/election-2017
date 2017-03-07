// Set the margin, width & height for Opinion Polls
var margin = {top: 20, right: 0, bottom: 0, left: 20},
    width = 1000 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom

// Create SVG and add to the page
var svg = d3.select('#opinion-polls').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Structure of Data
var opinion_data = {
  'HuffPost-CVoter': {
    'BJP': { 'seats': 15, 'range': '15', 'percentage': 31},
    'CONG': { 'seats': 14, 'range': '14', 'percentage': 26},
    'AAP': { 'seats': 2,  'range': '2',  'percentage': 13.2},
    'OTH': { 'seats': 9,  'range': '9',  'percentage': 29.8}
  },
  'India Today-Axis': {
    'BJP': { 'seats': 23, 'range': '22-25', 'percentage': 46},
    'CONG': { 'seats': 13, 'range': '12-14', 'percentage': 25},
    'AAP': { 'seats': 2,  'range': '1-2',  'percentage': 10},
    'OTH': { 'seats': 2,  'range': '1-5',  'percentage': 20}
  },
  'Kautilya': {
    'BJP': { 'seats': 11, 'range': '11', 'percentage': 46},
    'CONG': { 'seats': 7, 'range': '7', 'percentage': 25},
    'AAP': { 'seats': 14,  'range': '14',  'percentage': 10},
    'OTH': { 'seats': 8,  'range': '8',  'percentage': 20}
  },
  'Prudent Media': {
    'BJP': { 'seats': 18, 'range': '17-18', 'percentage': 46},
    'CONG': { 'seats': 13, 'range': '12-13', 'percentage': 25},
    'AAP': { 'seats': 5,  'range': '4-5',  'percentage': 10},
    'OTH': { 'seats': 4,  'range': '4-5',  'percentage': 20}
  },
  'VDPAssociates': {
    'BJP': { 'seats': 22, 'range': '22', 'percentage': 41.4},
    'CONG': { 'seats': 6, 'range': '6', 'percentage': 23.5},
    'AAP': { 'seats': 9,  'range': '9',  'percentage': 24},
    'OTH': { 'seats': 3,  'range': '2-3',  'percentage': 5}
  }
}

// Get all the agencies
var agencies = d3.keys(opinion_data)
// Add button for each agency
var agency = d3.select('#agency-list')
  .selectAll('button.agency').data(agencies)
.enter().append('button')
  .classed('agency', true)
  .attr('id', d => d)
  .html(d => d)
  .on('click', animateBubble)

// Major Political Parties in the state
var parties = d3.keys(opinion_data[agencies[0]])

// Set xscale for all the parties in the state
var xscale = d3.scalePoint()
    .domain(parties)
    .range([0, width])
    .padding(0.5)

// Set Radius, spacing between clusters and nodes
var node_radius = 7,
    padding = 1,
    cluster_padding = 10,
    num_nodes = 40

var foci = {
  'center': { x: width / 2, y: height/2, color: '#555'}
}
// Foe every party define the cluster center
parties.forEach((party) => {
  foci[party] = {
      x: xscale(party),
      y: (height / 2),
      color: color(party)
    }
})

var source = []

// Create data points
var nodes = d3.range(0, num_nodes).map(function(o, i) {
  return {
    id: `node${i}`,
    x: foci.center.x + Math.random(),
    y: foci.center.y + Math.random(),
    radius: node_radius,
    choice: 'center'
  }
})

// Force Simulation
var simulation = d3.forceSimulation()
    .force('cluster',
      d3.forceCluster()
        .centers(d => foci[d.choice])
        .strength(1)
        .centerInertia(1)
    )
    .force('collide',
      d3.forceCollide(d => d.radius + padding)
    )
    .on('tick', tick)
    .nodes(nodes)

// Set the party name as labels
var party_labels = svg.selectAll('text.party-label')
    .data(parties)
  .enter().append('text')
    .attr('class', d => d)
    .classed('party-label', true)
    .attr('x', d => xscale(d))
    .attr('y', 15)
    .attr('text-anchor', 'middle')
    .attr('fill', '#ddd')
    .text(d => d)

// Set the container for number of seats
var seat_labels = svg.selectAll('text.seat-label')
    .data(parties)
  .enter().append('text')
    .classed('seat-label', true)
    .attr('x', d => xscale(d))
    .attr('y', 32)
    .attr('text-anchor', 'middle')
    .attr('fill', '#fff')

// Create circles and add
var circle = svg.selectAll('circle')
    .data(nodes)
  .enter().append('circle')
    .attr('id', d => d.id)
    .classed('node', true)
    .style('fill', d => foci[d.choice].color )

// Smoother initial transition to settling spots
circle.transition()
  .duration(1000)
  .delay((d, i) => i * 5)
  .attrTween('r', d => {
    var i = d3.interpolate(2, d.radius)
    return function(t) { return d.radius = i(t) }
  })

// Tick function
function tick(e) {
  circle
    .style('fill', d => foci[d.choice].color )
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
}

// Run functions periodically to make things move
var timeout;
var counter = 0
function timer() {

  var choice = source.shift()

  nodes[counter].cx = foci[choice].x
  nodes[counter].cy = foci[choice].y
  nodes[counter].choice = choice

  counter++

  simulation.force('cluster',
      d3.forceCluster()
        .centers(d => foci[d.choice])
        .strength(1)
        .centerInertia(1)
    )
  simulation.alphaTarget(0.15).restart()
  if(source.length)
    timeout = setTimeout(timer, 1)
}

// Handle click events on button
function animateBubble(e) {
  d3.selectAll('.agency').classed('active', false)
  var agency = d3.select(this).classed('active', true).attr('id')
  var agency_data = opinion_data[agency]

  var winner = agency_data[parties[0]]
  winner['party'] = parties[0]
  parties.forEach((party) => {
    if (agency_data[party].seats > winner.seats) {
      winner = agency_data[party]
      winner['party'] = party
    }
  })

  console.log(winner)
  d3.selectAll('.party-label')
    .classed('winner', false)

  d3.select(`.${winner.party}`)
    .classed('winner', true)

  seat_labels
    .attr('opacity', 0)
    .transition()
    .duration(2000)
    .delay(500)
    .attr('opacity', 1)
    .text(d => agency_data[d]['range'])
    .attr('fill', '#444')

  party_labels.attr('fill', '#222')
  counter = 0

  d3.values(agency_data)
    .forEach((d, i) => {
      source.push.apply(source, Array(d['seats']).fill(parties[i]))
    })
  timeout = setTimeout(timer, 10)
}
