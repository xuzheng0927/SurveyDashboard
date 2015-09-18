function brushAllCharts(sID,qID,response,panel,clickedbar,resptype) {
	if ((window.brushSettings[sID] instanceof Object) == false) window.brushSettings[sID] = new Object();
	window.brushSettings[sID] = {"qID":qID,"response":response,"clickedbar":clickedbar,"resptype":resptype};
	// if (window.brushSettings[sID]["clickedbar"] instanceof Object) clickedbar = window.brushSettings[sID]["clickedbar"];
	// else window.brushSettings[sID]["clickedbar"] = clickedbar;

	if (panel instanceof Object) {
		var allCharts = panel.find(".chart-container");
	}
	else var allCharts = $(".chart-container");
	var currentAllTotalRects;
	var currentAllBrushedRects;
	var newWidth, newHeight;
	var tempResp;
	//console.log(clickedbar);

	for (var i=0; i<allCharts.length; i++) {
		//if ($(allCharts[i]).attr("sID") != sID) continue;
		//console.log($(allCharts[i]).parent().parent());

		if ($(allCharts[i]).parent().parent().hasClass("sm-barchart") | $(allCharts[i]).hasClass("barchart")) {
			//console.log($(allCharts[i]).find("rect"));
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			var brushedNums = new Array();
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;
			//console.log(currentAllTotalRects);

			for (var j=2; j<surveyDataTable[sID].length; j++){
				if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					if (resptype == "ranking" & currentAllTotalRects[r].getAttribute("qID") == qID) continue;
					if (currentAllTotalRects[r].getAttribute("qID") == qID 
						& currentAllTotalRects[r].getAttribute("response") != response) continue;
					tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];

					if (tempResp instanceof Array == true) {
						for (rr=0; rr<tempResp.length; rr++) {
							if (tempResp[rr] == $(currentAllTotalRects[r]).attr("response")) brushedNums[r] += 1;
						}
					}
					else {
						if (tempResp == $(currentAllTotalRects[r]).attr("response")) brushedNums[r] += 1;
					}
				}
			}
			//console.log(brushedNums);

			for (var r=0; r<currentAllBrushedRects.length; r++){
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];
				newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
				//console.log(currentAllBrushedRects[r]);
				//console.log(newWidth);
				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("width",newWidth)
				.attr("stroke-width",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					// if ($(this).parent().parent().attr("sID") == sID & $(this).parent().parent().attr("title") == response
					// 	& $(this).siblings(".totalRect")[0].getAttribute("qID") == qID) return 2;
					if (currentAllTotalRects[r] == clickedbar) return 2;
					else return 1;
				})
				.attr("stroke",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return "cyan";
					else return "black";
				})
				.attr("fill-opacity",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return 0.7;
					else return 1;
				})
				.selectAll("title")
				.text(function(){
					if (response instanceof Object) {
						return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					}
					else if (resptype == "ranking") {
						return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID;
					}
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
		else if ($(allCharts[i]).parent().parent().hasClass("sm-text") | $(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			//console.log(currentAllRespText);
			$(allCharts[i]).find("hr").show("slow");
			for (var r=0; r<currentAllRespTextPri.length; r++) {
				if (!responseMatch(surveyDataTable[sID][$(currentAllRespTextPri[r]).attr("rID")][qID],response,resptype)) {
					$(currentAllRespTextPri[r]).hide("slow").animate({color:"#337CB7"});
				}
				else {
					$(currentAllRespTextPri[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespTextPri[r]).show("slow").animate({color:"#337CB7"});
				}
			}

			for (var r=0; r<currentAllRespTextSec.length; r++) {
				if (responseMatch(surveyDataTable[sID][$(currentAllRespTextSec[r]).attr("rID")][qID],response,resptype)) {
					$(currentAllRespTextSec[r]).hide("slow");
				}
				else {
					//$(currentAllRespTextSec[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespTextSec[r]).show("slow");
				}
			}
		}
		// else if ($(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
		// 	currentAllTotalRects = $(allCharts[i]).find(".totalRect");
		// 	currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
		// 	var brushedNums = new Array();
		// 	var tempUpBound, tempLoBound;
		// 	for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

		// 	for (var j=2; j<surveyDataTable[sID].length;j++) {
		// 		//if (surveyDataTable[sID][j][qID] != response) continue;
		// 		if (!responseMatch(surveyDataTable[sID][j][qID],response)) continue;

		// 		for (var r=0; r<currentAllTotalRects.length; r++){
		// 			tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];
		// 			tempUpBound = currentAllTotalRects[r].getAttribute("upbound");
		// 			tempLoBound = currentAllTotalRects[r].getAttribute("lobound");
		// 			if (tempLoBound == "-Infinity") {
		// 				if (parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
		// 			}
		// 			else {
		// 				if (parseFloat(tempResp) > parseFloat(tempLoBound) & parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
		// 			}
		// 		}
		// 	}

		// 	for (var r=0; r<currentAllBrushedRects.length; r++){
		// 		if (currentAllTotalRects[r].__data__ == 0) continue;
		// 		if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];

		// 		newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
		// 		d3.select(currentAllBrushedRects[r])
		// 		.attr("brushed","true")
		// 		.transition().duration(500)
		// 		.attr("width",newWidth)
		// 		.attr("stroke-width",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return 2;
		// 			else return 1;
		// 		})
		// 		.attr("stroke",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return "cyan";
		// 			else return "black";
		// 		})
		// 		.attr("fill-opacity",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return 0.7;
		// 			else return 1;
		// 		})
		// 		.selectAll("title")
		// 		.text(function(){
		// 			if (response instanceof Object) {
		// 				return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
		// 			}
		// 			else return brushedNums[r]+' response "'+response+'" in '+qID;
		// 		});

		// 		currentAllBrushedRects[r].__data__ = brushedNums[r]
		// 	}
		// }
		else if ($(allCharts[i]).hasClass("histogram") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
			currentAllTotalRects = $(allCharts[i]).find(".totalHistRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedHistRect");
			var brushedNums = new Array();
			var tempUpBound, tempLoBound;
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

			for (var j=2; j<surveyDataTable[sID].length;j++) {
				//if (surveyDataTable[sID][j][qID] != response) continue;
				if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];
					tempUpBound = currentAllTotalRects[r].getAttribute("upbound");
					tempLoBound = currentAllTotalRects[r].getAttribute("lobound");
					if (parseFloat(tempResp) > parseFloat(tempLoBound) & parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
				}
			}

			for (var r=0; r<currentAllBrushedRects.length; r++){
				if (currentAllTotalRects[r].__data__.value == 0) continue;
				if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];

				newHeight = $(currentAllTotalRects[r]).attr("height") / currentAllTotalRects[r].__data__.value * brushedNums[r];
				oldHeight = $(currentAllBrushedRects[r]).attr("height");

				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("height",newHeight)
				.attr("y",function(d) {
					//console.log($(this).attr("y") - newHeight + oldHeight);
					//return $(this).attr("y") + oldHeight - newHeight;
					return parseInt($(currentAllTotalRects[r]).attr("y")) + parseInt($(currentAllTotalRects[r]).attr("height")) - newHeight;
				})
				.attr("stroke-width",function(){
					if (currentAllTotalRects[r] == clickedbar) return 2;
					else return 1;
				})
				.attr("stroke",function(){
					if (currentAllTotalRects[r] == clickedbar) return "cyan";
					else return "black";
				})
				.attr("fill-opacity",function(){
					if (currentAllTotalRects[r] == clickedbar) return 0.7;
					else return 1;
				})
				.selectAll("title")
				.text(function(){
					if (response instanceof Object) {
						return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					}
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});

				//currentAllBrushedRects[r].__data__ = {"value":brushedNums[r],"min":currentAllTotalRects[r].__data__.min,"max":currentAllTotalRects[r].__data__.max};
				currentAllBrushedRects[r].__data__ = new Object();
				currentAllBrushedRects[r].__data__.value = brushedNums[r];
				currentAllBrushedRects[r].__data__.min = currentAllTotalRects[r].__data__.min;
				currentAllBrushedRects[r].__data__.max = currentAllTotalRects[r].__data__.max;
				//console.log(currentAllTotalRects[r].__data__);
			}
		}
		else if ($(allCharts[i]).hasClass("scatter") | $(allCharts[i]).hasClass("correlation")) {
			d3.select(allCharts[i]).selectAll(".scatter-point")
			.attr("fill",function (d,index) {
				if (responseMatch(surveyDataTable[sID][$(this).attr("index")][qID],response,resptype)) {
					return "cyan";
				}
				else return "#333333";
			})
		}
		else if ($(allCharts[i]).hasClass("barchart-rank") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-rank")) {
			//console.log(clickedbar.getAttribute("onclick"))
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");

			for (var r=0; r<currentAllBrushedRects.length; r++){
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) {
					clickedbar = currentAllTotalRects[r];
					currentAllBrushedRects[r].__data__ = currentAllBrushedRects[r].getAttribute("rank");
				}
				else currentAllBrushedRects[r].__data__ = 0;

				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("width",function(){
					if (currentAllTotalRects[r] == clickedbar) return currentAllTotalRects[r].getAttribute("width");
					else return 0;
				})
				.attr("stroke-width",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					// if ($(this).parent().parent().attr("sID") == sID & $(this).parent().parent().attr("title") == response
					// 	& $(this).siblings(".totalRect")[0].getAttribute("qID") == qID) return 2;
					if (currentAllTotalRects[r] == clickedbar) return 2;
					else return 1;
				})
				.attr("stroke",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return "cyan";
					else return "black";
				})
				.attr("fill-opacity",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return 0.7;
					else return 1;
				})
				.selectAll("title")
				.text(function(d){
					if (resptype == "ranking") {
						var rankastop = 0;
						for (var j=2; j<surveyDataTable[sID].length; j++) {
							if (surveyDataTable[sID][j][qID] == null) continue;
							if (surveyDataTable[sID][j][qID][0] == currentAllBrushedRects[r].getAttribute("response")) rankastop += 1;
						}
						return rankastop+" respondents rank "+currentAllBrushedRects[r].getAttribute("response")+" as No. 1";
					}
					else if (response instanceof Object) {
						return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					}
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});
			}
		}
		else if ($(allCharts[i]).hasClass("stacked")) {
			console.log("stacked")
			currentAllTotalRects = $(allCharts[i]).find(".stackedTotalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".stackedBrushedRect");

			var brushedNums = new Array();
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

			for (var j=2; j<surveyDataTable[sID].length; j++){
				if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					if (resptype == "ranking" & currentAllTotalRects[r].getAttribute("qID") == qID) continue;
					if (currentAllTotalRects[r].getAttribute("qID") == qID 
						& currentAllTotalRects[r].getAttribute("response") != response) continue;
					tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];

					if (tempResp instanceof Array == true) {
						for (rr=0; rr<tempResp.length; rr++) {
							if (tempResp[rr] == $(currentAllTotalRects[r]).attr("response")) brushedNums[r] += 1;
						}
					}
					else {
						if (tempResp == $(currentAllTotalRects[r]).attr("response")) brushedNums[r] += 1;
					}
				}
			}
			//console.log(brushedNums);

			for (var r=0; r<currentAllBrushedRects.length; r++){
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];
				newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];

				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("width",newWidth)
				.attr("stroke-width",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					// if ($(this).parent().parent().attr("sID") == sID & $(this).parent().parent().attr("title") == response
					// 	& $(this).siblings(".totalRect")[0].getAttribute("qID") == qID) return 2;
					if (currentAllTotalRects[r] == clickedbar) return 2;
					else return 1;
				})
				.attr("stroke",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return "cyan";
					else return "#337CB7";
				})
				.attr("fill","#337CB7")
				.attr("fill-opacity",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return 0.3;
					else return 0.7;
				})
				.selectAll("title")
				.text(function(){
					if (response instanceof Object) {
						return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					}
					else if (resptype == "ranking") {
						return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID;
					}
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
	}
}

function clearBrushing(sID) {
	var allCharts = $(".chart-container");

	for (var i=0; i<allCharts.length; i++) {
		//if ($(allCharts[i]).attr("sID") != sID) continue;

		if ($(allCharts[i]).parent().parent().hasClass("sm-barchart") | $(allCharts[i]).hasClass("barchart") |
			$(allCharts[i]).parent().parent().hasClass("sm-barchart-rank") | $(allCharts[i]).hasClass("barchart-rank")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.attr("brushed","false")
				.transition().duration(500)
				.attr("width",0)
				.attr("stroke","black")
				.attr("stroke-width",1)

				$(currentAllBrushedRects[i]).__data__ = 0;
			}
		}
		else if ($(allCharts[i]).parent().parent().hasClass("sm-text") | $(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			currentAllRespTextPri.show("slow").animate({color:"black"});
			currentAllRespTextPri.removeAttr("title");
			currentAllRespTextSec.hide("slow");
			$(allCharts[i]).find("hr").hide("slow");
		}
		else if ($(allCharts[i]).hasClass("histogram") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".brushedHistRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.attr("brushed","false")
				.transition().duration(500)
				.attr("y",function(d){
					return parseFloat($(this).attr("y")) + parseFloat($(this).attr("height"));
				})
				.attr("height",0)
				.attr("stroke","black")
				.attr("stroke-width",1)

				$(currentAllBrushedRects[i]).__data__ = 0;
			}
		}
		else if ($(allCharts[i]).hasClass("scatter")) {
			d3.select(allCharts[i]).selectAll(".scatter-point")
			.transition().duration(500)
			.attr("fill",function (d,index) {
				return "#333333";
			})
		}
		else if ($(allCharts[i]).hasClass("stacked")) {
			d3.select(allCharts[i]).selectAll(".stackedBrushedRect")
			.transition().duration(500)
			.attr("width",0)
		}
	}

	window.brushSettings[sID] = null;
}

function responseMatch(responseChk,response,resptype) {
	if (responseChk == null) return false;
	var matched = false;
	if (resptype == "ranking") {
		//console.log(responseChk+" "+response)
		if (responseChk == null) return;
		if (responseChk[0] == response) {
			matched = true;
			//console.log("matched")
		}
	}
	else if (response instanceof Object) {
		if (response["lobound"] == "-Infinity") {
			if (responseChk <= response["upbound"]) matched = true;
		}
		else {
			if (responseChk <= response["upbound"] & responseChk > response["lobound"]) matched = true;
		}
	}
	else {
		if (responseChk instanceof Array) {
			for (var i=0; i<responseChk.length; i++) if (responseChk[i] == response) matched = true;
		}
		else{
			if (responseChk == response) matched = true;
		}
	}
	return matched;
}
