/**
 * @fileoverview This is the code for creating Month/Day/Hour heatmap
 * Call creatHeatmaps(fTable,KPISelections) to creat heatmaps
 * @author liuchenyi77@gmail.com (Chenyi Liu)
 * base on example http://bl.ocks.org/tjdecke/5558084
 */

/**
* @para {Array} fTable The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
*/
function creatHeatmaps(fTable,KPISelection){
  var timeGranularity = $('#chart'+window.currentID+' .active').text();
  creatHeatmap(timeGranularity);
  /** this method create the heatmaps
  * @para {string} type A string of time granularity (Hourly/Daily/Monthly)
  */
  function creatHeatmap(type){
    $('#chart'+window.currentID+' svg g').children().remove();
    var data = calculateHeatmap(type,KPISelection,fTable);
    visualizeHeatmap(type,data,KPISelection);
  }
  /** this method calculate the heatmap data
  * @para {string} type A string of time granularity (Hourly/Daily/Monthly)
  */
  function calculateHeatmap(type){
    //array for sums
    // m - the number of days/hours/months
    var m;
    if(type == "Hourly") m = 24;
    else if (type == "Daily") m = 7;
    else m = 12;

    var heatmapData = [];
    //store KPI value in the correspondant cell
    for(var i = 0; i < KPISelection.length; i++){
      var sumValue = creat2DArray(KPISelection.length,m),
          sumTimes = creat2DArray(KPISelection.length,m);
      var lineData = [];
      for (var j = 0; j < fTable.length; j++) {
        var item = fTable[j];
        var d = new Date(item['timestamp']);
        //get weekday/hour/month, add the value and time duration to sum;
        var xIndex;
        if(type == "Hourly")  xIndex= d.getHours();
        else if (type == "Daily") xIndex = d.getDay();
        else xIndex = d.getMonth();
        var t= item[KPISelection[i]];
        sumValue[i][xIndex]= sumValue[i][xIndex]+t;
        sumTimes[i][xIndex]++;
      }

      for (var j = 0; j < m; j++) {
        if(sumTimes[i][j]!=0){
          var avgValue=sumValue[i][j]/sumTimes[i][j];
          heatmapData.push({"KPI":i,"time":j,"avgValue":avgValue});
        }
        else{
          heatmapData.push({"KPI":i,"time":j,"avgValue":0});
        }
      }
    }
    return heatmapData;
  }

  $('#panels').on('click', '#radiobox label', function() {
    creatHeatmap($(this).text());
  });
}

function visualizeHeatmap(type,data,KPISelection){
  var margin = { top: 50, right: 30, bottom: 50, left: 30 , gap:10},
    width = 960 - margin.left - margin.right,
    height = 430 - margin.top - margin.bottom,
    gridSize = Math.floor(width / 24),
    legendElementWidth = gridSize/2,
    textLength = 50;
    buckets = 9,
    // colors = ["#4575b4","#74add1","#abd9e9","#e0f3f8","#ffffbf","#fee090","#fdae61","#f46d43","#d73027"], // alternatively colorbrewer.YlGnBu[9]
    colors = ['rgb(255,255,204)','rgb(255,237,160)','rgb(254,217,118)','rgb(254,178,76)','rgb(253,141,60)','rgb(252,78,42)','rgb(227,26,28)','rgb(189,0,38)','rgb(128,0,38)'],
    days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
    hours = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"],
    months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  drawGrid(type);
  drawCells(data);

  function drawCells(data){
    var colorScales = [];
    //create color scales
    for (var i = 0; i < KPISelection.length; i++) {
      var minBR=d3.min(data,function(d){if(d.KPI==i) return d.avgValue;});
      var maxBR=d3.max(data,function(d){if(d.KPI==i) return d.avgValue;});
      var colorScale = d3.scale.quantile()
        .domain([minBR, maxBR])
        .range(colors);
      colorScales.push(colorScale);
    }
      //create heatmap
      var heatMap = svg.selectAll(".hour")
            .data(data)
            .enter().append("rect")
            .attr("rx", 4)
            .attr("ry", 4)
            .attr("class", "hour bordered")
            .attr("width", gridSize)
            .attr("height", gridSize)
            .attr("transform", "translate(" + textLength + "," + margin.gap + ")")
            .style("fill",colors[0]);

      heatMap.transition().duration(1000)
                  .style("fill", function(d) { return colorScales[d.KPI](d.avgValue); });

      heatMap.attr("x", function(d) { return d.time * gridSize; })
              .attr("y", function(d) { return d.KPI * gridSize; })

      heatMap.append("title").text(function(d,i) { 
                                  var s =d.avgValue.toFixed(2); 
                                  if(KPISelection[d.KPI] == "delay time" || KPISelection[d.KPI] == "rebuffering time")
                                    s = s+ " secs"
                                  else 
                                    s = s+ " times"
                                  return s; });
    // create the lengend
    var legend = svg.selectAll(".legend")
          .data([0].concat(colorScales[0].quantiles()), function(d) { return d; });
    legend.enter().append("g")
          .attr("class", "Heatmaplegend");

    legend.append("rect")
        .attr("x", function(d, i) { return legendElementWidth * i + textLength; })
        .attr("y", gridSize*KPISelection.length + gridSize/2)
        .attr("width", legendElementWidth)
        .attr("height", gridSize / 2)
        .style("fill", function(d, i) { return colors[i]; });
    legend.append("text")
        .attr("class", "axis-worktime")
        .text(function(d,i) { 
                            if(i==0)
                              return "good quality"
                            if(i==8)
                              return "poor quality"
                            else
                              return " ";
                          })
        .attr("x", function(d, i) { return legendElementWidth * i + textLength; })
        .attr("y", gridSize*(KPISelection.length+1)+margin.gap);    
  }

  function drawGrid(type){
    //create y axis - KPIs
    var svg = d3.select("#chart"+window.currentID).select("svg").select("g");
    var KPILabels = svg.selectAll(".KPILabel")
        .data(KPISelection)
        .enter().append("text")
          .text(function (d) { return d; })
          .attr("x", 0)
          .attr("y", function (d, i) { return i * gridSize; })
          //dy Shifts in the current text position along the y-axis for the characters within this element or any of its descendants.
          //use dy for text wrapping purpose
          .attr("dy", 0)
          .style("text-anchor", "end")
          .attr("transform", "translate(" + (textLength-2) + "," + gridSize/2 + ")")
          .attr("class","KPILabel axis-worktime");
    
    d3.selectAll(".KPILabel").call(wrap, textLength);

    var time;
    if(type == "Hourly") time = hours;
    else if (type == "Daily") time = days;
    else time = months;
    
    var timeLabels = svg.selectAll(".timeLabel")
        .data(time)
        .enter().append("text")
          .text(function(d) { return d; })
          .attr("x", function(d, i) { return i * gridSize + textLength ; })
          .attr("y", 0)
          .style("text-anchor", "middle")
          .attr("transform", "translate(" + gridSize / 2 + ",0)")
          .attr("class","timeLabel axis-worktime");
  }
}

function creat2DArray(n,m){
  var arr = new Array(n);
  for (var i = 0; i < n; i++) {
    arr[i] = new Array(m);
    for (var j = 0; j < m; j++) {
      arr[i][j] = 0;
    };
  }
  return arr;
}

function creatSVG(){
  var margin = { top: 10, right: 30, bottom: 50, left: 10 , gap:10};
  svg = d3.select("#chart"+window.currentID).append("svg")
        .attr("viewBox",'0,0,970,290')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

/*Create time granularity buttons*/
function creatRadioButtons(){
  var group = $('<div class="btn-group btn-group-xs pull-right" data-toggle="buttons" id="radiobox"></div>');
  var button1 = $('<label class="btn btn-default active">Hourly</label>');
  var input1 = $('<input type="radio" name="options" id="option1" checked>');
  var button2 = $('<label class="btn btn-default">Daily</label>');
  var input2 = $('<input type="radio" name="options" id="option2">');
  var input3 = $('<input type="radio" name="options" id="option3">');
  var button3 = $('<label class="btn btn-default">Monthly</label>');
  input1.appendTo(button1);
  button1.appendTo(group);
  input2.appendTo(button2);
  button2.appendTo(group);
  input3.appendTo(button3);
  button3.appendTo(group);
  group.appendTo("#chart"+window.currentID);
}
