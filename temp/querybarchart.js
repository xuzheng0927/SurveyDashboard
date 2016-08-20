query_barchart_class = "col-lg-8 col-md-8 col-sm-11 col-xs-11";

function createQueryBarchart(qcID) {
	$("#query-chart"+qcID+" .chart-container").remove();
	//console.log($("#query-chart"+qcID+" .chart-container"));
	var sID = window.sID;
	var qID = $("#query-chart"+qcID+" .question-selector").val();

	if (qID.length == 1) {
		var RespType = surveyDataTable[sID][1][qID[0]];

		if (RespType != "Open-Ended Response") {
			$("#query-chart"+qcID).append($('<div class="chart-container '+query_barchart_class+'" style="margin:20px" qID='+qID+'></div>'))
			$("#query-chart"+qcID+" .chart-container").addClass("barchart");
			createBarChart(qcID,qID,sID,RespType,"query");
			//console.log($("#query-chart"+qcID+" .chart-container"));
			// $("#query-chart"+qcID+" .chart-container").resize(function(){
			// 	console.log("resized");
			// 	resizeRect(qcID,qID,"query");
			// })
		}
		else createQueryEmpty(qcID);
	}
}