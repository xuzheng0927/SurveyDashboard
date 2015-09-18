query_stacked_class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
stacked_q_wording_h = 30;

function createQueryStacked(qcID) {
	$("#query-chart"+qcID+" .chart-container").remove();
	var sID = window.sID;
	var qID = $("#query-chart"+qcID+" .question-selector").val();

	if (qID.length > 1) {
		var matched = true;
		for (var i = 0; i < qID.length - 1; i++) {
			if (!equalArrays(surveyResponseAnswer[sID][qID[i]],surveyResponseAnswer[sID][qID[i+1]])) {
				matched = false;
				break;
			}
		}

		if (matched == true) {
			$("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_stacked_class+'" style="margin:0px;width:100%;height:100%"></div>'));
			drawQueryStacked(qcID, qID);
			$("#query-chart"+qcID+" .chart-container").addClass("stacked");
		}
		else createQueryEmpty(qcID);
	}
}

function drawQueryStacked(qcID, qID) {
	var currentContainer = $("#query-chart"+qcID+" .chart-container");
	var daID;
	currentContainer.append(newStackedDOM(qcID,window.sID,qID));
	for (var i=0; i<surveyDistinctAnswer[window.sID].length; i++) {
		if (equalArrays(surveyDistinctAnswer[window.sID][i], surveyResponseAnswer[window.sID][qID[0]])) {
			currentContainer.find(".resp-group").attr("daID",i);
			daID = i;
		}
	}

	var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
	var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
	$("#query-chart"+qcID).css("height",quest_height+con_height+20);
	$("#query-chart"+qcID+" .panel").css("height","100%");

	var questWordingSVG = currentContainer.find(".stacked_q_wording");
	var stackedDIV = currentContainer.find(".stacked_DIV");
	var respHistogram,respList;

	respList = surveyDistinctAnswer[window.sID][daID];
	for (var i=0; i<qID.length; i++) {
		addQueryWording(qcID, window.sID, qID[i], $(questWordingSVG[i]));
		respHistogram = getHistogramData(respList, qID[i], window.sID, surveyDataTable[window.sID][1][qID[i]]);
		//respList = surveyResponseAnswer[sID][qID[0]];
		//console.log(respHistogram)
		//console.log(respList)
		drawStackedBars(qcID,qID[i],$(stackedDIV[i]),respHistogram,respList);
	}

	drawStackedLegend(qcID,daID);

	$("#query-chart"+qcID+" .stacked_quest").sortable({
		containment: 'parent',
		//cancel: '.heatmapCell',
		axis: 'y',
		start: function(event,ui){
			var cell_width = parseInt(ui.item.siblings().css("width"));
			var cell_height = parseInt($(this).css("height"))/ui.item.siblings().length;
			ui.item.css("width",cell_width);
			ui.item.css("height",cell_height);
			$(".ui-sortable-placeholder").css("width",cell_width);
			$(".ui-sortable-placeholder").css("height",cell_height);
		}
	});

	$("#query-chart"+qcID+" .resp-group").sortable({
		containment: 'parent',
		//cancel: '.heatmapCell',
		axis: 'y',
		start: function(event,ui){
			//console.log(ui.item.parent().css("height"));
			var cell_width = parseInt(ui.item.siblings().css("width"));
			var cell_height = parseInt($(this).css("height"))/ui.item.siblings().length;
			ui.item.css("width",cell_width);
			ui.item.css("height",cell_height);
			$(".ui-sortable-placeholder").css("width",cell_width);
			$(".ui-sortable-placeholder").css("height",cell_height);

			ui.item.attr("oldIndex",ui.item.index());

			//console.log($($(this).sortable('option', 'containment')).css("height"));
		},
		stop: function(event,ui) {
			if (ui.item.attr("oldIndex") == ui.item.index()) return;
			syncRespOrder(ui.item);

			var allMatchedChart = $("#query-area .stacked [daID='"+daID+"']");
			//console.log(allMatchedChart);
			for (var i=0; i<allMatchedChart.length; i++) {
				syncStackedBars($(allMatchedChart[i]).children().attr("qcID"));
			}
			//syncStackedBars(qcID);
		}
	});

	currentContainer.click(function(evt){
		console.log(evt.target.tagName == "DIV")
		if(evt.target.tagName == "DIV" | evt.target.tagName == "svg") clearBrushing(window.sID);
	});
}

function newStackedDOM(qcID, sID, qID) {
	var currentContainer = $("#query-chart"+qcID+" .chart-container");
	//var currentConWidth = parseInt(currentContainer.css("width"));
	var questNum = qID.length;
	var respNum = surveyResponseAnswer[sID][qID[0]].length;
	var currentResp = surveyResponseAnswer[sID][qID[0]];
	currentContainer.css("height",cell_height*(questNum+respNum));

	var DOMString ='<div style="width:100%;height:'+questNum/(questNum+respNum)*100+'%;float:left" class="stacked_quest">';
	//DOMString += '<div style="width:50%;height:'+questNum/(questNum+respNum)*100+'%;float:left">';
	for (var i=0; i<qID.length; i++) {
		DOMString += '<div style="width:100%;height:'+(100/qID.length)+'%">';
		DOMString += '<svg style="width:30%;height:100%;float:left;margin:0px" class="stacked_q_wording"></svg>';
		DOMString += '<div style="width:70%;height:100%;float:left;margin:0px;padding:0px" class="stacked_DIV">';
		for (var j=0; j<currentResp.length; j++) {
			DOMString += '<div style="width:'+(100/currentResp.length)+'%;height:100%;float:left;margin:0px;padding:0px">';
			DOMString += '<svg style="width:100%;height:100%;margin:0px"></svg></div>';
			//DOMString += '</div>';
		}
		DOMString += '</div></div>';
	}
	DOMString += '</div>';

	// DOMString += '<div style="width:50%;height:'+questNum/(questNum+respNum)*100+'%;float:left">';
	// for (var i=0; i<qID.length; i++) {
	// 	DOMString += '<div style="width:100%;height:'+(100/qID.length)+'%">';
	// 	DOMString += '<svg style="width:100%;height:100%" class="stacked_bar" qID="'+qID[i]+'"></svg></div>';
	// }
	// DOMString += '</div></div>';

	DOMString += '<div style="width:70%;height:'+respNum/(questNum+respNum)*100+'%;float:right">';

	DOMString += '<div style="width:10%;height:100%;float:left">'
	for (var i=0; i<currentResp.length; i++) {
		DOMString += '<div style="width:100%;height:'+(100/currentResp.length)+'%">';
		DOMString += '<svg style="width:100%;height:100%" class="stacked_legend" rID="'+i+'"></svg></div>';
	}
	DOMString += '</div>';

	DOMString += '<div style="width:90%;height:100%;float:left" class="resp-group">'
	for (var i=0; i<currentResp.length; i++) {
		DOMString += '<div style="width:100%;height:'+(100/currentResp.length)+'%">';
		DOMString += '<svg style="width:100%;height:100%" class="stacked_resp" rID="'+i+'"></svg></div>';
	}
	DOMString += '</div></div>';

	return $(DOMString);
}

function drawStackedQuestionWording(qcID, sID, qID) {
	var wordingSVGs = $("#query-chart"+qcID+" .stacked_wording");

	for (var i=0; i<wordingSVGs.length; i++) {
		d3.select(wordingSVGs[i]).selectAll("text")
		.data(surveyDataTable[sID][0][qID[i]])
		.enter()
	}
}

function addQueryWording(qcID, sID, qID, wordingSVG, direction) {
	var SVGWidth = parseInt(wordingSVG.css("width"));
	var SVGHeight = parseInt(wordingSVG.css("height"));

	d3.select(wordingSVG[0]).selectAll("text")
	.data([qID+": "+surveyDataTable[sID][0][qID]])
	.enter()
	.append("text")
	.attr("cursor","move")
	.attr("x",3)
	.attr("y",SVGHeight/2)
	.text(function(d){return d})
	.text(function(d){
		return fitWordingLength($(this),$(this).parent(),3,direction);
	})
	//.attr("onresize","fitWordingLength($(this),$(this).parent(),3)")
	.append("title").text(function(d){return d});
}

function drawStackedBars(qcID, qID, stackedDIV, respHistogram, respList) {
	var stackedSVGs = stackedDIV.find("svg");
	var SVGHeight = parseInt(stackedSVGs.css("height"));
	var sumHistogram = 0;
	for (var i=0; i<respHistogram.length; i++) sumHistogram += respHistogram[i];

	for (var i=0; i<stackedSVGs.length; i++) {
		$(stackedSVGs[i]).parent().css("width",respHistogram[i]/sumHistogram*100+"%");

		d3.select(stackedSVGs[i]).selectAll(".stackedTotalRect")
		.data([respHistogram[i]])
		.enter()
		.append("rect")
		.attr("class","stackedTotalRect")
		.attr("cursor","pointer")
		.attr("qID",qID)
		.attr("response",respList[i])
		.attr("x",0)
		.attr("y",SVGHeight/4)
		.attr("width",parseInt($(stackedSVGs[i]).css("width"))+1)
		.attr("height",SVGHeight/2)
		.attr("fill",function(d,index){
			var normValue = 255-$(this).parent().parent().index()/stackedSVGs.length*255;
			return d3.rgb(normValue,normValue,normValue);
		})
		.attr("stroke","black")
		.attr("stroke-width",1)
		.attr("onclick",function(d){
			return 'brushAllCharts('+window.sID+',"'+qID+'","'+respList[i]+'",0,this);'
		})
		.append("title").text(function(d){return respList[i]+": "+d+" response(s)"})

		d3.select(stackedSVGs[i]).selectAll(".stackedBrushedRect")
		.data([0])
		.enter()
		.append("rect")
		.attr("class","stackedBrushedRect")
		.attr("cursor","pointer")
		.attr("response",respList[i])
		.attr("x",0)
		.attr("y",SVGHeight/6)
		.attr("width",0)
		.attr("height",1)
		.attr("onclick","clearBrushing(window.sID)")
		.append("title");
	}
}

function drawStackedLegend(qcID, daID) {
	var colorSVGs = $("#query-chart"+qcID).find(".stacked_legend");
	var respSVGs = $("#query-chart"+qcID).find(".stacked_resp");
	var SVGHeight = parseInt(colorSVGs.css("height"));
	var colorSVGWidth = parseInt(colorSVGs.css("width"));

	for (var i=0; i<colorSVGs.length; i++) {
		$(respSVGs[i]).parent().attr("datavalue",surveyDistinctAnswer[window.sID][daID][i]).attr("qcID",qcID);

		d3.select(colorSVGs[i]).selectAll(".stackedLegend")
		.data([daID])
		.enter()
		.append("rect")
		.attr("class","stackedLegend")
		.attr("x",0)
		.attr("y",SVGHeight/2 - colorSVGWidth/4)
		.attr("width",colorSVGWidth/2)
		.attr("height",colorSVGWidth/2)
		.attr("fill",function(d,index){
			var normValue = 255-$(this).parent().parent().index()/colorSVGs.length*255;
			return d3.rgb(normValue,normValue,normValue);
		})
		.attr("stroke","black")
		.attr("stroke-width",1);

		d3.select(respSVGs[i]).selectAll(".stackedResp")
		.data([surveyDistinctAnswer[window.sID][daID][i]])
		.enter()
		.append("text")
		.attr("class","stackedResp")
		.attr("cursor","move")
		.attr("x",3)
		.attr("y",SVGHeight/2)
		.text(function(d){return d})
		.text(function(d){
			return fitWordingLength($(this),$(this).parent(),3);
		})
		//.attr("onresize","fitWordingLength($(this),$(this).parent(),3)")
		.append("title").text(function(d){return d});
	}
}

function syncStackedBars(qcID) {
	var allStackedBars = $("#query-chart"+qcID+" .stackedTotalRect");
	var allLegends = $("#query-chart"+qcID+" .stackedLegend");
	var allStackedResps = $("#query-chart"+qcID+" .stackedResp");
	var currentStackedBars, currentRespWording, lastSibling, colorList;
	//for (var i=0; i<allLegends.length; i++) colorList[i] = $(allLegends[i]).attr("fill");
	allStackedBars.parent().parent().fadeOut("normal",function(){
		for (var i=0; i<allLegends.length; i++) {
			currentRespWording = allStackedResps[i].__data__;
			currentStackedBars = $("#query-chart"+qcID+" .stackedTotalRect[response='"+currentRespWording+"']");
			currentColor = $(allLegends[i]).attr("fill");

			currentStackedBars.attr("fill",currentColor);
			for (var j=0; j<currentStackedBars.length; j++) {
				if (i == 0) {
					$(currentStackedBars[j]).parent().parent().prependTo($(currentStackedBars[j]).parent().parent().parent());
				}
				else {
					lastSibling = $($(currentStackedBars[j]).parent().parent().parent().children()[i-1]);
					lastSibling.after($(currentStackedBars[j]).parent().parent());	
				}
				//$(currentStackedBars[j]).attr("fill")
			}
			currentStackedBars.parent().parent().fadeIn();
		}
	});

	// for (var i=0; i<allLegends.length; i++) {
	// 	currentRespWording = allStackedResps[i].__data__;
	// 	currentStackedBars = $("#query-chart"+qcID+" .stackedRect[resp='"+currentRespWording+"']");
	// 	currentColor = $(allLegends[i]).attr("fill");

	// 	currentStackedBars.attr("fill",currentColor);
	// 	for (var j=0; j<currentStackedBars.length; j++) {
	// 		if (i == 0) {
	// 			$(currentStackedBars[j]).parent().parent().prependTo($(currentStackedBars[j]).parent().parent().parent());
	// 		}
	// 		else {
	// 			lastSibling = $($(currentStackedBars[j]).parent().parent().parent().children()[i-1]);
	// 			lastSibling.after($(currentStackedBars[j]).parent().parent());	
	// 		}
	// 		//$(currentStackedBars[j]).attr("fill")
	// 	}
	// 	currentStackedBars.parent().parent().fadeIn();
	// }
}

// function redrawStackedBars(qcID) {
// 	var stackedDIV = $("#query-chart"+qcID+" .stacked_DIV")
// 	var stackedSVGs = stackedDIV.find("svg");
// 	var SVGHeight = parseInt(stackedSVGs.css("height"));
// 	var sumHistogram = 0;
// 	for (var i=0; i<respHistogram.length; i++) sumHistogram += respHistogram[i];

// 	for (var i=0; i<stackedSVGs.length; i++) {
// 		$(stackedSVGs[i]).parent().css("width",respHistogram[i]/sumHistogram*100+"%");

// 		d3.select(stackedSVGs[i]).selectAll(".stackedRect")
// 		.attr("cursor","move")
// 		.data([respHistogram[i]])
// 		.enter()
// 		.append("rect")
// 		.attr("class","stackedRect")
// 		.attr("resp",respList[i])
// 		.attr("x",0)
// 		.attr("y",SVGHeight/4)
// 		.attr("width",parseInt($(stackedSVGs[i]).css("width"))+1)
// 		.attr("height",SVGHeight/2)
// 		.attr("fill",function(d,index){
// 			var normValue = 191-$(this).parent().parent().index()/stackedSVGs.length*191;
// 			return d3.rgb(normValue,normValue,normValue);
// 		})
// 		.attr("stroke","black")
// 		.attr("stroke-width",1)
// 		.append("title").text(function(d){return respList[i]+": "+d+" response(s)"})
// 	}
// }