function brushAllCharts(pID,sID,qID,response,panel,clickedbar) {
	if ((window.brushSettings[sID] instanceof Object) == false) window.brushSettings[sID] = new Object();
	window.brushSettings[sID] = {"qID":qID,"response":response,"clickedbar":clickedbar};
	// if (window.brushSettings[sID]["clickedbar"] instanceof Object) clickedbar = window.brushSettings[sID]["clickedbar"];
	// else window.brushSettings[sID]["clickedbar"] = clickedbar;

	if (panel instanceof Object) {
		var allCharts = panel.find(".chart");
	}
	else var allCharts = $(".chart");
	var currentAllTotalRects;
	var currentAllBrushedRects;
	var newWidth;
	var tempResp;

	for (var i=0; i<allCharts.length; i++) {
		if ($(allCharts[i]).attr("sID") != sID) continue;

		if ($(allCharts[i]).hasClass("sm-barchart")) {
			//console.log($(allCharts[i]).find("rect"));
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			var brushedNums = new Array();
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;
			//console.log(currentAllTotalRects);

			for (var j=2; j<surveyDataTable[sID].length; j++){
				if (!responseMatch(surveyDataTable[sID][j][qID],response)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					if (currentAllTotalRects[r].getAttribute("qID") == qID & currentAllTotalRects[r].getAttribute("pID") == pID
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
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
		else if ($(allCharts[i]).hasClass("sm-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			//console.log(currentAllRespText);
			$(allCharts[i]).find("hr").show("slow");
			for (var r=0; r<currentAllRespTextPri.length; r++) {
				if (!responseMatch(surveyDataTable[sID][$(currentAllRespTextPri[r]).attr("rID")][qID],response)) {
					$(currentAllRespTextPri[r]).hide("slow").animate({color:"#337CB7"});
				}
				else {
					$(currentAllRespTextPri[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespTextPri[r]).show("slow").animate({color:"#337CB7"});
				}
			}

			for (var r=0; r<currentAllRespTextSec.length; r++) {
				if (responseMatch(surveyDataTable[sID][$(currentAllRespTextSec[r]).attr("rID")][qID],response)) {
					$(currentAllRespTextSec[r]).hide("slow");
				}
				else {
					//$(currentAllRespTextSec[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespTextSec[r]).show("slow");
				}
			}
		}
		else if ($(allCharts[i]).hasClass("sm-barchart-num")) {
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			var brushedNums = new Array();
			var tempUpBound, tempLoBound;
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

			for (var j=2; j<surveyDataTable[sID].length;j++) {
				//if (surveyDataTable[sID][j][qID] != response) continue;
				if (!responseMatch(surveyDataTable[sID][j][qID],response)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];
					tempUpBound = currentAllTotalRects[r].getAttribute("upbound");
					tempLoBound = currentAllTotalRects[r].getAttribute("lobound");
					if (tempLoBound == "-Infinity") {
						if (parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
					}
					else {
						if (parseFloat(tempResp) > parseFloat(tempLoBound) & parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
					}
				}
			}

			for (var r=0; r<currentAllBrushedRects.length; r++){
				if (currentAllTotalRects[r].__data__ == 0) continue;

				newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("width",newWidth)
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

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}		
	}
}

function clearBrushing(sID) {
	var allCharts = $(".chart");

	for (var i=0; i<allCharts.length; i++) {
		if ($(allCharts[i]).attr("sID") != sID) continue;

		if ($(allCharts[i]).hasClass("sm-barchart") | $(allCharts[i]).hasClass("sm-barchart-num")) {
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
		else if ($(allCharts[i]).hasClass("sm-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			currentAllRespTextPri.show("slow").animate({color:"black"});
			currentAllRespTextPri.removeAttr("title");
			currentAllRespTextSec.hide("slow");
			$(allCharts[i]).find("hr").hide("slow");
		}
	}

	window.brushSettings[sID] = null;
}

function responseMatch(responseChk,response) {
	var matched = false;
	if (response instanceof Object) {
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
