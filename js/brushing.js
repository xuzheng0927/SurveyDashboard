function brushAllCharts(sID,qID,response,panel) {
	if ((window.brushSettings[sID] instanceof Object) == false) window.brushSettings[sID] = new Object();
	window.brushSettings[sID] = {"qID":qID,"response":response};

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
				if (surveyDataTable[sID][j][qID] != response) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
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
				newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition()
				.attr("width",newWidth)
				.selectAll("title")
				.text(brushedNums[r]+' response "'+response+'" in '+qID);

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
		else if ($(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespText = $(allCharts[i]).find(".response");
			for (var r=0; r<currentAllRespText.length; r++) {
				if (surveyDataTable[sID][$(currentAllRespText[r]).attr("rID")][qID] != response) {
					$(currentAllRespText[r]).hide("slow").animate({color:"#337CB7"});
				}
				else {
					$(currentAllRespText[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespText[r]).show("slow").animate({color:"#337CB7"});
				}
			}
		}		
	}
}

function clearBrushing(sID) {
	var allCharts = $(".chart");

	for (var i=0; i<allCharts.length; i++) {
		if ($(allCharts[i]).attr("sID") != sID) continue;

		if ($(allCharts[i]).hasClass("sm-barchart")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.attr("brushed","false")
				.transition()
				.attr("width",0)

				$(currentAllBrushedRects[i]).__data__ = 0;
			}
		}
		else if ($(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespText = $(allCharts[i]).find(".response");
			currentAllRespText.show("slow").animate({color:"black"});
			currentAllRespText.removeAttr("title");
		}
	}

	window.brushSettings[sID] = null;
}