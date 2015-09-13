query_heatmap_class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
q1_row_percent = 10;
q2_col_percent = 10;
q2_resp_percent = 20;
cell_height = 40;

function createQueryHeatmap(qcID){
	$("#query-chart"+qcID+" .chart-container").remove();
	var sID = window.sID;
	var qID = $("#query-chart"+qcID+" .panel .question-selector").val();

	if (qID.length == 2) {
		var RespType1 = surveyDataTable[sID][1][qID[0]];
		var RespType2 = surveyDataTable[sID][1][qID[1]];

		if (!containedInArray("Numeric",[RespType1,RespType2]) & !containedInArray("Ranking Response",[RespType1,RespType2]) 
			& !containedInArray("Open-Ended Response",[RespType1,RespType2])) {
			$("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_heatmap_class+'" style="margin:0px;width:100%;height:100%" qID1='+qID[0]+' qID2='+qID[1]+'></div>'));
			drawQueryHeatmap(qcID, qID[0], qID[1]);
			$("#query-chart"+qcID+" .chart-container").addClass("heatmap");
		}
		else createQueryEmpty(qcID);
		
	}
}

function drawQueryHeatmap(qcID, qID1, qID2){
	var currentContainer = $("#query-chart"+qcID+" .chart-container");
	var respNum1 = surveyResponseAnswer[window.sID][qID1].length;
	var respNum2 = surveyResponseAnswer[window.sID][qID2].length;
	var daID;
	currentContainer.css("height",(respNum2+2)*cell_height);
	for (var i=0; i<surveyDistinctAnswer[window.sID].length; i++) {
		if (equalArrays(surveyDistinctAnswer[window.sID][i],surveyResponseAnswer[window.sID][qID1])) {
			daID1 = i;
			//console.log(daID);
		}
		if (equalArrays(surveyDistinctAnswer[window.sID][i],surveyResponseAnswer[window.sID][qID2])) {
			daID2 = i;
		}
	}
	//var currentConWidth = parseInt(currentContainer.css("width"));
	//currentContainer.css("width",currentContainer.css("width"))

	// var q1Row = $('<div style="width:'+currentConWidth+'"></div>');
	// q1Row.append($('<div style="width:'+(q2_col_percent+q2_resp_percent)+'%;height:100%"></div>'));
	// q1Row.append($('<div style="width:'+(100 - q2_col_percent - q2_resp_percent)+'%;height:100%"></div>'));
	// q1Row.children().css("float","left");
	//q1Row.children().last().children().css("float","left");
	//currentContainer.append(q1Row);
	//q1Row.children().first().css("height",q1Row.children().last().css("height"));
	//q1Row.children().last().addClass("query-heatmap-cell");

	// var tableBody = $('<div style="width:'+currentConWidth+'"></div>');
	// var q2Col = $('<div style="width:'+q2_col_percent+'%;height:'+(respNum2+1)*cell_height+'px;transform: rotate(90deg)">Question 2</div>');
	// var q2Resp = $('<div style="width:'+q2_resp_percent+'%;height:'+(respNum2+1)*cell_height+'px"></div>');
	// q2Col.addClass("query-heatmap-cell");
	// q2Resp.addClass("query-heatmap-cell");

	// q2Col = q1Row.children().first();
	// q2Col.append($('<div style="width:100%;height:'+cell_height+'px"></div>'));
	// q2Col.append($('<div style="width:100%;height:'+((respNum2+1)*cell_height)+'px"></div>'));
	// q2Col.children().css("float","left")
	//tableBody.append(q2Col);
	//tableBody.append(q2Resp);
	//currentContainer.append(tableBody);
	// q1Col = q1Row.children().last();
	// q1Col.append($('<div style="height:'+cell_height+'px"><svg style="width:100%;height:'+cell_height+'"></svg></div>'));
	// q1Col.append($('<div style="height:'+((respNum2+1)*cell_height)+'px"><svg style="width:100%;height:'+((respNum2+1)*cell_height)+'px"></svg></div>'));

	// q2Wording = $('<div style="width:30%;height:100%">'+surveyDataTable[window.sID][0][currentContainer.attr("qID2")]+'</div>');
	// q2Wording.addClass("query-heatmap-cell");
	// q2Col.children().last().append(q2Wording);

	// q2Resp = $('<div style="width:70%;height:100%"></div>');
	// q2Resp.append($('<div style="width:100%;height:'+(100/(respNum2+1))+'%"></div>'));
	// for (var i=0; i<respNum2; i++) {
	// 	q2Resp.append($('<div style="width:100%;height:'+(100/(respNum2+1))+'%">'+surveyResponseAnswer[window.sID][currentContainer.attr("qID2")][i]+'</div>'));
	// }
	// q2Resp.css("float","left");
	// q2Resp.children().addClass("query-heatmap-cell");
	// q2Col.children().last().append(q2Resp);

	currentContainer.append(newQueryHeatMapDOM(qcID,window.sID,qID1,qID2,daID1,daID2));
	addQ1Wording(qcID,window.sID,qID1);
	addQ2Wording(qcID,window.sID,qID2);
	addQ1Resp(qcID,window.sID,qID1,daID1);
	addQ2Resp(qcID,window.sID,qID2,qID1,daID2);
	addHeatmapCells(qcID,window.sID,qID1,qID2);

	var quest_height = parseInt($("#query-chart"+qcID+" .question-area").css("height"));
	var con_height = parseInt($("#query-chart"+qcID+" .chart-container").css("height"));
	$("#query-chart"+qcID).css("height",quest_height+con_height+20);
	$("#query-chart"+qcID+" .panel").css("height","100%");
}

function newQueryHeatMapDOM (qcID, sID, qID1, qID2, daID1, daID2) {
	var currentContainer = $("#query-chart"+qcID+" .chart-container");
	var respNum1 = surveyResponseAnswer[window.sID][currentContainer.attr("qID1")].length;
	var respNum2 = surveyResponseAnswer[window.sID][currentContainer.attr("qID2")].length;
	var currentConWidth = parseInt(currentContainer.css("width"));
	// var daID;

	// for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
	// 	if (equalArrays(surveyDistinctAnswer[sID][i],surveyResponseAnswer[sID][qID1])) {
	// 		daID = i;
	// 		break;
	// 	}
	// }

	var DOMString = '<div style="width:'+currentConWidth+';height:100%">';	// open 1 (main body)

	// Left column, question 2 wording and question 2 responses
	DOMString += '<div style="width:'+(q2_col_percent+q2_resp_percent)+'%;height:100%;float:left">'; // open 2 (left column)
	DOMString += '<div style="width:100%;height:'+(100/(respNum2+2))+'%;float:left"></div>';	// open 3, close 3 (empty area)
	DOMString += '<div style="width:100%;height:'+(100-100/(respNum2+2))+'%;float:left">'; // open 4 (content area)
	DOMString += '<div style="width:'+(q2_col_percent/(q2_resp_percent+q2_col_percent)*100)+'%;height:100%;float:left" >'; // open 13 (q2 wording col)
	DOMString += '<svg style="width:100%;height:100%" id="qc'+qcID+'-q2wording"></svg></div>'; // open 14 close 14,13
	DOMString += '<div style="width:'+(q2_resp_percent/(q2_resp_percent+q2_col_percent)*100)+'%;height:100%;float:left">'; // open 15 (q2 resp col)
	DOMString += '<div style="width:100%;height:'+(100/(respNum2+1))+'%"><svg style="width:100%;height:100%"></svg></div>'; // open 16 close 16 empty cell
	DOMString += '<div style="width:100%;height:'+(100*respNum2/(respNum2+1))+'%" id="qc'+qcID+'-qID2'+qID2+'-col" class="heatmap-q2-col" daID='+daID2+'>'; // open 17 div for all q2 resps
	for (var i=0; i<respNum2; i++){
		DOMString += '<div style="width:100%;height:'+(100/respNum2)+'%">'; // open 5 (q2 resp)
		DOMString += '<svg id="qc'+qcID+'-qID2'+qID2+'-resp'+i+'" style="width:100%;height:100%"></svg></div>'; // open 6, close 6,5
	}
	DOMString += '</div></div></div></div>'; // close 15,16,4,2

	// Right column, quetion 1 wording, question 1 responese
	DOMString += '<div style="width:'+(100 - q2_col_percent - q2_resp_percent)+'%;height:100%;float:left">'; // open 7 (right column)
	DOMString += '<div style="height:'+(100/(respNum2+2))+'%">'; // open 8 (q1 wording)
	DOMString += '<svg style="width:100%;height:100%;padding:0;margin:0" id="qc'+qcID+'-q1wording"></svg></div>'; // open 9, close 9,8 (q1 wording svg)
	DOMString += '<div style="width:100%;height:'+(100/(respNum2+2))+'%;padding:0" id="qc'+qcID+'-qID1'+qID1+'-row" class="col-lg-12" daID='+daID1+'>'; // open 10 (q1 resp row)
	for (var i=0; i<respNum1; i++) {
		DOMString += '<div style="width:'+(100/respNum1)+'%;height:100%;float:left;padding:0" class="col-lg-2">'; // oepn 11 (q1 resp cell)
		DOMString += '<svg id="qc'+qcID+'-qID1'+qID1+'-resp'+i+'" style="width:100%;height:100%"></svg></div>'; // open 12, close 12,11
	}
	DOMString += '</div></div></div>'; // close 7,1
	//DOMString += '</div>';

	return $(DOMString);
};

function addQ1Wording (qcID, sID, qID1) {
	var wordingSVG = $("#qc"+qcID+"-q1wording");
	var SVGWidth = parseInt(wordingSVG.css("width"));
	var SVGHeight = parseInt(wordingSVG.css("height"));

	//wordingSVG.append($('<rect x="0" y="0" width="'+SVGWidth+'" height="'+SVGHeight+'" stroke="black"/>'));

	d3.select(wordingSVG[0]).selectAll("rect")
	.data([0])
	.enter()
	.append("rect")
	.attr("x",0)
	.attr("y",0)
	.attr("width",SVGWidth)
	.attr("height",SVGHeight)
	.attr("fill","white")
	.attr("stroke","black")
	.attr("stroke-width",1)

	d3.select(wordingSVG[0]).selectAll("text")
	.data([qID1+": "+surveyDataTable[sID][0][qID1]])
	.enter()
	.append("text")
	.attr("x",3)
	.attr("y",SVGHeight/2)
	.text(function(d){return d})
	.text(function(d){
		return fitWordingLength($(this),$(this).parent(),3);
	})
	//.attr("onresize","fitWordingLength($(this),$(this).parent(),3)")
	.append("title").text(function(d){return d});
}

function addQ2Wording (qcID, sID, qID2) {
	var wordingSVG = $("#qc"+qcID+"-q2wording");
	var SVGWidth = parseInt(wordingSVG.css("width"));
	var SVGHeight = parseInt(wordingSVG.css("height"));

	//wordingSVG.append($('<rect x="0" y="0" width="'+SVGWidth+'" height="'+SVGHeight+'" stroke="black"/>'));

	d3.select(wordingSVG[0]).selectAll("rect")
	.data([0])
	.enter()
	.append("rect")
	.attr("x",0)
	.attr("y",0)
	.attr("width",SVGWidth)
	.attr("height",SVGHeight)
	.attr("fill","white")
	.attr("stroke","black")
	.attr("stroke-width",1)

	d3.select(wordingSVG[0]).selectAll("text")
	.data([qID2+": "+surveyDataTable[sID][0][qID2]])
	.enter()
	.append("text")
	.attr("direction","vertical")
	.attr("y",SVGWidth/2)
	.attr("x",-SVGHeight+3)
	.text(function(d){return d})
	.attr("transform","rotate(-90)")
	.text(function(d){
		return fitWordingLength($(this),$(this).parent(),3,'vertical');
	})
	.append("title").text(function(d){return d});
}

function addQ1Resp (qcID, sID, qID1, daID) {
	var respSVGs = $("#qc"+qcID+"-qID1"+qID1+"-row svg");
	respSVGs.parent().parent().attr("daID",daID);
	// for (var i=0; i<surveyDistinctAnswer[sID].length; i++) {
	// 	if (equalArrays(surveyDistinctAnswer[sID][i],surveyResponseAnswer[sID][qID1])) {
	// 		respSVGs.parent().attr("daID",i);
	// 	}
	// }
	//console.log(respSVGs);
	var SVGWidth, SVGHeight;

	for (var i=0; i<respSVGs.length; i++) {
		SVGWidth = parseInt($(respSVGs[i]).css("width"));
		SVGHeight = parseInt($(respSVGs[i]).css("height"));
		$(respSVGs[i]).parent().attr("datavalue",surveyResponseAnswer[sID][qID1][i]);
		//console.log(SVGHeight+" "+SVGWidth);

		d3.select(respSVGs[i]).selectAll(".respQ1Rect")
		.data([0])
		.enter()
		.append("rect")
		.attr("cursor","move")
		.attr("class","respQ1Rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width",SVGWidth)
		.attr("height",SVGHeight)
		.attr("fill","white")
		.attr("stroke","black")
		.attr("stroke-width",1)

		d3.select(respSVGs[i]).selectAll("text")
		.data([surveyResponseAnswer[sID][qID1][i]])
		.enter()
		.append("text")
		.attr("cursor","move")
		.attr("x",3)
		.attr("y",SVGHeight/2)
		.text(function(d){return d})
		.text(function(d){
			return fitWordingLength($(this),$(this).parent(),3);
		})
		.append("title").text(function(d){return d});
	}

	$("#qc"+qcID+"-qID1"+qID1+"-row").sortable({
		containment: 'parent',
		cancel: '.heatmapCell',
		axis: 'x',
		start: function(event,ui){
			var new_cell_width = parseInt($(this).children().css("width"));
			//var new_cell_height = parseInt($(this).find(".respQ2Rect").css("height"));
			var new_cell_height = ui.item.css("height");
			$(".ui-sortable-placeholder").css("width",new_cell_width-1);
			$(".ui-sortable-placeholder").css("height",new_cell_height);
			ui.item.attr("oldIndex",ui.item.index());
		},
		stop: function(event,ui) {
			if (ui.item.attr("oldIndex") == ui.item.index()) return;
			syncRespOrder(ui.item);

			var allMatchedChart = $("#query-area .stacked [daID='"+$(this).attr("daID")+"']");
			//console.log(allMatchedChart);
			for (var i=0; i<allMatchedChart.length; i++) {
				syncStackedBars($(allMatchedChart[i]).children().attr("qcID"));
			}
			//syncStackedBars(qcID);
		}
	});
}

function addQ2Resp (qcID, sID, qID2, qID1, daID) {
	var respSVGs = $("#qc"+qcID+"-qID2"+qID2+"-col svg");
	var blankCell = $("#qc"+qcID+"-qID2"+qID2+"-col").siblings().find("svg");
	var SVGWidth, SVGHeight;
	SVGWidth = parseInt($(respSVGs[0]).css("width"));
	SVGHeight = parseInt($(respSVGs[0]).css("height"));
	respSVGs.parent().parent().attr("daID",daID);
	
	d3.select(blankCell[0]).selectAll("rect")
	.data([0])
	.enter()
	.append("rect")
	.attr("x",0)
	.attr("y",0)
	.attr("width",SVGWidth)
	.attr("height",SVGHeight)
	.attr("fill","white")
	.attr("stroke","black")
	.attr("stroke-width",1)

	for (var i=0; i<respSVGs.length; i++) {
		SVGWidth = parseInt($(respSVGs[i]).css("width"));
		SVGHeight = parseInt($(respSVGs[i]).css("height"));
		$(respSVGs[i]).parent().attr("qcID",qcID);
		$(respSVGs[i]).parent().attr("datavalue",surveyResponseAnswer[sID][qID2][i]);
		//console.log(SVGHeight+" "+SVGWidth);

		d3.select(respSVGs[i]).selectAll(".respQ2Rect")
		.data([0])
		.enter()
		.append("rect")
		.attr("class","respQ2Rect")
		.attr("cursor","move")
		.attr("x",0)
		.attr("y",0)
		.attr("width",SVGWidth)
		.attr("height",SVGHeight)
		.attr("fill","white")
		.attr("stroke","black")
		.attr("stroke-width",1)

		//if (i == 0) continue;
		d3.select(respSVGs[i]).selectAll("text")
		.data([surveyResponseAnswer[sID][qID2][i]])
		.enter()
		.append("text")
		.attr("cursor","move")
		.attr("x",3)
		.attr("y",SVGHeight/2)
		.text(function(d){return d})
		.text(function(d){
			return fitWordingLength($(this),$(this).parent(),3);
		})
		.append("title").text(function(d){return d});
	}

	$("#qc"+qcID+"-qID2"+qID2+"-col").sortable({
		containment: 'parent',
		axis: 'y',
		start: function(event,ui){
			//$(".ui-sortable-placeholder").css("height",cell_height);
			//var new_cell_width = parseInt($(this).children().css("width"));
			var new_cell_height = ui.item.css("height");
			console.log(new_cell_height);
			//$(".ui-sortable-placeholder").css("width",new_cell_width-1);
			$(".ui-sortable-placeholder").css("height",100/respSVGs.length+"%");
			ui.item.attr("oldIndex",ui.item.index());

			$(this).attr("sorted","true");
			
		},
		stop: function(event,ui){
			appendCellsToQ1(qcID, qID1, qID2);
			$(this).attr("sorted","false");

			if (ui.item.attr("oldIndex") == ui.item.index()) return;
			syncRespOrder(ui.item);

			var allMatchedChart = $("#query-area .stacked [daID='"+$(this).attr("daID")+"']");
			//console.log(allMatchedChart);
			for (var i=0; i<allMatchedChart.length; i++) {
				syncStackedBars($(allMatchedChart[i]).children().attr("qcID"));
			}
		}
	});

	$("#qc"+qcID+"-qID2"+qID2+"-col").mousedown(function(){
		appendCellsToQ2(qcID, qID1, qID2);
	});

	$("#qc"+qcID+"-qID2"+qID2+"-col").mouseup(function(){
		if ($(this).attr("sorted") != "true") {
			appendCellsToQ1(qcID, qID1, qID2);
		}
	});
}

function addHeatmapCells (qcID, sID, qID1, qID2) {
	var respSVGs = $("#qc"+qcID+"-qID1"+qID1+"-row svg");
	var respQ1List = surveyResponseAnswer[sID][qID1];
	var respQ2List = surveyResponseAnswer[sID][qID2];
	var heatmapMatrix = getHeatmapMatrix(sID, qID1, qID2);
	var tempMax = 0;

	for (var i=0; i<respQ1List.length; i++) {
		if (Math.max.apply(null,heatmapMatrix[i]) > tempMax) tempMax = Math.max.apply(null,heatmapMatrix[i]);
	}

	for (var s=0; s<respQ1List.length; s++) {
		SVGWidth = parseInt($(respSVGs[s]).css("width"));
		SVGHeight = parseInt($(respSVGs[s]).css("height"));

		$(respSVGs[s]).css("height",SVGHeight+cell_height*respQ2List.length);

		d3.select(respSVGs[s]).selectAll(".heatmapCell")
		.data(heatmapMatrix[s])
		.enter()
		.append("rect")
		.attr("class","heatmapCell")
		.attr("respQ1",respQ1List[s])
		.attr("respQ2",function(d,i){return respQ2List[i]})
		.attr("x",0)
		.attr("y",function(d,i){
			return (i+1)*cell_height;
		})
		.attr("width",SVGWidth)
		.attr("height",SVGHeight)
		.attr("fill",function(d){
			var normValue = (tempMax-d)/tempMax*191+64;
			return d3.rgb(normValue,normValue,normValue);
		})
		.attr("stroke","black")
		.attr("stroke-width",1)
		.append("title").text(function(d,i) {
			return qID1+": "+respQ1List[s]+", "+qID2+": "+respQ2List[i]+", "+d+" response(s)";
		});
	}
}

function getHeatmapMatrix (sID, qID1, qID2) {
	//var valueMatrix = new Object();
	var valueMatrix = new Array();
	//var respQ1,respQ2;

	for (var i1 = 0; i1 < surveyResponseAnswer[sID][qID1].length; i1++) {
		//respQ1 = surveyResponseAnswer[sID][qID1][i1];
		//valueMatrix[respQ1] = new Object();
		valueMatrix[i1] = new Array();
		for (var i2 = 0; i2 < surveyResponseAnswer[sID][qID2].length; i2++) {
			valueMatrix[i1][i2] = 0
			for (var j = 2; j < surveyDataTable[sID].length; j++) {
				//respQ2 = surveyResponseAnswer[sID][qID2][i2];
				if (surveyDataTable[sID][j][qID1] == null | surveyDataTable[sID][j][qID2] == null) continue;
				if ((surveyDataTable[sID][j][qID1] instanceof Array ? containedInArray(surveyResponseAnswer[sID][qID1][i1],surveyDataTable[sID][j][qID1])
					: surveyDataTable[sID][j][qID1] == surveyResponseAnswer[sID][qID1][i1]) &
					(surveyDataTable[sID][j][qID2] instanceof Array ? containedInArray(surveyResponseAnswer[sID][qID2][i2],surveyDataTable[sID][j][qID2])
					: surveyDataTable[sID][j][qID2] == surveyResponseAnswer[sID][qID2][i2]))
				{
					valueMatrix[i1][i2] += 1;
				}
				// if (surveyDataTable[sID][j][qID1] == surveyResponseAnswer[sID][qID1][i1]
				// 	& surveyDataTable[sID][j][qID2] == surveyResponseAnswer[sID][qID2][i2]) {
				// 	//valueMatrix[i1][i2] = (valueMatrix[i1][i2] >= 0 ? valueMatrix[i1][i2]+1 : 1);
				// 	valueMatrix[i1][i2] += 1;
				// 	//valueMatrix[respQ1][respQ2] = (valueMatrix[respQ1][respQ2] >= 0 ? valueMatrix[respQ1][respQ2]+1 : 1);
				// }
			}
		}
	}

	// var temp_max = 0;
	// for (var i1 = 0; i1 < surveyResponseAnswer[sID][qID1].length; i1++) {
	// 	for (var i2 = 0; i2 < surveyResponseAnswer[sID][qID2].length; i2++) {
	// 		if (valueMatrix[i1][i2] > temp_max) temp_max = valueMatrix[i1][i2];
	// 	}
	// }
	// for (var i1 = 0; i1 < surveyResponseAnswer[sID][qID1].length; i1++) {
	// 	for (var i2 = 0; i2 < surveyResponseAnswer[sID][qID2].length; i2++) {
	// 		valueMatrix[i1][i2] /= temp_max;
	// 	}
	// }

	return valueMatrix;
}

function appendCellsToQ2 (qcID, qID1, qID2) {
	var respQ1SVGs = $("#qc"+qcID+"-qID1"+qID1+"-row svg");
	var respQ2SVGs = $("#qc"+qcID+"-qID2"+qID2+"-col svg");
	var cell_width = parseInt($(respQ1SVGs.find(".heatmapCell")[0]).attr("width"));
	var tempRects;

	oldRespQ2Width = parseInt(respQ2SVGs.css("width"));
	respQ2SVGs.css("width",oldRespQ2Width + respQ1SVGs.length * cell_width);

	for (var i1 = 0; i1 < respQ1SVGs.length; i1++) {
		tempRects = $(respQ1SVGs[i1]).find(".heatmapCell");

		for (var i2 = 0; i2 < respQ2SVGs.length; i2++) {
			$(tempRects[i2]).appendTo($(respQ2SVGs[i2]));
			$(tempRects[i2]).attr("x",i1 * cell_width + oldRespQ2Width);
			$(tempRects[i2]).attr("y",0);
		}
	}
}

function appendCellsToQ1 (qcID, qID1, qID2) {
	var respQ1SVGs = $("#qc"+qcID+"-qID1"+qID1+"-row svg");
	var respQ2SVGs = $("#qc"+qcID+"-qID2"+qID2+"-col svg");
	var cell_width = parseInt($(respQ2SVGs.find(".heatmapCell")[0]).attr("width"));
	var cell_height_temp = parseInt($(respQ2SVGs.find(".heatmapCell")[0]).attr("height"));
	var tempRects;

	oldRespQ2Width = parseInt(respQ2SVGs.css("width"));
	respQ2SVGs.css("width",oldRespQ2Width - respQ1SVGs.length * cell_width);

	for (var i2 = 0; i2 < respQ2SVGs.length; i2++) {
		tempRects = $(respQ2SVGs[i2]).find(".heatmapCell");

		for (var i1 = 0; i1 < respQ1SVGs.length; i1++) {
			$(tempRects[i1]).appendTo($(respQ1SVGs[i1]));
			$(tempRects[i1]).attr("x",0);
			$(tempRects[i1]).attr("y",(i2 + 1) * cell_height_temp);
		}
	}
}

function fitWordingLength(text, svg, margin, direction) {
	var maxSize = ( direction == 'vertical' ? svg.height() : svg.width() );
	var newText
	//var textSize = ( direction == 'vertical' ? text.height() : text.width() );
	if (text.width() >= maxSize - 2 * margin) {
		var text_length = text[0].__data__.length;
		//var cut_ratio = (svg.width()-2*margin)/text.width();
		//console.log(cut_ratio);
		newText = text[0].__data__.substring(0,Math.floor(text[0].__data__.length*(maxSize-2*margin)/text.width()-2)) + "...";
	}
	else newText = text[0].__data__;

	if (direction == 'vertical') {
		var SVGWidth = parseInt(text.parent().css("width"));
		var SVGHeight = parseInt(text.parent().css("height"));
		//console.log(SVGWidth+" "+SVGHeight);

		d3.select(text[0])
		.attr("y",SVGWidth/2)
		.attr("x",-SVGHeight+3);
	}

	return newText;
}