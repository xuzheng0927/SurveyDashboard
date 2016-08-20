/**
 * @fileoverview This is the code for creating Correlation Matrix and scatterplot
 * Call creatCorrelationMatrix(fTable,KPISelections) to creat Correlation Matrix
 * @author liuchenyi77@gmail.com (Chenyi Liu)
 */

/**
* @para {Array} table The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
*/
function creatCorrelationMatrix(table,KPISettings){
	// get the correlation value based on Pearson's correlation coefficient fomular
  var pccData = PearsonCorrelationCoefficients(table,KPISettings);
	// color the cells based on correlation matrix pccData
	// -1 red negtive correlation
	// 0 no correlation
	// 1 postive correaltion
  var pccValueDomain = [-1, 0, 1];
  var colors = ["#4575b4", "#ffffbf","#d73027"];
	var colorScale = d3.scale.linear()
    .domain(pccValueDomain)
    .range(colors);

  var svg = d3.select("#chart"+window.currentID).append("svg")
      // .attr("width", width + margin.left + margin.right + barmax )
      // .attr("height", height + margin.top + margin.bottom + barmax +margin.bottom)
      .attr("viewBox",'0,0,500,150')
      .append("g")
      .attr("class","cells");

  var margin = { top: 50, right: 30, bottom: 50, left: 30 , gap:6},
  width = 100,
  height = 100,
  maxKPINum =6,
  gridSize = Math.floor(width/ (maxKPINum+1)),
  legendElementWidth = gridSize*2;
  var xTranlation =  gridSize*5+margin.gap;
  //select the default scatterplot - the one with the highest correlation value
  var maxPccValue = pccData[0].value,
      maxPccX = pccData[0].x,
      maxPccY = pccData[0].y;
  //find the KPI pair with the higheset correlation value
  for (var i = 0; i < pccData.length; i++) {
    var v = Math.abs(pccData[i].value);
    if(v>maxPccValue){
      maxPccValue = v;
      maxPccX = pccData[i].x;
      maxPccY = pccData[i].y;
    }
  }
  //visualize the correlation matrix, display the default scatterplot, the one with the highest correlation value
  var heatMap = svg.selectAll(".cells")
      .data(pccData)
      .enter().append("rect")
      .attr("rx", 2)
      .attr("ry", 2)
      .attr("class", function(d){
        if(d.y == maxPccY && d.x == maxPccX){
          createScatterPlot(d.y,d.x,KPISettings,table);
          return "selected";
        }
        else
          return "bordered";})
      .attr("width", gridSize)
      .attr("height", gridSize)
      .style("fill",function(d) { return colorScale(d.value);})
      .attr("x", function(d) { return d.y * gridSize + xTranlation; })
      .attr("y", function(d) { return (d.x - 1) * gridSize; })
      .on("click", function(d) {
  			//highlight the selected cell
  			d3.selectAll(".cells rect")
  				.attr("class","bordered");
  			d3.select(this)
  				.attr("class","selected");
            //create correspondant scatterplot
  			createScatterPlot(d.y,d.x,KPISettings,table);
  		});
  //tilt x axis lables if it is too long
	var xLables = svg.selectAll(".xLabel")
		.append("g")
      .data(KPISettings)
      .enter().append("text")
      .text(function (d,i) { if(i != KPISettings.length-1) return d; })
      .attr("x", function (d,i) { return i * gridSize + xTranlation; })
      .attr("y", gridSize*(KPISettings.length-1)+margin.gap)
      .attr("transform", function(d,i) {
          return "rotate(45 "+(i * gridSize + xTranlation)+","+(gridSize*(KPISettings.length-1)+margin.gap)+")";
      })
      .attr("class","mono")
      .style("text-anchor", "start");

  var yLables = svg.selectAll(".yLabel")
		.append("g")
      .data(KPISettings)
      .enter().append("text")
      .text(function (d,i) { if(i != 0) return d; })
      .attr("y", function (d,i) { return i * gridSize - margin.gap; })
      .attr("x", xTranlation)
      .attr("class","mono")
      .style("text-anchor", "end");
  
  // create the lengend
  var legend = svg.selectAll(".legend")
      .data(pccValueDomain);
      legend.enter().append("g")
          .attr("class", "legend");

      legend.append("rect")
          .attr("class","bordered")
          .attr("x", 0)
          .attr("y", function(d, i) { return height+i*gridSize/2; })
          .attr("width", legendElementWidth)
          .attr("height", gridSize / 2)
          .style("fill", function(d, i) { return colors[i]; });
      legend.append("text")
          .attr("class", "mono")
          .style("text-anchor", "top")
          .text(function(d) { if(d == -1)
                                  return "negtive correlation";
                              else if (d == 1)
                                  return "positive correlation";
                              else
                                  return "no correlation"})
          .attr("x", legendElementWidth+margin.gap)
          .attr("y", function(d, i) { return height+i*gridSize/2+margin.gap; });
}

// remove the previous scatterplot before updating it.
function removeScatterplot(){
	 $('#chart'+window.currentID+' #onlyScatterplot').remove();
}
/** The method draws a scatterplot of KPI pair - (KPISettings[xIndex],KPISettings[yIndex])
* @para {num} xIndex The index of the KPI on x axis in KPISettings list
* @para {num} yIndex The index of the KPI on y axis in KPISettings list
* @para {Array} table The filtered flat table, each line is a testing case
* @para {Array} KPISettings a list of KPI names
*/
function createScatterPlot(xIndex,yIndex,KPISettings,table){
	removeScatterplot();
	var svg = d3.select("#chart"+window.currentID).select("svg")
		.append("g")
		.attr("transform", "translate(200,10)")
		.attr("id","onlyScatterplot");

    var width = 170;
    var height = 120;
 
    var colors = d3.scale.category20();

    // this sets the scale that we're using for the X axis. 
    var x = d3.scale.linear()
        .domain(d3.extent(table, function (d) {
        return d[KPISettings[xIndex]];}))
        .range([0, width]);

    var y = d3.scale.linear()
        .domain(d3.extent(table, function (d) {
        return d[KPISettings[yIndex]];
    }))
    .range([height, 0]);

    //handle the axis
    svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + y.range()[0] + ")");
    svg.append("g").attr("class", "y axis");

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickPadding(2);
    var yAxis = d3.svg.axis().scale(y).orient("left").tickPadding(2);

    svg.selectAll("g.y.axis")
        .attr("class","axisc")
        .call(yAxis)
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "translate(5,-5)")
        .text(KPISettings[yIndex]);
    svg.selectAll("g.x.axis")
        .attr("class","axisc")
        .call(xAxis)
        .append("text")
        .attr("text-anchor", "end")
        .attr("transform", "translate(170,-5)")
        .text(KPISettings[yIndex]);

    svg.selectAll(".dot")
    	.data(table)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr('transform', function (d) {
            return "translate(" + x(d[KPISettings[xIndex]]) + "," + y(d[KPISettings[yIndex]]) + ")";
        })
        .attr("r", 2)
        .style("fill", function (d) {
            return colors(d["assetName"]);
        });

    // draw legend of videos(assets)
      var legend = svg.selectAll(".legend")
          .data(colors.domain())
          .enter().append("g")
          // if only need static videos
          // .filter(function(d){ if (d!="Nasa") 
          //                         return d;
          //                     })
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(10," + (i * 5)+ ")"; });

      // draw legend colored circles
      legend.append("circle")
          .attr("r",1.5)
          .style("fill", colors)
          .attr("cy",function(d,i) { return i*5;})
          .attr("cx",190);

      // draw legend text
      legend.append("text")
            . attr("class","mono")
          .attr("x", 190+5)
          .attr("y", function(d, i) { return (i*5+2) ;})
          .style("font-size","4pt")
          .text(function(d) { return d;});
}

/**
* @para {Array} table The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
* @return {Array} a list of matrix object that contains the correlation matrix values.
* matrix object:
	 x - x index in matrix
	 y - y index in matrix
	 value - float - the pearson correlation coefficient value of KPISettings[x] and KPISettings[y]
*/
function PearsonCorrelationCoefficients(table,KPISettings){
	var pccMatrix =[]
	for (var i = 0; i < KPISettings.length; i++) {
		for (var j = 0; j <i+1 ; j++) {
			//do not compare one KPI with itself
			if(i == j){
				continue;
			}
			var sigmaX = sum(table.map(function (d){ return d[KPISettings[i]];})),
				sigmaY = sum(table.map(function (d){ return d[KPISettings[j]];})),
				sigmaX2 = sum(table.map(function (d){ return d[KPISettings[i]]*d[KPISettings[i]];})),
				sigmaY2 = sum(table.map(function (d){ return d[KPISettings[j]]*d[KPISettings[j]];})),
				sigmaXY = sum(table.map(function (d){ return d[KPISettings[i]]*d[KPISettings[j]];}));
			var n = table.length;
			var numerator = n*sigmaXY - sigmaX * sigmaY,
				denominator = Math.sqrt((n * sigmaX2 - sigmaX * sigmaX) * (n * sigmaY2 - sigmaY *sigmaY));
			var value=0;
			if(denominator!=0){
				value = numerator/denominator;
			}

			var object = {};
			object.x = i;
			object.y = j;
			object.value = value;
			pccMatrix.push(object);
		};
	};
	return pccMatrix
}
//@para {Array} array A list of numbers
function sum(array){
	var sum = 0;
	for (var i = array.length - 1; i >= 0; i--) {
		sum+=array[i];
	}
	return sum;
}