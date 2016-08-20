/**
 * @fileoverview This is the code for creating overview+details timelines
 * Call creatTimelines(fTable,KPISelections) to creat timelines
 * @author liuchenyi77@gmail.com (Chenyi Liu)
 * base on example http://bl.ocks.org/mbostock/1667367
 */

//Date parser
var parseDate = d3.time.format("%m %d %H %Y").parse;

/**
* @para {Array} fTable The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
*/
function creatTimelines(fTable,KPISelection){
  var KPICount = KPISelection.length;
  var margin = {top: 10, right: 10, bottom: 100, left: 10},
      width = 960 - margin.left - margin.right,
      chartHeight = 400,
      height = height2 = chartHeight/KPICount;

  var timelineData = calculateTimeline(fTable,KPISelection);
  //sort data by time
  for (var i = 0; i < timelineData.length; i++) {
    timelineData[i].sort(function(a,b){
      return a.date-b.date;
    });
  };

  //creat the scale
  var x = d3.time.scale().range([0, width]),
      x2 = d3.time.scale().range([0, width]);
      x.domain(d3.extent(timelineData[0].map(function(d,i) { return d.date; })));
      x2.domain(x.domain());
  var y=[];
  for(var i = 0; i < KPICount ; i++){
    var ys=d3.scale.linear().range([height, 0]);
    ys.domain([0, d3.max(timelineData[i].map(function(d) { return d.value; }))]);
    y.push(ys);
  }
  //creat the axis
  var xAxis = d3.svg.axis().scale(x).orient("bottom"),
  xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
  var yAxis=[];
  for(var i = 0; i < KPICount ; i++){
      yAxis.push(d3.svg.axis().scale(y[i]).orient("left").ticks(6));
  }
  // create svg and group
  var svg = d3.select("#chart"+window.currentID).append("svg")
    // .attr("width", width + margin.left + margin.right+50)
    // .attr("height", 1000 + margin.top + margin.bottom)
    .attr("viewBox","0,0,1000,"+ (chartHeight+150));

  svg.append("defs").append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  var details = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var overview = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + (margin.top*KPICount+ chartHeight +margin.top) + ")");

  var legendview = svg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + margin.left + "," + (margin.top + chartHeight ) + ")");
  
  createGradient(timelineData);
  //create brush
  var brush = d3.svg.brush()
      .x(x2)
      .on("brush", brushed);

  var overviewLines=[];
  var detailLines=[];

  for(var i=0 ; i < KPICount ; i++){
    //initialize context lines
    var line = d3.svg.line()
        .interpolate(interpolateSankey)
        .x(function(d) {  return x(d.date); })
        .y(function(d) {  return y[i](d.value); });
    //initialize overview lines
    var line2 = d3.svg.line()
        .interpolate("linear")
        .x(function(d){return x2(d.date);})
        .y(0);
    detailLines.push(line);
    overviewLines.push(line2);
  }
  //add axis to svg
  for(var i = 0; i < KPICount; i++){
    details.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(10," + (height+(margin.top+height)*i) + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .attr("transform", "translate(950,-20)")
      .text(KPISelection[i]);

    details.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(10,"+((height+margin.top)*i)+")")
      .call(yAxis[i]);
  }
  overview.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(10," + (KPICount*5+margin.top) + ")")
    .call(xAxis2);

   //detail line gradient
  svg.append("linearGradient")
      .attr("id", "detail-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", height)     
        .attr("x2", 0).attr("y2", 0)
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#fee391"},
        {offset: "50%", color: "#ec7014"},
        {offset: "100%", color: "#800026"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

  //add lines and heatmaps to svg
  for(var i=0 ; i<KPICount; i++){
    details.append("path")
      .datum(timelineData[i])
      .attr("clip-path", "url(#clip)")
      .attr("transform", "translate(10,"+(margin.top+height)*i+")")
      .attr("class","detailsline")
      .attr("id","details"+i)
      .attr("d", detailLines[i]);
    overview.append("path")
      .datum(timelineData[i])
      .attr("class", "contextline")
      .style("stroke", ("url(#line-gradient"+i+")"))
      .attr("transform", "translate(10,"+(margin.top+5*i)+")")
      .attr("d",overviewLines[i]);
  }
  //add brush to svg
  overview.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", 0)
    .attr("height", KPICount*6)
    .attr("transform", "translate(10,10)");
  
  //legend gradient
  svg.append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0).attr("y1", 0)     
        .attr("x2", width).attr("y2", 0)
    .selectAll("stop")
      .data([
        {offset: "0%", color: "#ffffcc"},
        {offset: "50%", color: "#fd8d3c"},
        {offset: "100%", color: "#800026"}
      ])
    .enter().append("stop")
      .attr("offset", function(d) { return d.offset; })
      .attr("stop-color", function(d) { return d.color; });

  var legendLine = d3.svg.line()
    .x(function(d) { return d.x; })
    .y(function(d) { return d.y; });
  var legendData = [{x:100,y:0},{x:width/2,y:0},{x:width-100,y:0}];
  legendview.append("path")
      .attr("class", "legendLine")
      .attr("transform", "translate(10,"+((margin.top+5)*(KPICount+2)+margin.top)+")")
      .attr("d", legendLine(legendData));

  legendview.selectAll(".label")
      .data(legendData).enter()
      .append("text")
      .attr("class","label")
      .attr("transform", function(d){
        return "translate("+(d.x-15)+","+((margin.top+5)*(KPICount+2)+margin.top*2)+")"})
      .text(function(d){
        if(d.x == 100)
          return "good quality"
        else if(d.x == width-100)
          return "poor quality"
      });
  /**
  * This method calculate gradient offset values of each overview heatmap.
  * @para {Array} data A list of object {"date":{Date},"value":{number}}
  * @para {number} num The index of y scale list
  * @para {string} darkcolor A string indicates what dark color represents(good KPI/bad KPI)
  * @return {Array} colorGradient An array of color offest values(heatmap) 
  */
  function calculateGradient(data,num,darkcolor){
    var colorGradient=[];
    for(var i =0;i<data.length;i++){
      var offset = x2(data[i].date)/width;
      var colorScale = d3.scale.linear()
                    .domain([0.2, 0.5, 0.8]);
      if(darkcolor == "high"){
        colorScale.range(["#ffffcc", "#fd8d3c", "#800026"]);
      }
      else{
        colorScale.range(["#d73027", "#ffffbf", "#4575b4"]);
      }
      var color = colorScale(1-y[num](data[i].value)/height);
      colorGradient.push({"offset":offset,"color":color});
    }
    return colorGradient;
  }
  /**
  * This method append gradient to the page
  * @para {Array} data A 2d array of object {"date":{Date},"value":{number}}
  */
  function createGradient(data){
    for(var i=0; i < data.length; i++){
      var darkcolor="high";
      // bad KPI - dark color
      // good KPI - light color
      // if(KPISelection[i] == ){
      //   darkcolor = "low";
      // }
      svg.append("defs").append("linearGradient")        
        .attr("id", ("line-gradient"+i))      
        .attr("gradientUnits", "userSpaceOnUse")  
        .attr("x1", 0).attr("y1", 0)     
        .attr("x2", width).attr("y2", 0)    
        .selectAll("stop")            
        .data(calculateGradient(data[i],i,darkcolor))          
        .enter().append("stop")     
        .attr("offset", function(d) { return d.offset; }) 
        .attr("stop-color", function(d) { return d.color; });
    }
  }
  /*brush function*/
  function brushed() {
    x.domain(brush.empty() ? x2.domain() : brush.extent());
    for (var i = 0; i < KPISelection.length; i++) {
      var temLine = d3.svg.line()
                      .interpolate(interpolateSankey)
                      .x(function(d) {  return x(d.date); })
                      .y(function(d) {  return y[i](d.value); });
      details.select("#details"+i).attr("d", temLine);//function(){return detailLines[i]});
    }
    details.selectAll(".x.axis").call(xAxis);
  }

}
/**
* This method interpolate the lines to make it look smoother
* @para {object} points A point object
*/
function interpolateSankey(points) {
  var x0 = points[0][0], y0 = points[0][1], x1, y1, x2,
      path = [x0, ",", y0],
      i = 0,
      n = points.length;
  while (++i < n) {
    x1 = points[i][0], y1 = points[i][1], x2 = (x0 + x1) / 2;
    path.push("C", x2, ",", y0, " ", x2, ",", y1, " ", x1, ",", y1);
    x0 = x1, y0 = y1;
  }
  return path.join("");
}
/**
* This method handles the padding problem in time parser
* @para {object} points A point object
*/
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

/**
* This method is a time parser
* @para {object} timestamp A Unix time
* @return {string} a string in format like "Dec 31 12 2015"
*/
function parseTimestamp(timestamp){
  var d = new Date(timestamp);
  var month = d.getMonth(),
      day = d.getDate(),
      hour = d.getHours(),
      year = d.getFullYear();

      month=pad(month,2);
      day=pad(day,2);
      hour=pad(hour,2);
  return (month +" " + day + " " + hour+ " " + year);
}

/**
* This method calculate average KPI hourly as the timeline data
* @para {Array} fTable The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
* @return {string} a string in format like "Dec 31 12 2015"
*/
function calculateTimeline(fTable,KPISelection){
    //initialize the data
    var avgKPI = new Array();
    for (var i = 0; i < KPISelection.length; i++) {
      avgKPI[i] = new Array();
    }
    for (var i = 0; i < KPISelection.length; i++) {
      var tmpValue = 0;
      var count = 0;
      for (var j = 0; j < fTable.length; j++) {
        var item = fTable[j];
        if(j==0){
          lastDate = parseTimestamp(item['timestamp']);
        }
        var date = parseTimestamp(item['timestamp']);
        tmpValue += item[KPISelection[i]];
        count++;
        if(date != lastDate) {
          avgKPI[i].push({"date":(parseDate(lastDate)),"value":tmpValue/count});
          tmpValue = 0;
          count = 0;  
        }
        lastDate = date; 
      }            
    }
    return avgKPI;
}     

