function resizeQueryElements(){
    var allQueryCharts = $(".query-chart");
    var qcID,qID;
    for (var i=0; i<allQueryCharts.length; i++) {
        //console.log($(allQueryCharts[i]).hasClass("heatmap"))
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("barchart")) {
            qcID = $(allQueryCharts[i]).attr("qcID");
            qID = $(allQueryCharts[i]).find(".chart-container").attr("qID");
            console.log(qcID+" "+qID);
            resizeRect(qcID,qID,"query");
            resizeRect(qcID,qID,"query");
        }
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("heatmap")) {
            //console.log("heatmap");
            var allCells = $(allQueryCharts[i]).find("rect");
            for (var j=0; j<allCells.length; j++) $(allCells[j]).attr("width",$(allCells[j]).parent().width());
            //console.log(allCells.parent().width())
            //allCells.attr("width",allCells.parent().width());
            // var allText = $(allQueryCharts[i]).find("text");
            // for (var j=0; j<allText.length; j++) {
            //     fitWordingLength($(allText[j]),$(allText[j]).parent(),3,$(allText[i]).attr("direction"));
            // }
            d3.select(allQueryCharts[i]).selectAll("text")
            .text(function(d){return d;})
            .text(function(d){return fitWordingLength($(this),$(this).parent(),3,$(this).attr("direction"));})
            .append("title").text(function(d){return d;});
        }
    }
}