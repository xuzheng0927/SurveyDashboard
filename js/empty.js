function createQueryEmpty(qcID){
	$("#query-chart"+qcID+" .panel .chart-container").remove();
	$("#query-chart"+qcID+" .panel").append($('<div class="chart-container '+panelsDOM.getDOMConstants().full_width_class+'" qID1='+qID[0]+' qID2='+qID[1]+'></div>'));

	$("#query-chart"+qcID).find(".chart-container").append($("<svg style='width:100%;height:40px'></svg>"));
	//$("#query-chart"+qcID).find("svg").append($("<text font-size=20>No available chart</text>"));
	d3.select($("#query-chart"+qcID+" svg")[0]).selectAll("text")
	.data([0])
	.enter()
	.append("text")
	.attr("fill","#888888")
	.attr("x",0)
	.attr("y",20)
	.text(function (){
		//console.log($("#query-chart"+qcID+" .question-selector").val());
		if ($("#query-chart"+qcID+" .question-selector").val() != null) return "No available chart";
		else return "No question selected";
	});

	var quest_height = 54;
	var con_height = 80;
	//console.log(quest_height+" "+con_height)
	$("#query-chart"+qcID).css("height",quest_height+con_height+20);
	$("#query-chart"+qcID+" .panel").css("height","100%");
}