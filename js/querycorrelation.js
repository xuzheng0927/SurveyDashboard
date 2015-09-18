query_correlation_class = "col-lg-6 col-md-6 col-sm-6 col-xs-6";

function createQueryCorrelation(qcID) {
	$("#query-chart"+qcID+" .chart-container").remove();
	var sID = window.sID;
	var qID = $("#query-chart"+qcID+" .panel .question-selector").val();

	$("#query-chart"+qcID+" .panel").append($('<div class="chart-container correlation '+query_correlation_class+'" style="margin:0px;width:100%;height:100%"></div>'));
	drawCorrelationMatrix(qcID, qID);
}

function drawCorrelationMatrix(qcID, qID) {
	var chartHeight = 300;
	var correMatrix = getCorrelationMatrix(qID);
	var correMaxMin = getMaxMinCorrelation(correMatrix);
	var currentContainer = $("#query-chart"+qcID+" .correlation");
	currentContainer.attr("correMax",correMaxMin.max).attr("correMin",correMaxMin.min);

	currentContainer.append(newCorrelationDOM(qcID,qID,chartHeight));

	for (var i=0; i<qID.length; i++){
		addQueryWording(qcID,window.sID,qID[i],$(currentContainer.find(".correwording")[i]))
	}
	currentContainer.find(".correwording").css("cursor","default");

	//drawCorreMatrixGrid(qcID, qID);

	var currentCorrSVG = $("#query-chart"+qcID+" .correMatrix");
	var SVGHeight = parseInt(currentCorrSVG.css("height"));
	var SVGWidth = parseInt(currentCorrSVG.css("width"));
	var newGrid = new Array();
	var gridWidth = SVGWidth/(qID.length+1);
	var gridHeight = SVGHeight/(qID.length+1);

	for (var i1=0; i1<qID.length+1; i1++) {
		for (var i2=0; i2<qID.length+1; i2++) {
			newGrid[i1*(qID.length+1)+i2] = {"y":i1,"x":i2};

			if (i1>0 & i2>0) {
				newGrid[i1*(qID.length+1)+i2]["value"] = correMatrix[i1-1][i2-1];
				newGrid[i1*(qID.length+1)+i2]["qID1"] = qID[i1-1];
				newGrid[i1*(qID.length+1)+i2]["qID2"] = qID[i2-1];
			}
			else {
				newGrid[i1*(qID.length+1)+i2]["value"] = null;
				newGrid[i1*(qID.length+1)+i2]["qID1"] = null;
				newGrid[i1*(qID.length+1)+i2]["qID2"] = null;
			}
		}
	}

	d3.select(currentCorrSVG[0]).selectAll(".correGrid")
	.data(newGrid)
	.enter()
	.append("rect")
	.attr("class","correGrid")
	.attr("x",function(d){
		return d.x * gridWidth;
	})
	.attr("y",function(d){
		return d.y * gridHeight;
	})
	.attr("width", gridWidth - 1)
	.attr("height", gridHeight)
	.attr("fill", function(d) {
		if (d.value == null) return "white";
		else return correlationColor(d.value,correMaxMin);
	})
	.attr("stroke","black")
	.attr("stroke-width",1)
	.append("title").text(function(d){
		if (d.value == null) return null;
		else return "Correlation value: "+d.value;
	})

	currentContainer.find(".correGrid").click(function() {
		$(this).parent().find(".correGrid").attr("stroke-width",1).attr("stroke","black").attr("stroke-opacity",1);
		$(this).attr("stroke-width",3).attr("stroke","red").attr("stroke-opacity",0.5);
		createQueryScatter(qcID,"aside",[this.__data__["qID1"],this.__data__["qID2"]]);
	})

	d3.select(currentCorrSVG[0]).selectAll(".correMatrixWording")
	.data(qID.concat(qID))
	.enter()
	.append("text")
	.attr("class","correMatrixWording")
	.attr("x", function(d,i) {
		if (i < qID.length) return (i+1+0.1)*gridWidth;
		else return 0.1*gridWidth;
	})
	.attr("y", function(d,i) {
		if (i < qID.length) return 0.5*gridHeight;
		else return (i+1-qID.length+0.5)*gridHeight;
	})
	.text(function(d) { return d});

	var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
	var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
	$("#query-chart"+qcID).css("height",quest_height+con_height+20);
	$("#query-chart"+qcID+" .panel").css("height","100%");

	var maxCorrelation = -Infinity;
	var scatterqID = new Array();
	for (var i1=0; i1<correMatrix.length; i1++) {
		for (var i2=0; i2<correMatrix[0].length; i2++) {
			if (i1 != i2 & correMatrix[i1][i2] > maxCorrelation) {
				scatterqID[0] = qID[i1];
				scatterqID[1] = qID[i2];
				maxCorrelation = correMatrix[i1][i2];
			}
		}
	}

	//createQueryScatter(qcID,"aside",[qID[0],qID[1]]);
	createQueryScatter(qcID,"aside",scatterqID);
}

function getCorrelationMatrix(qID) {
	var dataArrays = new Array();
	var correMatrix = new Array();
	var validFlag;
	for (var i=0; i<qID.length; i++) {
		dataArrays[i] = new Array();
		correMatrix[i] = new Array();
	}
	var sumXY, sumX, sumY, sumX2, sumY2, n;

	for (var i=2; i<surveyDataTable[window.sID].length; i++) {
		validFlag = true;
		for (var j=0; j<qID.length; j++) {
			if (surveyDataTable[window.sID][i][qID[j]] == null) validFlag = false;
		}
		if (validFlag == true) {
			for (var j=0; j<qID.length; j++) {
				dataArrays[j][dataArrays[j].length] = surveyDataTable[window.sID][i][qID[j]];
			}
		}
	}

	n = dataArrays[0].length;
	for (var i1=0; i1<qID.length; i1++) {
		for (var i2=0; i2<qID.length; i2++) {
			if (i1 == i2) correMatrix[i1][i2] = 1;
			else {
				sumX = 0;
				sumY = 0;
				sumXY = 0;
				sumX2 = 0;
				sumY2 = 0;
				for (var j=0; j<dataArrays[0].length; j++) {
					sumX += dataArrays[i1][j];
					sumY += dataArrays[i2][j];
					sumXY += dataArrays[i1][j]*dataArrays[i2][j];
					sumX2 += dataArrays[i1][j]*dataArrays[i1][j];
					sumY2 += dataArrays[i2][j]*dataArrays[i2][j];
				}
				//console.log(sumX+" "+sumY+" "+sumXY+" "+sumX2+" "+sumY2);
				correMatrix[i1][i2] = (n * sumXY - sumX * sumY) / Math.sqrt(n * sumX2 - sumX * sumX) / Math.sqrt(n * sumY2 - sumY * sumY);
			}
		}
	}

	return correMatrix;
}

// function drawCorreMatrixGrid (qcID, qID) {
// 	var currentCorrSVG = $("#query-chart"+qcID+" .correMatrix");
// 	var SVGHeight = parseInt(currentCorrSVG.css("height"));
// 	var SVGWidth = parseInt(currentCorrSVG.css("width"));
// 	var newGrid = new Array();
// 	var gridWidth = SVGWidth/qID.length;
// 	var gridHeight = SVGHeight/qID.length;

// 	for (var i1=0; i1<qID.length+1; i1++) {
// 		for (var i2=0; i2<qID.length+1; i2++) {
// 			newGrid[i1*qID.length+i2] = {"x":i1,"y":i2};
// 		}
// 	}
// 	d3.select(currentCorrSVG[0]).selectAll(".correGrid")
// 	.data(newGrid)
// 	.enter()
// 	.append("rect")
// 	.attr("class","correGrid")
// 	.attr("x",function(d){
// 		return d.x * gridWidth;
// 	})
// 	.attr("y",function(d){
// 		return d.y * gridHeight;
// 	})
// 	.attr("width", gridWidth)
// 	.attr("height", gridHeight)
// 	.attr("fill", "white")
// 	.attr("stroke","black")
// 	.attr("stroke-width",1);
// }

function drawCorreMatrixWording (qcID, qID) {
	var currentCorrSVG = $("#query-chart"+qcID+" .correMatrix");

}

function newCorrelationDOM(qcID, qID, chartHeight) {
	var currentContainer = $("#query-chart"+qcID+" .chart-container");
	currentContainer.css("height",chartHeight+wordingHeight*qID.length+"px");
	var DOMString = "<div class='col-lg-12' style='width:100%;height:"+(wordingHeight*qID.length)+"px'>"

	for (var i=0; i<qID.length; i++) {
		DOMString += "<div style='width:100%;height:"+wordingHeight+"px'>";
		DOMString += "<svg class='correwording' style='width:100%;height:100%'></svg></div>";
	}
	DOMString += "</div>";

	DOMString += "<div style='width:50%;height:"+chartHeight+"px;float:left'>";
	DOMString += "<svg class='correMatrix' style='width:100%;height:100%'></svg></div>";
	
	DOMString += "<div style='width:50%;height:"+chartHeight+"px;float:left'>";
	DOMString += "<svg class='scatterplot' style='width:100%;height:100%'></svg></div>";

	return $(DOMString);
}

function getMaxMinCorrelation(correMatrix) {
	var maxCorrelation = -Infinity;
	var minCorrelation = Infinity;

	for (var i=0; i<correMatrix.length; i++) {
		if (Math.max.apply(null, correMatrix[i]) > maxCorrelation) maxCorrelation = Math.max.apply(null, correMatrix[i]);
		if (Math.min.apply(null, correMatrix[i]) > minCorrelation) minCorrelation = Math.min.apply(null, correMatrix[i]);
	}

	return {"max":maxCorrelation,"min":minCorrelation};
}

function correlationColor(value, correMaxMin) {
	var normValue = 255-(value+1)/2*255;
	return d3.rgb(normValue,normValue,normValue);
}