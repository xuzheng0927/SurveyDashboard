bar_svg_height_ratio = 0.8;
bar_svg_width_ratio = 0.55;
bar_offset_ratio = 0.44;
text_offset_ratio = 0.005;
//fs_ratio = {"x":0.027,"y":0.247};
fs_ratio = {"x":0.05,"y":0.457};
text_cut_thres = 16;

function createBarChart(pID, qID, sID, RespType) {
	//var currentResponseList = surveyResponseAnswer[sID]["Q"+qID];
	console.log(pID+" "+sID+" "+qID);
	//qID = "Q"+qID

	var currentResponseList = surveyResponseAnswer[sID][qID];
	var currentSMPanel = $("#panel"+pID+"-sm"+qID);
	for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
		if (equalArrays(currentResponseList,surveyDistinctAnswer[sID][i])) {
			currentSMPanel.attr("daID",i);
		}
	}

	var barHeight = Math.floor(100/currentResponseList.length);
	var currentContainer = $("#panel"+pID+"-sm"+qID).find(".chart-container");
	var containerHeight = parseInt(currentContainer.css("height"));
	if (RespType != "Ranking Response") {
		var currentRespHistogram = getHistogramData(currentResponseList, qID, sID, RespType);

		if (RespType == "Numeric") {
			var numericResponseList = currentResponseList;
			currentResponseList = transformRespList(currentResponseList);
		}
		else {
			if ($("[daID='"+currentSMPanel.attr("daID")+"']").length == 1) {
				sortValues(currentResponseList, currentRespHistogram, "descending");
				surveyDistinctAnswer[sID][currentSMPanel.attr("daID")] = currentResponseList;
			}
			else {
				currentRespHistogram = syncList(currentResponseList, currentRespHistogram, surveyDistinctAnswer[sID][currentSMPanel.attr("daID")]);
				currentResponseList = surveyDistinctAnswer[sID][currentSMPanel.attr("daID")];
				//console.log(currentResponseList);
			}
		}
	}
	else {
		var currentRankData = getAverageRank(currentResponseList, qID, sID);
		sortValues(currentResponseList, currentRankData, "ascending");
	}
	
	var newResponseBar;
	var newRespBarWidth;
	var newRespBarHeight;
	var newSVGHeight;
	var newSVGWidth;
	//console.log(currentRankData);

	for (var i=0; i < currentResponseList.length; i++) {
		//newResponseBar = $('<div style="padding:2px; width:100%; height:'+barHeight+'%;"><svg style="margin:0px; height:100%; width:100% padding:0px"></svg></div>');
		newResponseBar = $('<div style="padding:0px; height:'+barHeight+'%;"><svg style="height:100%; width:100%; margin:0px; padding:0px;"></svg></div>');

		newResponseBar.appendTo(currentContainer);
		newResponseBar.css("cursor","move");
		newResponseBar.attr("datavalue",currentResponseList[i]);
		newResponseBar.attr("title",currentResponseList[i])
		newResponseBar.attr("sID",sID);

		newSVGHeight = parseInt(newResponseBar.find("svg").css("height"));
		newSVGWidth = parseInt(newResponseBar.find("svg").css("width"));
		
		d3.select(newResponseBar.find("svg")[0]).selectAll("text")
		.data([currentResponseList[i]])
		.enter()
		.append("text")
		//.attr("text-anchor","end")
		//.attr("x",newSVGWidth*0.29)
		//.attr("datavalue",currentResponseList[i])
		.attr("x",newSVGWidth*text_offset_ratio)
		.attr("y",newSVGHeight*0.5)
		//.attr("cursor","pointer")
		.attr("font-size",newSVGWidth*fs_ratio.x < newSVGHeight*fs_ratio.y ? newSVGWidth*fs_ratio.x : newSVGHeight*fs_ratio.y)
		.text(currentResponseList[i].length < text_cut_thres ? currentResponseList[i] : currentResponseList[i].substring(0,text_cut_thres-1)+"...")
		//.append("title").text(currentResponseList[i]);

		d3.select(newResponseBar.find("svg")[0]).selectAll(".totalRect")
		.data(RespType=="Ranking Response" ? [currentRankData[i]] : [currentRespHistogram[i]])
		.enter()
		.append("rect")
		.attr("class","totalRect")
		.attr("cursor","pointer")
		.attr("response",currentResponseList[i])
		.attr("upbound",RespType == "Numeric" ? numericResponseList[i] : null)
		.attr("lobound",function(d){
			if (RespType == "Numeric") {
				if (i == 0) return Number.NEGATIVE_INFINITY;
				else return numericResponseList[i-1];
			}
			else return null;
		})
		.attr("qID",qID)
		.attr("pID",pID)
		.attr("x",newSVGWidth*bar_offset_ratio)
		//.attr("x",0)
		//.attr("y",newSVGHeight*0.1)
		.attr("width",function(d){
			if (d == 0) return newSVGWidth * 0.01;
			else {
				if (RespType == "Ranking Response"){
					//console(d+" "+Math.max.apply(null,currentRankData));
					return newSVGWidth*d/Math.max.apply(null,currentRankData)*bar_svg_width_ratio;
				}
				else return newSVGWidth*d/Math.max.apply(null,currentRespHistogram)*bar_svg_width_ratio;
			}
		})
		.attr("height", newSVGHeight*bar_svg_height_ratio < containerHeight/5 ? newSVGHeight*bar_svg_height_ratio : containerHeight/5)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		})
		.attr("fill", function(d){
			if (d == 0) return "#FFFFFF";
			else return "#CCCCCC";
		})
		.attr("stroke","black")
		//.attr("onclick",'brushAllCharts('+sID+',"'+qID+'","'+currentResponseList[i]+'")')
		.attr("onclick",function(d){
			if (RespType == "Numeric") {
				return 'brushAllCharts('+pID+','+sID+',"'+qID+'",{"lobound":'+this.getAttribute("lobound")+',"upbound":'+this.getAttribute("upbound")+'});';
			}
			else return 'brushAllCharts('+pID+','+sID+',"'+qID+'","'+currentResponseList[i]+'")';
		})
		.append("title").text(function(d){
			if (RespType == "Ranking Response") {
				return "Average rank: "+currentRankData[i];
			}
			else return currentRespHistogram[i]+" response(s)";
		});

		d3.select(newResponseBar.find("svg")[0]).selectAll(".brushedRect")
		.data(RespType=="Ranking Response" ? currentRankData[i] : [currentRespHistogram[i]])
		.enter()
		.append("rect")
		.attr("class","brushedRect")
		.attr("cursor","pointer")
		.attr("brushed","false")
		.attr("x",newSVGWidth*bar_offset_ratio)
		.attr("width",0)
		.attr("height", newSVGHeight*bar_svg_height_ratio < containerHeight/5 ? newSVGHeight*bar_svg_height_ratio : containerHeight/5)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		})
		.attr("fill","#337CB7")
		.attr("stroke","black")
		.attr("onclick","clearBrushing("+sID+");")
		.append("title");

		newResponseBar.find("svg").attr("max",Math.max.apply(null,currentRespHistogram));
	}

	currentContainer.sortable({
		//items: "text",
		//cancel: "rect"
		start: function(event, ui) {
			ui.item.attr("oldIndex",ui.item.index());
		},
		stop: function(event, ui) {
			if (ui.item.attr("oldIndex") == ui.item.index()) return;
			thisSMPanel = $(this).parent().parent();
			if (thisSMPanel.hasClass("sm-barchart")) {
				syncBarOrder($(thisSMPanel).attr("pID"),$(thisSMPanel).attr("qID"),
					$(thisSMPanel).attr("sID"),$(thisSMPanel).attr("daID"), ui.item.attr("oldIndex"), ui.item.index(), ui.item.attr("datavalue"));
			}
		}
	});
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
	currentContainer.click(function(evt){
		if(evt.target.tagName == "svg") clearBrushing(sID);
	});

};

function getHistogramData(responseList, qID, sID, RespType) {
	var histogramData = new Array();
	if (RespType == "Response" | RespType == "Multiple Responses") {
		for (var i=0; i < responseList.length; i++) {
			histogramData[i] = 0;
			for (var j=2; j < surveyDataTable[sID].length; j++) {
				if (surveyDataTable[sID][j][qID] instanceof Array == true) {
					for (var r=0; r<surveyDataTable[sID][j][qID].length; r++){
						if (surveyDataTable[sID][j][qID][r] == responseList[i]) {
							histogramData[i] += 1;
						}
					}
				}
				else {
					if (surveyDataTable[sID][j][qID] == responseList[i]) {
						histogramData[i] += 1;
					}
				}
			}
		}
	}
	else {
		for (var i=0; i < responseList.length; i++) {
			histogramData[i] = 0;
			for (var j=2; j < surveyDataTable[sID].length; j++) {
				if (surveyDataTable[sID][j][qID] == null) continue;
				if (i == 0) {
					if (surveyDataTable[sID][j][qID] <= responseList[0]) histogramData[i] += 1;
				}
				else if (i == responseList.length - 1){
					if (surveyDataTable[sID][j][qID] > responseList[i-1]) histogramData[i] += 1;
				}
				else {
					if (surveyDataTable[sID][j][qID] > responseList[i-1] & surveyDataTable[sID][j][qID] <= responseList[i]) {
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
		if (i == 0) newList[i] = "<="+responseList[0];
		else if (i == responseList.length-1) newList[i] = ">"+responseList[i-1];
		else newList[i] = ">"+responseList[i-1]+" and <="+responseList[i];
	}
	return newList;
}

function getAverageRank(responseList, qID, sID) {
	var rankData = new Array();
	for (var i=0; i<responseList.length; i++) rankData[i] = 0;
	var respCount = 0;

	// for (var i=0; i<responseList.length; i++) {
	// 	rankData[i] = 0;
	// 	for (var j=2; j<surveyDataTable[sID].length; j++) {
	// 		if (!(surveyDataTable[sID][j][qID].length > 0)) continue;
	// 		//console.log(surveyDataTable[sID][j][qID]);

	// 		for (var r=0; r<surveyDataTable[sID][j][qID].length; r++) {
	// 			if (surveyDataTable[sID][j][qID][r] == responseList[i]) rankData[i] += (r+1);
	// 		}
	// 	}
	// }

	for (var i=2; i<surveyDataTable[sID].length; i++) {
		if (surveyDataTable[sID][i][qID] == null) continue;
		else respCount += 1;

		if (surveyDataTable[sID][i][qID] instanceof Array){
			for (var j=0; j<responseList.length; j++) {

				for (var r=0; r<surveyDataTable[sID][i][qID].length; r++) {
					if (responseList[j] == surveyDataTable[sID][i][qID][r]) rankData[j] += (r+1);
				}
			}
		}
		else {
			if (responseList[j] == surveyDataTable[sID][i][qID]) rankData[j] += 1;
		}
		
	}

	for (var i=0; i<responseList.length; i++) rankData[i] /= respCount;
	//console.log(rankData);
	return rankData;
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
	var containerHeight = parseInt($("#panel"+pID+"-sm"+qID+" .chart-container").css("width"));
	//console.log(newSVGHeight*0.7+" "+containerHeight/5);
	var maxValue = $("#panel"+pID+"-sm"+qID+" svg").attr("max");

	d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("text")
		//.transition()
		//.attr("x",newSVGWidth*0.29)
		.attr("x",newSVGWidth*text_offset_ratio)
		.attr("y",newSVGHeight*0.5)
		//.attr("cursor","pointer")
		//.attr("text-anchor","end")
		.attr("font-size",(newSVGWidth*fs_ratio.x < newSVGHeight*fs_ratio.y ? newSVGWidth*fs_ratio.x : newSVGHeight*fs_ratio.y))
		.text(function(){
			return $(this).parent().parent().attr("datavalue");
		});
	//$("#panel"+pID+"-sm"+qID+" div div div span").

	var max_text_width;
	var max_text_length;
	var allText = $("#panel"+pID+"-sm"+qID+" text");
	max_text_width = 0;
	for (var i=0; i<allText.length; i++) {
		if ($(allText[i]).width() > max_text_width) {
			max_text_width = $(allText[i]).width();
			max_text_length = $(allText[i]).text().length;
		}
	}
	//console.log(max_text_width+" "+newSVGWidth * bar_offset_ratio);
	if (max_text_width >= newSVGWidth * bar_offset_ratio) {
		var new_text_length_thres = max_text_length/max_text_width*newSVGWidth*bar_offset_ratio;
		//console.log(max_text_length+" "+new_text_length_thres);

		d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("text")
		//.transition()
		.text(function(d){
			return cutText($(this).parent().parent().attr("datavalue"),new_text_length_thres);
		})
		// .append("title").text(function(d){
		// 	return $(this).parent().parent().attr("datavalue");
		// });
	}

	//for (var i=0; i<allText.length; i++) $(allText[i]).append("<title>"+$(allText[i]).parent().parent().attr("datavalue")+"</title>");

	d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("rect")
		.transition()
		.attr("x",newSVGWidth*bar_offset_ratio)
		// .attr("y",newSVGHeight*0.1)
		.attr("width",function(d,i) {
			if (d == 0){
				if ($(this).attr("class") == "totalRect") return newSVGWidth*0.01;
				else return 0;
			}
			else{
				if ($(this).attr("brushed") == "false") return 0;
				else return newSVGWidth*d/maxValue*bar_svg_width_ratio;
			}
		})
		//.attr("height", newSVGHeight*0.70)
		.attr("height", newSVGHeight*bar_svg_height_ratio < containerHeight/5 ? newSVGHeight*bar_svg_height_ratio : containerHeight/5)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		});
		//.attr("fill", "#888888");

}

function sortValues(responseList,valueData,order) {
	var temp;
	//console.log(responseList+" "+histogramData);
	if (order == "descending") {
		for (var i=0; i <responseList.length-1 ; i++) {
			for (var j=i+1; j<responseList.length; j++) {
				if (valueData[j] > valueData[i]) {
					temp = responseList[i];
					responseList[i] = responseList[j];
					responseList[j] = temp;
					temp = valueData[i];
					valueData[i] = valueData[j];
					valueData[j] = temp;
				}
			}
		}
	}
	else {
		for (var i=0; i <responseList.length-1 ; i++) {
			for (var j=i+1; j<responseList.length; j++) {
				if (valueData[j] < valueData[i]) {
					temp = responseList[i];
					responseList[i] = responseList[j];
					responseList[j] = temp;
					temp = valueData[i];
					valueData[i] = valueData[j];
					valueData[j] = temp;
				}
			}
		}
	}
}

function syncList(responseList, valueData, listToSync) {
	var newValues = new Array();
	for (var i=0; i<listToSync.length; i++) {
		for (var j=0; j<responseList.length; j++) {
			if (listToSync[i] == responseList[j]) newValues[i] = valueData[j];
		}
	}
	return newValues;
}

function syncBarOrder(pID, qID, sID, daID, oldIndex, newIndex, datavalue){
	var allSMPanels = $("[daID='"+daID+"']");
	var movedBar = $("#panel"+pID+"-sm"+qID+" [datavalue='"+datavalue+"']");
	movedBar.removeAttr("datavalue");
	var allBars = $("[daID='"+daID+"'] [datavalue='"+datavalue+"'][sID="+sID+"]");
	var currentSMPanelText = $("#panel"+pID+"-sm"+qID+" text");
	var valueTemp, textTemp, barToMove;
	var maxIndex = $(allSMPanels[0]).find(".chart-container div").length-1

	// for (var i=0; i<allSMPanels.length; i++){
	// 	if ($(allSMPanels[i]).attr("pID") != parseInt(pID) | $(allSMPanels[i]).attr("qID") != qID) {
	// 		for (var j=0; j<currentSMPanelText.length; j++){
	// 			valueTemp = $(currentSMPanelText[j]).attr("datavalue");
	// 			textTemp = $(allSMPanels[i]).find("[datavalue='"+valueTemp+"']");
	// 			barTemp = $(textTemp[0]).parent().parent();
	// 			barTemp.hide();
	// 			barTemp.appendTo(barTemp.parent());
	// 			barTemp.fadeToggle("slow");
	// 		}
	// 	}
	// }

	// for (var i=0; i<allSMPanels.length; i++) {
	// 	if ($(allSMPanels[i]).attr("pID") == pID & $(allSMPanels[i]).attr("qID") == qID) continue;

	// 	barToMove = $($(allSMPanels[i]).find(".chart-container div")[oldIndex]);
	// 	//console.log(barToMove);
	// 	if (newIndex == 0) {

	// 		barToMove.hide();
	// 		barToMove.prependTo(barToMove.parent());
	// 		barToMove.slideDown("normal");
	// 	}
	// 	else if (newIndex == maxIndex) {
	// 		barToMove.hide();
	// 		barToMove.appendTo(barToMove.parent());
	// 		barToMove.slideDown("normal");
	// 	}
	// 	else {
	// 		if (newIndex < oldIndex) {
	// 			var upperSibling = $($(allSMPanels[i]).find(".chart-container div")[newIndex-1]);
	// 			barToMove.hide();
	// 			upperSibling.after(barToMove);
	// 			barToMove.slideDown("normal");
	// 		}
	// 		else {
	// 			var lowerSibling = $($(allSMPanels[i]).find(".chart-container div")[newIndex+1]);
	// 			barToMove.hide();
	// 			lowerSibling.before(barToMove);
	// 			barToMove.slideDown("normal");
	// 		}
	// 	}
	// }

	for (var i=0; i<allBars.length; i++) {
		if ($(allBars[i]).parent().parent().attr("pID") == pID & $(allBars[i]).parent().parent().attr("qID") == qID) {
			allBars.pop(i);
			break;
		}
	}
	console.log(allBars);
	allBars.hide("fast",function(){
		for (var i=0; i<allBars.length; i++) {
			if ($(allBars[i]).parent().parent().attr("pID") == pID & $(allBars[i]).parent().parent().attr("qID") == qID) continue;

			if (newIndex == 0) {
				//var parent = $(allBars[i]).parent();
				$(allBars[i]).prependTo($(allBars[i]).parent());
			}
			else if (newIndex == maxIndex) {
				$(allBars[i]).appendTo($(allBars[i]).parent());
			}
			else {
				if (newIndex < oldIndex) {
					var upperSibling = $($(allBars[i]).parent().children()[newIndex-1]);
					upperSibling.after($(allBars[i]));
				}
				else {
					var upperSibling = $($(allBars[i]).parent().children()[newIndex+1]);
					upperSibling.before($(allBars[i]));
				}
			}
		}
	});

	allBars.show("fast");

	movedBar.attr("datavalue",datavalue);
}

function cutText(textContent, threshold) {
	return textContent.length < threshold ? textContent : textContent.substring(0,threshold-1)+"...";
}