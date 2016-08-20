// query_chart_class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

// function createQueryBarchart(qcID) {
// 	$("#query-chart"+qcID+" .panel .chart-container").remove();
// 	//console.log($("#query-chart"+qcID+" .chart-container"));
// 	var sID = panels.getSID();
// 	var qID = $("#query-chart"+qcID+" .question-selector").val();

// 	if (qID.length == 1) {
// 		var RespType = surveyDataTable[sID][1][qID[0]];

// 		if (RespType != "Open-Ended Response") {
// 			$("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_chart_class+'" style="margin:0px;margin-bottom:20px" qID='+qID+'></div>'));
// 			if (surveyDataTable[sID][1][qID[0]] == "Numeric") {
// 				$("#query-chart"+qcID+" .chart-container").addClass("histogram");
// 				createQueryHistogram(qcID, qID[0]);
// 			}
// 			else if (surveyDataTable[sID][1][qID[0]] == "Ranking Response") {
// 				$("#query-chart"+qcID+" .chart-container").addClass("barchart-rank");
// 				createBarChart(qcID,qID,sID,RespType,"query");
// 			}
// 			else {
// 				$("#query-chart"+qcID+" .chart-container").addClass("barchart");
// 				createBarChart(qcID,qID,sID,RespType,"query");	
// 			}
			
// 			//console.log($("#query-chart"+qcID+" .chart-container"));
// 			// $("#query-chart"+qcID+" .chart-container").resize(function(){
// 			// 	console.log("resized");
// 			// 	resizeRect(qcID,qID,"query");
// 			// })
// 			var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
// 			var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
// 			$("#query-chart"+qcID).css("height",quest_height+con_height+20);
// 			$("#query-chart"+qcID+" .panel").css("height","100%");
// 		}
// 		else createQueryEmpty(qcID);

// 		// if (RespType != "Open-Ended Response") {
// 		// 	$("#query-chart"+qcID).append(newSmallMultiplePanelDOM(qcID,qID,"col-lg-6"));
// 		// 	createBarChart(qcID,qID,sID,RespType,"query");
// 		// }
// 	}
// }

// function createQueryHistogram(qcID,qID) {
// 	//$("#query-chart"+qcID+" .chart-container").remove();
// 	var sID = window.sID;

// 	// $("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_heatmap_class+'" style="margin:0px;width:100%;height:100%" qID="'+qID+'"></div>'));
// 	// $("#query-chart"+qcID+" .chart-container").addClass("histogram");
// 	if (qcID == 0) var currentContainer = $("#panel0-sm"+qID+" .chart-container");
// 	else var currentContainer = $("#query-chart"+qcID+" .chart-container");
// 	currentContainer.append($("<svg class='histChart' style='width:100%;height:100%'></svg>"));
// 	drawQueryHistogram(qcID, qID);
// 	if (qcID == 0) adjustSMPanelSize(qID);

// 	currentContainer.click(function(evt){
// 		if(evt.target.tagName == "svg") clearBrushing(sID);
// 	});
// }

// function drawQueryHistogram(qcID, qID) {
// 	var sID = panels.getSID();
// 	var marginLeft = 0.1;
// 	var marginRight = 0.12;
// 	var marginBottom = 0.1;
// 	var marginTop = 0.1;
// 	var plotHeight = qcID == 0 ? 150 : 300;
// 	var circleDiam = 6;
// 	var markNum = 6;

// 	if (qcID == 0) var currentChart = "#panel0-sm"+qID;
// 	else currentChart = "#query-chart"+qcID;

// 	// var currentContainer = $("#query-chart"+qcID+" .chart-container");
// 	// currentContainer.css("height",plotHeight);
// 	// currentHistChart = $("#query-chart"+qcID+" .histChart");
// 	// currentResponses = surveyResponseAnswer[window.sID][qID];

// 	// var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
// 	// var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
// 	// $("#query-chart"+qcID).css("height",quest_height+con_height+20);
// 	// $("#query-chart"+qcID+" .panel").css("height","100%");

// 	var currentContainer = $(currentChart+" .chart-container");
// 	currentContainer.css("height",plotHeight);
// 	currentHistChart = $(currentChart+" .histChart");
// 	currentResponses = surveyResponseAnswer[sID][qID];

// 	var con_height = parseInt($(currentChart+" .chart-container").css("height"));
// 	if (qcID == 0) {
// 		var header_height = parseInt(currentContainer.parent().find(".panel-heading"));
// 	}
// 	else {
// 		var quest_height = parseInt($(currentChart+" .question-area").css("height"));
// 		$("#query-chart"+qcID).css("height",quest_height+con_height+20);
// 		$("#query-chart"+qcID+" .panel").css("height","100%");
// 	}

// 	var SVGHeight = parseInt(currentContainer.css("height"));
// 	var SVGWidth = parseInt(currentContainer.css("width"));
// 	var histHeight = parseInt(currentContainer.css("height")) * (1 - marginBottom - marginTop);
// 	var histWidth = parseInt(currentContainer.css("width")) * (1 - marginLeft - marginRight);

// 	d3.select(currentHistChart[0]).selectAll(".scatter-xaxis")
// 	.data([0])
// 	.enter()
// 	.append("line")
// 	.attr("class","scatter-xaxis")
// 	.attr("x1",SVGWidth * marginLeft)
// 	.attr("x2",SVGWidth * (1 - marginRight))
// 	.attr("y1",SVGHeight * (1 - marginBottom))
// 	.attr("y2",SVGHeight * (1 - marginBottom))
// 	.attr("stroke","black")
// 	.attr("stroke-width",1);

// 	d3.select(currentHistChart[0]).selectAll(".scatter-yaxis")
// 	.data([0])
// 	.enter()
// 	.append("line")
// 	.attr("class","scatter-yaxis")
// 	.attr("x1",SVGWidth * marginLeft)
// 	.attr("x2",SVGWidth * marginLeft)
// 	.attr("y1",SVGHeight * marginTop)
// 	.attr("y2",SVGHeight * (1 - marginBottom))
// 	.attr("stroke","black")
// 	.attr("stroke-width",1);

// 	var histogramData = barchart.getHistogramData(currentResponses, qID, sID, "Numeric");

// 	var xMax = Math.max.apply(null,currentResponses);
// 	var xMin = Infinity;
// 	for (var i=0; i<surveyDataTable[sID].length-2; i++) {
// 		if (surveyDataTable[sID][i+2][qID] < xMin & surveyDataTable[sID][i+2][qID] != null) xMin = surveyDataTable[sID][i+2][qID];
// 	}
// 	//xMin = getClosetMin(xMin,xMax);
// 	xMin = Math.min.apply(null,currentResponses) + currentResponses[0] - currentResponses[1];

// 	var yMax = Math.max.apply(null,histogramData);
// 	var yMin = Math.min.apply(null,histogramData);

// 	var histRectData = new Array();
// 	for (var i=0; i<histogramData.length; i++) {
// 		histRectData[i] = new Object();
// 		histRectData[i]["value"] = histogramData[i];
// 		if (i == 0) histRectData[i]["min"] = xMin;
// 		// else histRectData[i]["min"] = Math.round(currentResponses[i-1]);
// 		else histRectData[i]["min"] = parseFloat(currentResponses[i-1]);
// 		//histRectData[i]["max"] = Math.round(currentResponses[i]);
// 		histRectData[i]["max"] = parseFloat(currentResponses[i]);
// 	}

// 	var xaxisMax = xMax + (xMax - xMin) * 0.1;
// 	var xaxisMin = xMin - (xMax - xMin) * 0.1;
// 	var yaxisMax = yMax + (yMax - yMin) * 0.1;
// 	var yaxisMin = 0;

// 	var xMark = [xMin].concat(currentResponses);
// 	var yMark = new Array();
// 	for (var i=0; i<markNum; i++) {
// 		yMark[i] = yMin + (yMax - yMin) / (markNum - 1) * i;
// 		yMark[i] = Math.round(yMark[i]);
// 	}
// 	xMark[xMark.length] = qID;
// 	yMark[yMark.length] = "Number of responses";

// 	currentContainer.attr("xaxisMax",xaxisMax);
// 	currentContainer.attr("yaxisMax",yaxisMax);
// 	currentContainer.attr("xaxisMin",xaxisMin);
// 	currentContainer.attr("yaxisMin",yaxisMin);
// 	currentContainer.attr("marginLeft",marginLeft);
// 	currentContainer.attr("marginRight",marginRight);
// 	currentContainer.attr("marginTop",marginTop);
// 	currentContainer.attr("marginBottom",marginBottom);
// 	currentContainer.attr("markNum",markNum);

// 	d3.select(currentHistChart[0]).selectAll(".totalHistRect")
// 	.data(histRectData)
// 	.enter()
// 	.append("rect")
// 	.attr("class","totalHistRect")
// 	.attr("cursor","pointer")
// 	.attr("qID",qID)
// 	.attr("upbound",function(d){
// 		return d.max;
// 	})
// 	.attr("lobound",function(d,index){
// 		if (index == 0) return -Infinity;
// 		else return d.min;
// 	})
// 	.attr("x",function(d) {
// 		return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
// 	})
// 	.attr("y", function(d) {
// 		return SVGHeight * (1 - marginBottom) - (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
// 	})
// 	.attr("width", function(d) {
// 		//console.log(d.max+" "+d.min);
// 		return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
// 	})
// 	.attr("height", function(d) {
// 		return (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
// 	})
// 	.attr("fill", "#CCCCCC")
// 	.attr("stroke","black")
// 	.attr("stroke-width",1)
// 	.attr("onclick",function(d){
// 		return 'brushAllCharts('+sID+',["'+qID+'"],{"lobound":'+this.getAttribute("lobound")+',"upbound":'+this.getAttribute("upbound")+'},0,this,"histogram");';
// 	})
// 	.append("title").text(function(d) {
// 		return (">"+d.min + " and <=" + d.max + ": "+ d.value + " response(s)");
// 	});

// 	d3.select(currentHistChart[0]).selectAll(".brushedHistRect")
// 	.data(histRectData)
// 	.enter()
// 	.append("rect")
// 	.attr("class","brushedHistRect")
// 	.attr("cursor","pointer")
// 	.attr("upbound",function(d){
// 		return d.max;
// 	})
// 	.attr("lobound",function(d,index){
// 		if (index == 0) return -Infinity;
// 		else return d.min;
// 	})
// 	.attr("x",function(d) {
// 		return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
// 	})
// 	.attr("y", function(d) {
// 		return SVGHeight * (1 - marginBottom);
// 	})
// 	.attr("width", function(d) {
// 		return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
// 	})
// 	.attr("height", 0)
// 	.attr("fill", "#337CB7")
// 	.attr("stroke","black")
// 	.attr("stroke-width",1)
// 	.attr("onclick","clearBrushing(" + sID + ");")
// 	//.attr("onclick","clearBrushing("+sID+");")
// 	.append("title");

// 	d3.select(currentHistChart[0]).selectAll(".yMark")
// 	.data(yMark)
// 	.enter()
// 	.append("text")
// 	.attr("class","yMark")
// 	.attr("text-anchor",function(d,i) {
// 		if (i == markNum) return "middle";
// 		else return "end";
// 	})
// 	.attr("transform",function(d,i){
// 		if (i != markNum) return;
// 		else return "rotate(-90)";
// 	})
// 	.attr("font-size",function(d,i) {
// 		if (qcID != 0) return 15;
// 		else {
// 			if (i == 0 | i == yMark.length - 2) return 8;
// 			else return 0;
// 		}
// 	})
// 	.attr("y",function(d,i) {
// 		if (i == markNum) return SVGWidth * 0.03;
// 		else return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
// 	})
// 	.attr("x",function(d,i){
// 		if (i == markNum){
// 			//return (marginBottom - 1) * SVGHeight;
// 			return  SVGHeight * (-0.5);
// 		}
// 		else {
// 			return marginLeft * SVGWidth * 0.95;;
// 		}
// 	})
// 	// .attr("x",function(d,i) {
// 	// 	if (i == markNum) return SVGWidth * 0.01;
// 	// 	else return marginLeft * SVGWidth * 0.95;
// 	// })
// 	// .attr("y",function(d,i){
// 	// 	if (i == markNum){
// 	// 		return marginTop * SVGHeight * 0.9;
// 	// 	}
// 	// 	else {
// 	// 		return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
// 	// 	}
// 	// })
// 	.text(function(d){
// 		return d;
// 	})

// 	d3.select(currentHistChart[0]).selectAll(".xMark")
// 	.data(xMark)
// 	.enter()
// 	.append("text")
// 	.attr("class","xMark")
// 	.attr("text-anchor",function(d,i) {
// 		if (i == (xMark.length - 1)) return "start";
// 		else return "middle";
// 	})
// 	.attr("font-size",function(d,i) {
// 		if (qcID != 0) return 15;
// 		else {
// 			if (i == 0 | i == xMark.length - 2) return 8;
// 			else return 0;
// 		}
// 	})
// 	.attr("y",function(d,i) {
// 		if (i == (xMark.length - 1)) return (1 - marginBottom) * SVGHeight * 0.99;
// 		else return (1 - marginBottom) * SVGHeight * 1.08;
			
// 	})
// 	.attr("x",function(d,i){
// 		if (i == (xMark.length - 1)){
// 			return (1 - marginRight) * SVGWidth * 1.02;
// 		}
// 		else {
// 			return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
// 		}
// 	})
// 	.text(function(d,i){
// 		if (i == (xMark.length - 1)) return d;
// 		else return parseInt(d);
// 	})
// }
