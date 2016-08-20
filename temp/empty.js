function createQueryEmpty(qcID){
	$("#query-chart"+qcID+" .chart-container").remove();
	$("#query-chart"+qcID).append($('<div class="chart-container col-lg-12" style="margin:20px;" qID1='+qID[0]+' qID2='+qID[1]+'></div>'));

	$("#query-chart"+qcID).find(".chart-container").append($("<svg style='width:100%;height:40px'></svg>"));
	//$("#query-chart"+qcID).find("svg").append($("<text font-size=20>No available chart</text>"));
	d3.select($("#query-chart"+qcID+" svg")[0]).selectAll("text")
	.data([0])
	.enter()
	.append("text")
	.attr("fill","#888888")
	.attr("x",10)
	.attr("y",20)
	.text("No available chart");
}