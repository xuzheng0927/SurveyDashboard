function createBarChart(pID, qID, sID, RespType) {
	//var currentResponseList = surveyResponseAnswer[sID]["Q"+qID];
	//console.log(sID+" "+qID);
	var currentResponseList = surveyResponseAnswer[sID][qID];
	var barHeight = Math.floor(100/currentResponseList.length);
	var currentContainer = $("#panel"+pID+"-sm"+qID).find(".chart-container");
	var containerHeight = parseInt(currentContainer.css("height"));
	var currentRespHistogram = getHistogramData(currentResponseList, qID, sID, RespType);
	if (RespType == "Numeric") currentResponseList = transformRespList(currentResponseList);
	var newResponseBar;
	var newRespBarWidth;
	var newRespBarHeight;
	var newSVGHeight;
	var newSVGWidth;
	//console.log(currentContainer);

	for (var i=0; i < currentResponseList.length; i++) {
		//newResponseBar = $('<div style="padding:2px; width:100%; height:'+barHeight+'%;"><svg style="margin:0px; height:100%; width:100% padding:0px"></svg></div>');
		newResponseBar = $('<div style="padding:0px; height:'+barHeight+'%;"><svg style="height:100%; width:100%; margin:0px; padding:0px;"></svg></div>');
		// newResponseBar.prepend('<div class="col-lg-4" style="width:36%;height:100%;padding-top:2%;padding-left:1%"><span class="label label-default"></span></div>');
		// newResponseBar.find("span").attr("style","font-size:70%;color:black;background-color:white;border-style:solid;border-width:1px;border-color:black;font-weight:normal")
		// newResponseBar.find("span").text(currentResponseList[i]);
		//newResponseBar.attr("title",currentRespHistogram[i]);
		newResponseBar.appendTo(currentContainer);
		newResponseBar.css("cursor","move");
		//newRespBarWidth = parseInt(newResponseBar.css("width"));
		//newRespBarHeight = parseInt(newResponseBar.css("height"));
		newSVGHeight = parseInt(newResponseBar.find("svg").css("height"));
		newSVGWidth = parseInt(newResponseBar.find("svg").css("width"));
		//newResponseBar.find("svg").attr("viewbox","0,0,"+newSVGWidth+","+newSVGHeight);
		//newResponseBar.find("svg").attr("preserveAspectRatio","xMidYMid slice");
		
		d3.select(newResponseBar.find("svg")[0]).selectAll("text")
		.data([currentResponseList[i]])
		.enter()
		.append("text")
		//.attr("text-anchor","end")
		//.attr("x",newSVGWidth*0.29)
		.attr("x",newSVGWidth*0.02)
		.attr("y",newSVGHeight*0.5)
		//.attr("cursor","pointer")
		.attr("font-size",newSVGWidth*0.027 < newSVGHeight*0.247 ? newSVGWidth*0.027 : newSVGHeight*0.247)
		.text(currentResponseList[i].length < 20 ? currentResponseList[i] : currentResponseList[i].substring(0,20)+"...")
		.append("title").text(currentResponseList[i]);

		d3.select(newResponseBar.find("svg")[0]).selectAll("rect")
		.data([currentRespHistogram[i]])
		.enter()
		.append("rect")
		.attr("x",newSVGWidth*0.3)
		//.attr("x",0)
		//.attr("y",newSVGHeight*0.1)
		.attr("width",newSVGWidth*currentRespHistogram[i]/Math.max.apply(null,currentRespHistogram)*0.65)
		.attr("height", newSVGHeight*0.70 < containerHeight/4 ? newSVGHeight*0.70 : containerHeight/4)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		})
		.attr("fill", "#888888")
		.attr("stroke","black")
		.append("title").text(currentRespHistogram[i]+" response(s)");

		newResponseBar.find("svg").attr("max",Math.max.apply(null,currentRespHistogram));
	}

	currentContainer.sortable();
	/*d3.select(currentSVG[0]).selectAll("text")
	.data(currentResponseList)
	.enter()
	.append("text")
	.attr("x",10)
	.attr("y",function(d,i) {
		return i*15;
	})
	.text(function(d,i) {
		return d;
	})*/
};

function getHistogramData(responseList, qID, sID, RespType) {
	var histogramData = new Array();
	if (RespType == "Response") {
		for (var i=0; i < responseList.length; i++) {
			histogramData[i] = 0;
			for (var j=2; j < surveyDataTable[sID].length; j++) {
				if (surveyDataTable[sID][j][qID] == responseList[i]) {
					histogramData[i] += 1;
				}
			}
		}
	}
	else {
		for (var i=0; i < responseList.length; i++) {
			histogramData[i] = 0;
			for (var j=2; j < surveyDataTable[sID].length; j++) {
				if (i == 0) {
					if (surveyDataTable[sID][j][qID] < responseList[0]) histogramData[i] += 1;
				}
				else {
					if (surveyDataTable[sID][j][qID] >= responseList[i-1] & surveyDataTable[sID][j][qID] < responseList[i]) {
						histogramData[i] += 1;
					}
				}
			}
		}
		//console.log(histogramData);
	}
	return histogramData;
}

function transformRespList(responseList) {
	var newList = new Array();
	for (var i=0; i<responseList.length; i++) {
		if ((responseList[i]+"").length > 6) {
			responseList[i] = (responseList[i]+"").substring(0,6);
			//responseList[i] = Math.floor(responseList[i] * 100000) / 100000;
		}
		if (i == 0) newList[i] = "less than "+responseList[0];
		else if (i == responseList.length-1) newList[i] = "more than "+responseList[i-1];
		else newList[i] = "between "+responseList[i-1]+" and "+responseList[i];
	}
	return newList;
}

function resizeRect(pID, qID) {
	// var currentRects = $("#panel"+pID+"-sm"+qID+" rect");
	// var newHeightRatio = (parseInt(size["height"])-69) / (parseInt(originalSize["height"])-69);
	// var newWidthRatio =  (parseInt(size["width"])-17) / (parseInt(originalSize["width"])-17);
	// console.log(newHeightRatio+" "+newWidthRatio);
	// var oldHeight, oldWidth, oldX, oldY;
	// for (var i=0; i<currentRects.length; i++) {
	// 	oldHeight = $(currentRects[i]).attr("height");
	// 	oldWidth = $(currentRects[i]).attr("width");
	// 	oldX = $(currentRects[i]).attr("x");
	// 	oldY = $(currentRects[i]).attr("y");
	// 	$(currentRects[i]).attr("height",oldHeight*newHeightRatio).attr("width",oldWidth*newWidthRatio);
	// 	$(currentRects[i]).attr("y",oldY*newHeightRatio).attr("x",oldX*newWidthRatio);
	// }

	//var currentResponseList = surveyResponseAnswer[sID]["Q"+qID];
	//var currentRespHistogram = getHistogramData(currentResponseList, qID, sID);
	var newSVGHeight = parseInt($("#panel"+pID+"-sm"+qID+" svg").first().css("height"));
	var newSVGWidth = parseInt($("#panel"+pID+"-sm"+qID+" svg").first().css("width"));
	var maxValue = $("#panel"+pID+"-sm"+qID+" svg").attr("max");

	d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("text")
		.transition()
		.attr("x",newSVGWidth*0.29)
		.attr("y",newSVGHeight*0.5)
		//.attr("cursor","pointer")
		//.attr("text-anchor","end")
		.attr("font-size",(newSVGWidth*0.027 < newSVGHeight*0.247 ? newSVGWidth*0.027 : newSVGHeight*0.247));
		//.text(currentResponseList[i]);
	//$("#panel"+pID+"-sm"+qID+" div div div span").

	d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("rect")
		.transition()
		.attr("x",newSVGWidth*0.3)
		.attr("y",newSVGHeight*0.1)
		.attr("width",function(d,i) {
			return newSVGWidth*d/maxValue*0.65;
		})
		.attr("height", newSVGHeight*0.70)
		.attr("fill", "#888888");
}