bar_svg_height_ratio = 0.8;
bar_svg_width_ratio = 0.55;
bar_offset_ratio = 0.44;
text_offset_ratio = 0.005;
//fs_ratio = {"x":0.027,"y":0.247};
fs_ratio = {"x":0.05,"y":0.6};
text_cut_thres = 16;
default_bar_height = 25;

function createBarChart(pID, qID, sID, RespType, ChartType) {
	//var currentResponseList = surveyResponseAnswer[sID]["Q"+qID];
	//console.log(sID+" "+qID);

	var currentResponseList = surveyResponseAnswer[sID][qID];
	var barHeight = Math.floor(100/currentResponseList.length);
	//var currentSMPanel = $("#panel"+pID+"-sm"+qID);
	if (ChartType == "query") {
		var currentContainer = $("#query-chart"+pID+" .chart-container");
		currentContainer.css("height",default_bar_height*currentResponseList.length);
	}
	else {
		var currentSMPanel = $(".sm-panel[qID='"+qID+"']");
		// for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
		// 	if (equalArrays(currentResponseList,surveyDistinctAnswer[sID][i])) {
		// 		currentSMPanel.attr("daID",i);
		// 	}
		// }
		var currentContainer = $("#panel"+pID+"-sm"+qID).find(".chart-container");
		currentContainer.css("height",default_bar_height*currentResponseList.length);

		// for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
		// 	if (equalArrays(currentResponseList,surveyDistinctAnswer[sID][i])) {
		// 		currentContainer.attr("daID",i);
		// 	}
		// }

		adjustSMPanelSize(qID);
	}

	for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
		if (equalArrays(currentResponseList,surveyDistinctAnswer[sID][i])) {
			currentContainer.attr("daID",i);
		}
	}
	// var containerHeight = parseInt(currentContainer.css("height"));
	

	if (RespType != "Ranking Response") {
		var currentRespHistogram = getHistogramData(currentResponseList, qID, sID, RespType);

		if (RespType == "Numeric") {
			var numericResponseList = currentResponseList;
			currentResponseList = transformRespList(currentResponseList);
		}
		else if (ChartType != "query"){
			if ($("[daID='"+currentSMPanel.attr("daID")+"']").length == 1) {
				sortValues(currentResponseList, currentRespHistogram, "descending");
				surveyDistinctAnswer[sID][currentSMPanel.attr("daID")] = currentResponseList;
			}
			else {
				//currentRespHistogram = syncList(currentResponseList, currentRespHistogram, surveyDistinctAnswer[sID][currentSMPanel.attr("daID")]);
				//currentResponseList = surveyDistinctAnswer[sID][currentSMPanel.attr("daID")];
				currentRespHistogram = syncList(currentResponseList, currentRespHistogram, surveyDistinctAnswer[sID][currentContainer.attr("daID")]);
				currentResponseList = surveyDistinctAnswer[sID][currentContainer.attr("daID")];
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
		.attr("y",newSVGHeight*0.7)
		//.attr("cursor","pointer")
		//.attr("font-size",newSVGHeight*fs_ratio.y)
		.attr("font-size",15)
		.text(currentResponseList[i])
		.text(function(d){
			var currentTextWidth = $(this).width();
			if (currentTextWidth >= newSVGWidth*(bar_offset_ratio-text_offset_ratio)) {
				return cutText(d,d.length*newSVGWidth*(bar_offset_ratio-text_offset_ratio)/currentTextWidth-1);
			}
			else return d;
		});
		//.append("title").text(currentResponseList[i]);

		d3.select(newResponseBar.find("svg")[0]).selectAll(".totalRect")
		.data(RespType=="Ranking Response" ? [currentRankData[i]] : [currentRespHistogram[i]])
		.enter()
		.append("rect")
		.attr("class","totalRect")
		.attr("cursor","pointer")
		.attr("response",currentResponseList[i])
		.attr("upbound",RespType == "Numeric" ? Math.round(numericResponseList[i]) : null)
		.attr("lobound",function(d){
			if (RespType == "Numeric") {
				if (i == 0) return Number.NEGATIVE_INFINITY;
				else return Math.round(numericResponseList[i-1]);
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
		// .attr("height", newSVGHeight*bar_svg_height_ratio < containerHeight/5 ? newSVGHeight*bar_svg_height_ratio : containerHeight/5)
		.attr("height", newSVGHeight*bar_svg_height_ratio)
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
				return 'brushAllCharts('+sID+',["'+qID+'"],{"lobound":'+this.getAttribute("lobound")+',"upbound":'+this.getAttribute("upbound")+'},0,this);';
			}
			else if (RespType != "Ranking Response") return 'brushAllCharts('+sID+',["'+qID+'"],"'+currentResponseList[i]+'",0,this);';
			else return 'brushAllCharts('+sID+',["'+qID+'"],"'+currentResponseList[i]+'",0,this,"ranking");';
		})
		.append("title").text(function(d){
			if (RespType == "Ranking Response") {
				return "Average rank: "+currentRankData[i];
			}
			else return currentRespHistogram[i]+" response(s)";
		});

		d3.select(newResponseBar.find("svg")[0]).selectAll(".brushedRect")
		//.data(RespType=="Ranking Response" ? [0] : [currentRespHistogram[i]])
		.data([0])
		.enter()
		.append("rect")
		.attr("class","brushedRect")
		.attr("response",currentResponseList[i])
		.attr("rank",RespType=="Ranking Response" ? [currentRankData[i]] : null)
		.attr("cursor","pointer")
		.attr("brushed","false")
		.attr("x",newSVGWidth*bar_offset_ratio)
		.attr("width",0)
		// .attr("height", newSVGHeight*bar_svg_height_ratio < containerHeight/5 ? newSVGHeight*bar_svg_height_ratio : containerHeight/5)
		.attr("height", newSVGHeight*bar_svg_height_ratio)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		})
		.attr("fill","#337CB7")
		.attr("stroke","black")
		.attr("onclick","clearBrushing("+sID+");")
		.append("title");

		newResponseBar.find("svg").attr("max",RespType == "Ranking Response" ? Math.max.apply(null,currentRankData) : Math.max.apply(null,currentRespHistogram));
	}

	currentContainer.sortable({
		//items: "text",
		//cancel: "rect"
		//helper: 'original',
		containment: 'parent',
		start: function(event, ui) {
			ui.item.attr("oldIndex",ui.item.index());
			//console.log(ui.item.parent());
		},
		stop: function(event, ui) {
			if (ui.item.attr("oldIndex") == ui.item.index()) return;
			//thisSMPanel = $(this).parent().parent();
			//if (thisSMPanel.hasClass("sm-barchart")) {
				//syncBarOrder($(thisSMPanel).attr("pID"),$(thisSMPanel).attr("qID"),
				//	$(thisSMPanel).attr("sID"),$(thisSMPanel).attr("daID"), ui.item.attr("oldIndex"), ui.item.index(), ui.item.attr("datavalue"));
				syncRespOrder(ui.item);
			//}
			var allMatchedChart = $("#query-area .stacked [daID='"+$(this).attr("daID")+"']");
			//console.log(allMatchedChart);
			for (var i=0; i<allMatchedChart.length; i++) {
				syncStackedBars($(allMatchedChart[i]).children().attr("qcID"));
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

function resizeRect(pID, qID, ChartType) {
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
	if (ChartType == "query") var find_in_tab = "#query-area [qcID="+pID+"]";
	else var find_in_tab = "#overview-area [qID="+qID+"]";
	//console.log(find_in_tab+pID+"][qID='"+qID+"'] svg")

	var newSVGHeight = parseInt($(find_in_tab+" svg").first().css("height"));
	var newSVGWidth = parseInt($(find_in_tab+" svg").first().css("width"));
	var containerHeight = parseInt($(find_in_tab+" .chart-container").css("width"));
	var maxValue = $(find_in_tab+" svg").attr("max");


	d3.select($(find_in_tab)[0]).selectAll("text")
		//.transition()
		//.attr("x",newSVGWidth*0.29)
		.attr("x",newSVGWidth*text_offset_ratio)
		.attr("y",newSVGHeight*0.7)
		//.attr("cursor","pointer")
		//.attr("text-anchor","end")
		//.attr("font-size",newSVGHeight*fs_ratio.y)
		.attr("font-size",15)
		.text(function(d){
			return d;
		})
		.text(function(d){
			var currentTextWidth = $(this).width();
			if (currentTextWidth >= newSVGWidth*(bar_offset_ratio-text_offset_ratio)) {
				return cutText(d,d.length*newSVGWidth*(bar_offset_ratio-text_offset_ratio)/currentTextWidth-1);
			}
			else return d;
		});

	//$("#panel"+pID+"-sm"+qID+" div div div span").

	// var max_text_width;
	// var max_text_length;
	// var allText = $("#panel"+pID+"-sm"+qID+" text");
	// max_text_width = 0;
	// for (var i=0; i<allText.length; i++) {
	// 	if ($(allText[i]).width() > max_text_width) {
	// 		max_text_width = $(allText[i]).width();
	// 		max_text_length = $(allText[i]).text().length;
	// 	}
	// }
	// //console.log(max_text_width+" "+newSVGWidth * bar_offset_ratio);
	// if (max_text_width >= newSVGWidth * bar_offset_ratio) {
	// 	var new_text_length_thres = max_text_length/max_text_width*newSVGWidth*bar_offset_ratio;
	// 	//console.log(max_text_length+" "+new_text_length_thres);

	// 	d3.select($("#panel"+pID+"-sm"+qID)[0]).selectAll("text")
	// 	//.transition()
	// 	.text(function(d){
	// 		return cutText($(this).parent().parent().attr("datavalue"),new_text_length_thres);
	// 	})
	// 	// .append("title").text(function(d){
	// 	// 	return $(this).parent().parent().attr("datavalue");
	// 	// });
	// }

	//for (var i=0; i<allText.length; i++) $(allText[i]).append("<title>"+$(allText[i]).parent().parent().attr("datavalue")+"</title>");

	d3.select($(find_in_tab)[0]).selectAll("rect")
		//.transition()
		.attr("x",newSVGWidth*bar_offset_ratio)
		// .attr("y",newSVGHeight*0.1)
		.attr("width",function(d,i) {
			//console.log(d);
			if (d == 0){
				if ($(this).attr("class") == "totalRect") return newSVGWidth*0.01;
				else return 0;
			}
			else{
				if (ChartType == "query") {
					//console.log(newSVGWidth+" "+d+" "+maxValue+" "+bar_svg_width_ratio);
					if ($(this).attr("class") == "totalRect") {
						//console.log(this);
						//return newSVGWidth*d/maxValue*bar_svg_width_ratio;
						return parseInt($(this).parent().css("width"))*d/maxValue*bar_svg_width_ratio;
					}
					//else return 0;
					else {
						return parseInt($(this).parent().css("width"))*d/maxValue*bar_svg_width_ratio;
					}
				}
				else {
					if ($(this).attr("brushed") == "false") return 0;
					else return newSVGWidth*d/maxValue*bar_svg_width_ratio;
				}
			}
		})
		// .attr("width",function(d){
		// 	if (d == 0) return newSVGWidth * 0.01;
		// 	else {
		// 		if (RespType == "Ranking Response"){
		// 			//console(d+" "+Math.max.apply(null,currentRankData));
		// 			return newSVGWidth*d/Math.max.apply(null,currentRankData)*bar_svg_width_ratio;
		// 		}
		// 		else return newSVGWidth*d/Math.max.apply(null,currentRespHistogram)*bar_svg_width_ratio;
		// 	}
		// })
		//.attr("height", newSVGHeight*0.70)
		.attr("height", newSVGHeight*bar_svg_height_ratio)
		.attr("y",function(d){
			return (newSVGHeight - $(this).attr("height")) / 2;
		});
		return
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

function syncRespOrder(movedItem, ChartType) {
	var sID = window.sID;
	var daID = movedItem.parent().attr("daID");
	var oldIndex = movedItem.attr("oldIndex");
	var newIndex = movedItem.index();
	var datavalue = movedItem.attr("datavalue");
	//console.log(movedItem);

	var allMatchedCharts = $("[daID='"+daID+"']");
	//var movedItem = (ChartType == "query" ? $("#query-chart"+pID+" [daID='"daID+"'] [datavalue='"+datavalue+"']") : $("#panel"+pID+"-sm"+qID+" [datavalue='"+datavalue+"']");
	movedItem.removeAttr("datavalue");
	var allMatchedItems = $("[daID='"+daID+"'] [datavalue='"+datavalue+"']");
	var maxIndex = $(allMatchedCharts[0]).children().length;

	for (var i=0; i<allMatchedItems.length; i++) {
		if (allMatchedItems[i] == movedItem[0]) {
			allMatchedItems.pop(i);
			break;
		}
	}
	//console.log(allMatchedItems);

	// if (movedItem.parent().hasClass("heatmap-q2-col")) {
	// 	var qcID = movedItem.attr("qcID");
	// 	var qID1 = $("#query-chart"+qcID+" .heatmap").attr("qID1");
	// 	var qID2 = $("#query-chart"+qcID+" .heatmap").attr("qID2");
	// 	appendCellsToQ2(qcID, qID1, qID2);
	// }

	allMatchedItems.hide("fast",function(){
		for (var i=0; i<allMatchedItems.length; i++) {
			//if ($(allBars[i]).parent().parent().attr("pID") == pID & $(allBars[i]).parent().parent().attr("qID") == qID) continue;
			if ($(allMatchedItems[i]).parent().hasClass("heatmap-q2-col")) {
				//console.log("append to q2");
				var qcID = $(allMatchedItems[i]).attr("qcID");
				var qID1 = $("#query-chart"+qcID+" .heatmap").attr("qID1");
				var qID2 = $("#query-chart"+qcID+" .heatmap").attr("qID2");
				appendCellsToQ2(qcID, qID1, qID2);
			}

			if (newIndex == 0) {
				//var parent = $(allBars[i]).parent();
				$(allMatchedItems[i]).prependTo($(allMatchedItems[i]).parent());
			}
			else if (newIndex == maxIndex) {
				$(allMatchedItems[i]).appendTo($(allMatchedItems[i]).parent());
			}
			else {
				if (newIndex < oldIndex) {
					var upperSibling = $($(allMatchedItems[i]).parent().children()[newIndex-1]);
					upperSibling.after($(allMatchedItems[i]));
				}
				else {
					var lowerSibling = $($(allMatchedItems[i]).parent().children()[newIndex+1]);
					lowerSibling.before($(allMatchedItems[i]));
				}
			}

			if ($(allMatchedItems[i]).parent().hasClass("resp-group")) {
				//console.log($(allMatchedItems[i]).attr("qcID"));
				syncStackedBars($(allMatchedItems[i]).attr("qcID"));
			}

			if ($(allMatchedItems[i]).parent().hasClass("heatmap-q2-col")) {
				//console.log("append to q1")
				appendCellsToQ1(qcID, qID1, qID2);
				$(allMatchedItems[i]).parent().find("svg").css("width","100%");
			}
		}
		//console.log(oldIndex);
		//updateDistinctAnswer(daID, oldIndex, newIndex, maxIndex);
		allMatchedItems.show("fast");
	});

	//allMatchedItems.show("fast");

	// if (movedItem.parent().hasClass("heatmap-q2-col")) appendCellsToQ1(qcID, qID1, qID2);

	movedItem.attr("datavalue",datavalue);
	//console.log(oldIndex);
	updateDistinctAnswer(daID, movedItem.attr("oldIndex"), newIndex, maxIndex);
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
	//console.log(allBars);
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

	updateDistinctAnswer(daID, oldIndex, newIndex, maxIndex);
}

function cutText(textContent, threshold) {
	return textContent.length < threshold ? textContent : textContent.substring(0,threshold-2)+"...";
}

function updateDistinctAnswer(daID, oldIndex, newIndex, maxIndex) {
	var currentDAs = surveyDistinctAnswer[window.sID][daID];
	var	newDAs = new Array();
	newDAs[newIndex] = currentDAs[oldIndex];

	for (var i=0; i<currentDAs.length; i++) {
		if (i == newIndex) continue;
		if (newIndex < oldIndex) {
			if (i < newIndex) newDAs[i] = currentDAs[i];
			else if (i <= oldIndex) newDAs[i] = currentDAs[i-1];
			else newDAs[i] = currentDAs[i];
		}
		else {
			if (i > newIndex) newDAs[i] = currentDAs[i];
			else if (i >= oldIndex) newDAs[i] = currentDAs[i+1];
			else newDAs[i] = currentDAs[i];
		}
	}

	//console.log(newDAs);

	surveyDistinctAnswer[window.sID][daID] = newDAs;

	for (q in surveyResponseAnswer[window.sID]) {
		if (equalArrays(surveyResponseAnswer[window.sID][q], newDAs)) {
			surveyResponseAnswer[window.sID][q] = newDAs;
		}
	}
}