/**
* @para {Array} fTable The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
*/
function creatParallelCoordinates(table,KPISettings){

  var margin = {top: 30, right: 10, bottom: 10, left: 10},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal().rangePoints([0, width], 1),
      y = {};

  var line = d3.svg.line(),
      axis = d3.svg.axis().orient("left"),
      background,
      foreground;

  var svg = d3.select("#chart"+window.currentID)
      .append("svg")
      // fixed width and height:
      // .attr("width", width + margin.left + margin.right)
      // .attr("height", height + margin.top + margin.bottom)
      // adaptable width and height
      .attr("viewBox",'0,0,960,500')
      .append("g")
      .attr("transform", "translate(-40," + margin.top + ")");

  KPISettings.push("assetName");

  // Use the list of KPISettings to create dimensions and create a scale for each.
  x.domain(dimensions = KPISettings);
  for (var i = 0; i < KPISettings.length; i++) {
    //categorical
    if(KPISettings[i]!="assetName"){
        y[KPISettings[i]] = d3.scale.linear()
            .domain(d3.extent(table, function(p) { return p[KPISettings[i]]; }))
            .range([height, 0]);
    }//numeric
    else{
      y[KPISettings[i]] = d3.scale.ordinal()
            .domain(table.map(function(p) { return p['assetName']; }))
            .rangePoints([height, 0]);
    }
  }
    // Add grey background lines for context.
    background = svg.append("g")
        .attr("class", "background")
      .selectAll("path")
        .data(table)
      .enter().append("path")
        .attr("d", path);
    
    var colors = d3.scale.category20();
    // Add blue foreground lines for focus.
    foreground = svg.append("g")
        .attr("class", "foreground")
      .selectAll("path")
        .data(table)
      .enter().append("path")
        .style("stroke",function(d){return colors(d['assetName'])})
        .attr("d", path);

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
        .data(dimensions)
      .enter().append("g")
        .attr("class", "dimension")
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; });

    // Add an axis and title.
    g.append("g")
        .attr("class", "axis")
        .each(function(d) { if(d == "assetName"){axis.orient("right");}
          d3.select(this).call(axis.scale(y[d])); })
      .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) { return d; });

    // Add and store a brush for each axis.
    g.append("g")
        .attr("class", "brush")
        .each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
      .selectAll("rect")
        .attr("x", -8)
        .attr("width", 16);

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function(p) { 
      return [x(p), y[p](d[p])]; }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function(p) { return !y[p].brush.empty(); }),
        extents = actives.map(function(p) { return y[p].brush.extent(); });
        foreground.style("display", function(d) {
          return actives.every(function(p, i) {
            // Categorical
            if ("assetName" == p){
              return extents[i][0] <= y[p](d[p]) && y[p](d[p]) <= extents[i][1];
            }// Numeric
            else{
              return extents[i][0] <= d[p] && d[p] <= extents[i][1];
            }
          }) ? null : "none";

        });
  }
}