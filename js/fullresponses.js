function createFullResponses(pID, qID, sID) {
	var currentContainer = $("#panel"+pID+"-sm"+qID+" .chart-container");
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

    adjustSMPanelSize(qID);
}