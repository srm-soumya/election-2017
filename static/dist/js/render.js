var state
var num_constituency
var node_radius
var opinion_data
var previous_data

// Color-Scale
var color = d3.scaleOrdinal()
    .domain(['BJP', 'CONG', 'AAP', 'OTH', 'SP-CONG', 'BSP', 'SP', 'SAD', 'SAD-BJP'])
    .range(['#F97D09', '#23cdc7', '#29bf10', '#999', '#FE0000', '#22409A', '#FE0000', '#22409A', '#F97D09'])

function render(data) {
  state = data['state']
  num_constituency = +data['num_constituency']
  node_radius = +data['node_radius']
  opinion_data = data['opinion-poll-data']
  previous_data = data['previous-year-data']['one']

  drawbars()
  drawforce()
}
