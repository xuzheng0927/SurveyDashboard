function createFullResponses(pID, qID, sID, ChartType) {
    if (ChartType == "query") {
        var qcID = pID;
        $("#query-chart"+qcID+" .panel .chart-container").remove();

        $("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+query_chart_class+'" style="margin:0px;height:184px;border-top-style:solid;border-top-width:1px" qID='+qID+'></div>'))
        //$("#query-chart"+qcID+" .chart-container").addClass("barchart");
        var currentContainer = $("#query-chart"+qcID+" .chart-container");
        $("#query-chart"+qcID).css("height",parseInt($("#query-chart"+qcID+" .question-area").css("height"))+200+"px");
        $("#query-chart"+qcID+" .panel").css("height","100%");
    }
	else var currentContainer = $("#panel"+pID+"-sm"+qID+" .chart-container");
	currentContainer.attr("sID",sID);
	//var currentChart = $('<div class="col-lg-12 resp-text chart no-drag" sID='+sID+' qID='+qID+' style="height:100%; overflow-y:auto"></div>');
	//currentContainer.append(currentChart);
	currentContainer.addClass("resp-text").css("overflow-y","auto");

	var currentResponseNum = surveyDataTable[sID].length;

	for (var i=2; i<currentResponseNum;i++){
        newText = surveyDataTable[sID][i][qID];
        if (newText.length > 0){
            currentContainer.append("<div class='response-pri' rID="+i+"><p>"+newText+"</p><br></div>");
        }
    }

    currentContainer.append("<hr style='display:none'></hr>");
    for (var i=2; i<currentResponseNum;i++){
        newText = surveyDataTable[sID][i][qID];
        if (newText.length > 0){
            currentContainer.append("<div class='response-sec' style='color:#AAAAAA; display:none' rID="+i+"><p>"+newText+"</p><br></div>");
        }
    }

    if (ChartType != "query") adjustSMPanelSize(qID);
}