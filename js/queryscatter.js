var scatterPlot = function() {
	var wordingHeight = 30;
	var scatterbrushing = {};
	var query_scatter_class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";

	function createQueryScatter(qcID, position, questionID) {
		var sID = panels.getSID();
		if (position != "aside") {
			var qID = $("#query-chart"+qcID+" .panel .question-selector").val();
			$("#query-chart"+qcID+" .chart-container").remove();

			$("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_scatter_class+'" qID1='+qID[0]+' qID2='+qID[1]+'></div>'));
			$("#query-chart"+qcID+" .chart-container").addClass("scatter");
			drawQueryScatter(qcID, qID, null, sID);
		}
		else {
			var qID = questionID;
			$("#query-chart"+qcID+" .scatterplot .scatter-xaxis").remove();
			$("#query-chart"+qcID+" .scatterplot .scatter-yaxis").remove();
			$("#query-chart"+qcID+" .scatterplot .scatter-point").remove();
			$("#query-chart"+qcID+" .scatterplot .xMark").remove();
			$("#query-chart"+qcID+" .scatterplot .yMark").remove();
			drawQueryScatter(qcID, qID, "aside", sID);
		}
		$("#query-chart"+qcID+" .chart-container").addClass("no-drag");
	}

	function drawQueryScatter(qcID, qID, position, sID) {
		// var marginLeft = 20;
		// var marginRight = 20;
		// var marginBottom = 20;
		// var marginTop = 5;
		var marginLeft = 0.1;
		var marginRight = 0.12;
		var marginBottom = 0.1;
		var marginTop = 0.1;
		var plotHeight = 300;
		var circleDiam = 6;
		var markNum = 6;

		if (position != "aside") {
			var currentContainer = $("#query-chart"+qcID+" .scatter");
			currentContainer.append(newScatterDOM(qcID,qID,plotHeight));

			for (var i=0; i<qID.length; i++){
				stackedBarchart.addQueryWording(qcID,sID,qID[i],$(currentContainer.find(".scatterwording")[i]));
			}
			currentContainer.find(".scatterwording text").css("cursor","default");

			var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
			var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
			$("#query-chart"+qcID).css("height",quest_height+con_height+20);
			$("#query-chart"+qcID+" .panel").css("height","100%");
		}
		else currentContainer = $("#query-chart"+qcID+" .correlation");

		var scatterSVG = currentContainer.find(".scatterplot");
		var SVGHeight = parseInt(scatterSVG.css("height"));
		var SVGWidth = parseInt(scatterSVG.css("width"));
		var scHeight = parseInt(scatterSVG.css("height")) * (1 - marginBottom - marginTop);
		var scWidth = parseInt(scatterSVG.css("width")) * (1 - marginLeft - marginRight);

		// scatterSVG.attr("onclick","clearBrushing(window.sID)");
		scatterSVG.attr("qcID",qcID).attr("qID1",qID[0]).attr("qID2",qID[1]).attr("cursor","default");
		scatterSVG[0].onselectstart = function(){return false;}

		d3.select(scatterSVG[0]).selectAll(".scatter-xaxis")
		.data([0])
		.enter()
		.append("line")
		.attr("class","scatter-xaxis")
		.attr("x1",SVGWidth * marginLeft)
		.attr("x2",SVGWidth * (1 - marginRight))
		.attr("y1",SVGHeight * (1 - marginBottom))
		.attr("y2",SVGHeight * (1 - marginBottom))
		.attr("stroke","black")
		.attr("stroke-width",1);

		d3.select(scatterSVG[0]).selectAll(".scatter-yaxis")
		.data([0])
		.enter()
		.append("line")
		.attr("class","scatter-yaxis")
		.attr("x1",SVGWidth * marginLeft)
		.attr("x2",SVGWidth * marginLeft)
		.attr("y1",SVGHeight * marginTop)
		.attr("y2",SVGHeight * (1 - marginBottom))
		.attr("stroke","black")
		.attr("stroke-width",1);

		var scatterData = new Array();
		var xMax = -Infinity;
		var xMin = Infinity;
		var yMax = -Infinity;
		var yMin = Infinity;

		for (var i=0; i<surveyDataTable[sID].length-2; i++) {
			scatterData[i] = {"y": (surveyDataTable[sID][i+2][qID[0]]), "x":(surveyDataTable[sID][i+2][qID[1]])};
			if (scatterData[i].x > xMax & scatterData[i].x != null & scatterData[i].x != undefined) xMax = scatterData[i].x;
			if (scatterData[i].x < xMin & scatterData[i].x != null & scatterData[i].x != undefined) xMin = scatterData[i].x;
			if (scatterData[i].y > yMax & scatterData[i].y != null & scatterData[i].y != undefined) yMax = scatterData[i].y;
			if (scatterData[i].y < yMin & scatterData[i].y != null & scatterData[i].x != undefined) yMin = scatterData[i].y;
		}
		xMax = Math.max.apply(null,surveyResponseAnswer[sID][qID[1]]);
		yMax = Math.max.apply(null,surveyResponseAnswer[sID][qID[0]]);
		// var xMin = Math.min.apply(null,surveyResponseAnswer[window.sID][qID[1]]);
		// var yMin = Math.min.apply(null,surveyResponseAnswer[window.sID][qID[0]]);
		console.log(xMax+" "+yMax+" "+xMin+" "+yMin)
		var xaxisMax = parseFloat(xMax) + (xMax - xMin) * 0.1;
		var xaxisMin = parseFloat(xMin) - (xMax - xMin) * 0.1;
		var yaxisMax = parseFloat(yMax) + (yMax - yMin) * 0.1;
		var yaxisMin = parseFloat(yMin) - (yMax - yMin) * 0.1;
		// var xaxisMax = xMax + (xMax - xMin) * 0.1;
		// var xaxisMin = xMin - (xMax - xMin) * 0.1;
		// var yaxisMax = yMax + (yMax - yMin) * 0.1;
		// var yaxisMin = yMin - (yMax - yMin) * 0.1;

		var xMark = new Array();
		var yMark = new Array();
		for (var i=0; i<markNum; i++) {
			xMark[i] = xMin + (xMax - xMin) / (markNum - 1) * i;
			yMark[i] = yMin + (yMax - yMin) / (markNum - 1) * i;
			xMark[i] = (xaxisMax - xaxisMin) > markNum ? Math.round(xMark[i]) : xMark[i];
			yMark[i] = (yaxisMax - yaxisMin) > markNum ? Math.round(yMark[i]) : yMark[i];
		}
		xMark[xMark.length] = qID[1];
		yMark[yMark.length] = qID[0];

		currentContainer.attr("xaxisMax",xaxisMax);
		currentContainer.attr("yaxisMax",yaxisMax);
		currentContainer.attr("xaxisMin",xaxisMin);
		currentContainer.attr("yaxisMin",yaxisMin);
		currentContainer.attr("marginLeft",marginLeft);
		currentContainer.attr("marginRight",marginRight);
		currentContainer.attr("marginTop",marginTop);
		currentContainer.attr("marginBottom",marginBottom);
		currentContainer.attr("markNum",markNum);

		d3.select(scatterSVG[0]).selectAll(".scatter-point")
		.data(scatterData)
		.enter()
		.append("circle")
		.attr("class","scatter-point")
		.attr("index",function(d,index) {
			return index+2;
		})
		.attr("cx",function(d){
			if (xaxisMax - xaxisMin == 0) return SVGWidth * marginLeft;
			else return SVGWidth * marginLeft + (d.x - xaxisMin) / (xaxisMax - xaxisMin) * scWidth;
		})
		.attr("cy",function(d){
			if (yaxisMax - yaxisMin == 0) return scHeight + SVGHeight * marginTop;
			else return scHeight - (d.y - yaxisMin) / (yaxisMax - yaxisMin) * scHeight + SVGHeight * marginTop;
		})
		.attr("r", function(d) {
			if (d.x != null & d.y != null) return circleDiam;
			else return 0;
		})
		.attr("stroke","black")
		.attr("stroke-width",1)
		.attr("fill","#333333")
		.attr("fill-opacity",0.5)
		// .attr("onclick",function(d){
		// 	return "brushAllCharts(window.sID,['"+qID[0]+"','"+qID[1]+"'],{'xlobound':"+d.x+",'xupbound:"+d.x+"','ylobound':"+d.y+",'yupbound':"+d.y+"},'0',this,'scatter')";
		// })
		.append("title").text(function(d){
			return qID[0]+"'s answer: "+d.y+"; "+qID[1]+"'s answer: "+d.x;
		});

		d3.select(scatterSVG[0]).selectAll(".yMark")
		.data(yMark)
		.enter()
		.append("text")
		.attr("class","yMark")
		.attr("text-anchor",function(d,i) {
			this.onselectstart = function(){return false;}
			if (i == markNum) return "start";
			else return "end";
		})
		.attr("x",function(d,i) {
			if (i == markNum) return SVGWidth * 0.01;
			else return marginLeft * SVGWidth * 0.95;
		})
		.attr("y",function(d,i){
			if (i == markNum){
				return marginTop * SVGHeight * 0.9;
			}
			else {
				return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * scHeight;
			}
		})
		.text(function(d){
			return d;
		})

		d3.select(scatterSVG[0]).selectAll(".xMark")
		.data(xMark)
		.enter()
		.append("text")
		.attr("class","xMark")
		.attr("text-anchor",function(d,i) {
			this.onselectstart = function(){return false;}
			if (i == markNum) return "start";
			else return "middle";
		})
		// .attr("transform",function(d,i){
		// 	if (i == markNum) return;
		// 	else return "rotate(-90)";
		// })
		// .attr("y",function(d,i) {
		// 	if (i == markNum) return (1 - marginBottom) * SVGHeight * 0.99;
		// 	else return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * scWidth;
		// })
		// .attr("x",function(d,i){
		// 	if (i == markNum){
		// 		return (1 - marginRight) * SVGWidth * 1.02;
		// 	}
		// 	else {
		// 		return (marginBottom - 1) * SVGHeight * 1.01;
		// 	}
		// })
		.attr("y",function(d,i) {
			if (i == markNum) return (1 - marginBottom) * SVGHeight * 0.99;
			else return (1 - marginBottom) * SVGHeight * 1.08;
				
		})
		.attr("x",function(d,i){
			if (i == markNum){
				return (1 - marginRight) * SVGWidth * 1.02;
			}
			else {
				return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * scWidth;
			}
		})
		.text(function(d){
			return d;
		})

		// d3.select(scatterSVG[0]).selectAll("text")
		// .attr("onselectstart","function(){return false;}")

		var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
		var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
		$("#query-chart"+qcID).css("height",quest_height+con_height+20);
		$("#query-chart"+qcID+" .panel").css("height","100%");

		scatterSVG.mousedown(function(event,id){
			console.log(event)
			scatterbrushing = null;
			// console.log($(event.target).offset().left);
			// console.log(event.button);
			// console.log(this);
			if (event.button == 0) {
				scatterbrushing = new Object();
				scatterbrushing.x1 = event.clientX - $(event.target).offset().left;
				scatterbrushing.y1 = event.clientY - $(event.target).offset().top;
				// scatterbrushing.x2 = event.clientX - $(event.target).offset().left;
				// scatterbrushing.y2 = event.clientY - $(event.target).offset().top;
				// scatterbrushing.x1 = event.clientX;
				// scatterbrushing.y1 = event.clientY;
				scatterbrushing.qcID = $(this).attr("qcID");
				d3.select(this).selectAll(".scatterselectbox")
				.data([0])
				.enter()
				.append("rect")
				.attr("class","scatterselectbox")
				.attr("fill","#222222")
				.attr("fill-opacity",0.1)
				//.attr("stroke","black")
			}
		})

		scatterSVG.mousemove(function(event){
			if (scatterbrushing instanceof Object) {
				if (scatterbrushing.qcID != $(this).attr("qcID")) return;

				scatterbrushing.x2 = event.clientX - $(event.target).offset().left;
				scatterbrushing.y2 = event.clientY - $(event.target).offset().top;
				// scatterbrushing.x2 = event.clientX;
				// scatterbrushing.y2 = event.clientY;
				//console.log(scatterbrushing.x1+" "+scatterbrushing.y1+" "+scatterbrushing.x2+" "+scatterbrushing.y2);
				//console.log(event.clientY+" "+$(event.target).offset().top)

				if (scatterbrushing.x2 > scatterbrushing.x1) {
					scatterbrushing.boxx1 = scatterbrushing.x1;
					scatterbrushing.boxwidth = scatterbrushing.x2 - scatterbrushing.x1;
				}
				else {
					scatterbrushing.boxx1 = scatterbrushing.x2;
					scatterbrushing.boxwidth = scatterbrushing.x1 - scatterbrushing.x2;
				}

				if (scatterbrushing.y2 > scatterbrushing.y1) {
					scatterbrushing.boxy1 = scatterbrushing.y1;
					scatterbrushing.boxheight = scatterbrushing.y2 - scatterbrushing.y1;
				}
				else {
					scatterbrushing.boxy1 = scatterbrushing.y2;
					scatterbrushing.boxheight = scatterbrushing.y1 - scatterbrushing.y2;
				}

				d3.select(this).selectAll(".scatterselectbox")
				.attr("x",scatterbrushing.boxx1)
				.attr("y",scatterbrushing.boxy1)
				.attr("width",scatterbrushing.boxwidth)
				.attr("height",scatterbrushing.boxheight);
			}
		})

		$(document.body).mouseup(function(event){
			//console.log(event.target)

			if (scatterbrushing instanceof Object) {
				//console.log(scatterbrushing)
				var currentQCID = scatterbrushing.qcID;
				var currentScatter = $("#query-chart"+currentQCID+" .scatterplot");
				var currentSelectBox = $(".scatterselectbox");
				currentSelectBox.attr("onclick","null");

				var coveredPoints = $("#query-chart"+currentQCID+" .scatter-point");
				var brushResponse = {"xlobound":Infinity, "xupbound":-Infinity, "ylobound":Infinity, "yupbound":-Infinity};

				for (var i=0; i < coveredPoints.length; i++){
					if (($(coveredPoints[i]).attr("cx") - scatterbrushing.x1) * ($(coveredPoints[i]).attr("cx") - scatterbrushing.x2) > 0) continue;
					if (($(coveredPoints[i]).attr("cy") - scatterbrushing.y1) * ($(coveredPoints[i]).attr("cy") - scatterbrushing.y2) > 0) continue;

					if (coveredPoints[i].__data__.x < brushResponse["xlobound"]) brushResponse["xlobound"] = parseFloat(coveredPoints[i].__data__.x);
					if (coveredPoints[i].__data__.x > brushResponse["xupbound"]) brushResponse["xupbound"] = parseFloat(coveredPoints[i].__data__.x);
					if (coveredPoints[i].__data__.y < brushResponse["ylobound"]) brushResponse["ylobound"] = parseFloat(coveredPoints[i].__data__.y);
					if (coveredPoints[i].__data__.y > brushResponse["yupbound"]) brushResponse["yupbound"] = parseFloat(coveredPoints[i].__data__.y);
				}

				console.log(brushResponse);
				if (scatterbrushing["x2"] == null | scatterbrushing["y2"] == null) {
				// if (brushResponse["xlobound"] == null | brushResponse["ylobound"] == null) {
					brushing.clearBrushing(window.sID);
				}
				else {
					//console.log("brush")
					brushing.brushAllCharts(window.sID,[currentScatter.attr("qID1"),currentScatter.attr("qID2")],brushResponse,"0",currentSelectBox,"scatter");
				}
				
				$(".scatterselectbox").remove();
				scatterbrushing = null;
			}
		})
	}

	function newScatterDOM(qcID, qID, plotHeight) {
		var currentContainer = $("#query-chart"+qcID+" .chart-container");
		currentContainer.css("height",plotHeight+wordingHeight*qID.length+"px");
		var DOMString = "<div class='col-lg-12' style='width:100%;height:"+(wordingHeight*qID.length)+"px'>"

		for (var i=0; i<qID.length; i++) {
			DOMString += "<div style='width:100%;height:"+wordingHeight+"px'>";
			DOMString += "<svg class='scatterwording' style='width:100%;height:100%'></svg></div>";
		}
		DOMString += "</div>";
		
		DOMString += "<div style='width:100%;height:"+plotHeight+"px'>";
		DOMString += "<svg class='scatterplot' style='width:100%;height:100%'></svg></div>";

		return $(DOMString);
	}

	return {
		createQueryScatter: 	createQueryScatter
	}
}();