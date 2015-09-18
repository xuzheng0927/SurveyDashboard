function resizeQueryElements(qcID){
    var allQueryCharts = (qcID > 0 ? $(".query-chart[qcID="+qcID+"]") : $(".query-chart"));
    var qID;
    for (var i=0; i<allQueryCharts.length; i++) {
        //console.log($(allQueryCharts[i]).hasClass("heatmap"))
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("barchart") |
            $(allQueryCharts[i]).find(".chart-container").hasClass("barchart-rank")) {
            //qcID = $(allQueryCharts[i]).attr("qcID");
            qID = $(allQueryCharts[i]).find(".chart-container").attr("qID");
            //console.log(qcID+" "+qID);
            var currentQCID = allQueryCharts[i].getAttribute("qcID");
            resizeRect(currentQCID,qID,"query");
            resizeRect(currentQCID,qID,"query");
        }
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("heatmap")) {
            //console.log("heatmap");
            var qID1 = $(allQueryCharts[i]).find(".chart-container").attr("qID1");
            var currentQCID = $(allQueryCharts[i]).attr("qcID");
            var currentCellHeight = parseFloat($("#qc"+currentQCID+"-q1wording").css("height"));
            var allQ1RespRects = $("#qc"+currentQCID+"-qID1"+qID1+"-row").children();
            var respQ1Num = $(allQ1RespRects[0]).find("svg").children().length - 2;
            // console.log(respQ1Num);
            for (var j=0; j<allQ1RespRects.length; j++) {
                $(allQ1RespRects[j]).find("svg").css("height",currentCellHeight*(respQ1Num+1));
            }
            var allCells = $(allQueryCharts[i]).find("rect");
            //console.log(allCells);
            for (var j=0; j<allCells.length; j++) {
                $(allCells[j]).parent().css("width","100%");
                $(allCells[j]).attr("width",parseInt($(allCells[j]).parent().css("width")));
                //console.log($(allCells[j]).attr("class") == "respQ1Rect");
                if ($(allCells[j]).attr("class") == "respQ1Rect") {
                    //console.log($(allCells[j]).parent().parent().css("height"));
                    $(allCells[j]).attr("height",parseFloat($(allCells[j]).parent().parent().css("height")));
                    //$(allCells[j]).attr("y",($(allCells[j]).index()-1)*currentCellHeight);
                }
                else if ($(allCells[j]).attr("class") == "heatmapCell") {
                    $(allCells[j]).attr("height",parseFloat($(allCells[j]).parent().parent().css("height")));
                    //var newHeight = currentCellHeight;
                    //console.log(newHeight);
                    $(allCells[j]).attr("y",currentCellHeight*($(allCells[j]).index()-1));
                    //d3.select(allCells[j]).attr("y",newHeight);
                }
                // if ($(allCells[j]).attr("class") != "respQ1Rect" & $(allCells[j]).attr("class") != "heatmapCell") {
                else {
                    //console.log(allCells[j])
                    $(allCells[j]).attr("height",$(allCells[j]).parent().height());
                }
            }
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

            // var quest_height = parseInt($(allQueryCharts[i]).find(".question-area").css("height"));
            // var con_height = parseInt($(allQueryCharts[i]).find(".chart-container").css("height"));
            // console.log(quest_height+con_height);
            //var currentQCheight = parseInt($(allQueryCharts[i]).css("height"))
            //$(allQueryCharts[i]).css("height",quest_height+con_height+20+"px");
            $(allQueryCharts[i]).find(".panel").css("padding-bottom","10px");
        }
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("stacked")) {
            d3.select(allQueryCharts[i]).selectAll(".stackedTotalRect")
            .attr("width",function(){
                return parseInt($(this).parent().css("width"))+1;
            })
            .attr("height",function(){
                return parseInt($(this).parent().css("height"))/2;
            })
            .attr("y",function(){
                return parseInt($(this).parent().css("height"))/4;
            });

            d3.select(allQueryCharts[i]).selectAll(".stackedBrushedRect")
            .attr("width",function(d){
                if ($(this).siblings()[0].__data__ == 0) return 0;
                else return d/$(this).siblings()[0].__data__*(parseInt($(this).parent().css("width"))+1);
            })
            // .attr("height",function(){
            //     return parseInt($(this).parent().css("height"))/2;
            // })
            .attr("y",function(){
                return parseInt($(this).parent().css("height"))/6;
            });

            d3.select(allQueryCharts[i]).selectAll(".stackedLegend")
            .attr("width",function(){
                return parseInt($(this).parent().css("width"))/2;
            })
            .attr("height",function(){
                return parseInt($(this).parent().css("width"))/2;
            })
            .attr("y",function(){
                return parseInt($(this).parent().css("height"))/2 - parseInt($(this).parent().css("width"))/4;
            })

            d3.select(allQueryCharts[i]).selectAll("text")
            .text(function(d){return d;})
            .text(function(d){return fitWordingLength($(this),$(this).parent(),3,$(this).attr("direction"));})
            .append("title").text(function(d){return d;});
        }
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("scatter") | $(allQueryCharts[i]).find(".chart-container").hasClass("correlation")) {
            var currentContainer = $(allQueryCharts[i]).find(".chart-container");
            if ($(allQueryCharts[i]).find(".chart-container").hasClass("scatter")) {
                var questNum = currentContainer.find(".scatterwording").length;
            }
            else {
                var questNum = currentContainer.find(".correwording").length;
            }
            var conWidth = parseInt(currentContainer.css("width"));
            var conHeight = parseInt(currentContainer.css("height"));
            var marginLeft = parseFloat(currentContainer.attr("marginLeft"));
            var marginRight = parseFloat(currentContainer.attr("marginRight"));
            var marginTop = parseFloat(currentContainer.attr("marginTop"));
            var marginBottom = parseFloat(currentContainer.attr("marginBottom"));
            currentContainer.find(".scatterplot").parent().css("height",conHeight - questNum * wordingHeight);
            currentContainer.find(".scatterplot").css("height","100%");
            if ($(allQueryCharts[i]).find(".chart-container").hasClass("correlation")) {
                currentContainer.find(".correMatrix").parent().css("height",conHeight - questNum * wordingHeight);
                currentContainer.find(".correMatrix").css("height","100%");
            }
            var SVGWidth = parseInt(currentContainer.find(".scatterplot").css("width"));
            var SVGHeight = parseInt(currentContainer.find(".scatterplot").css("height"));
            var xaxisMin = parseFloat(currentContainer.attr("xaxisMin"));
            var xaxisMax = parseFloat(currentContainer.attr("xaxisMax"));
            var yaxisMin = parseFloat(currentContainer.attr("yaxisMin"));
            var yaxisMax = parseFloat(currentContainer.attr("yaxisMax"));
            var markNum = parseInt(currentContainer.attr("markNum"));
            var scHeight = SVGHeight * (1 - marginBottom - marginTop);
            var scWidth = SVGWidth * (1 - marginLeft - marginRight);

            d3.select(allQueryCharts[i]).selectAll(".scatter-xaxis")
            .attr("x1",SVGWidth * marginLeft)
            .attr("x2",SVGWidth * (1 - marginRight))
            .attr("y1",SVGHeight * (1 - marginBottom))
            .attr("y2",SVGHeight * (1 - marginBottom))

            d3.select(allQueryCharts[i]).selectAll(".scatter-yaxis")
            .attr("x1",SVGWidth * marginLeft)
            .attr("x2",SVGWidth * marginLeft)
            .attr("y1",SVGHeight * marginTop)
            .attr("y2",SVGHeight * (1 - marginBottom))

            d3.select(allQueryCharts[i]).selectAll(".scatter-point")
            .attr("cx",function(d){
                return SVGWidth * marginLeft + (d.x - xaxisMin) / (xaxisMax - xaxisMin) * scWidth;
            })
            .attr("cy",function(d){
                return scHeight - (d.y - yaxisMin) / (yaxisMax - yaxisMin) * scHeight + SVGHeight * marginTop;
            })

            d3.select(allQueryCharts[i]).selectAll(".yMark")
            .attr("x",function(d,i) {
                if (i == markNum) return SVGWidth * 0.01;
                else return marginLeft * SVGWidth * 0.95;
            })
            .attr("y",function(d,i){
                if (i == markNum){
                    return marginTop * SVGHeight * 0.9;
                }
                else {
                    return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * scHeight;
                }
            });

            d3.select(allQueryCharts[i]).selectAll(".xMark")
            .attr("y",function(d,i) {
                if (i == markNum) return (1 - marginBottom) * SVGHeight * 0.99;
                else return (1 - marginBottom) * SVGHeight * 1.08;        
            })
            .attr("x",function(d,i){
                if (i == markNum){
                    return (1 - marginRight) * SVGWidth * 1.02;
                }
                else {
                    return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * scWidth;
                }
            });

            if ($(allQueryCharts[i]).find(".chart-container").hasClass("scatter")) {
                var textClass = ".scatterwording text";
            }
            else {
                var textClass = ".correwording text";
            }

            d3.select(allQueryCharts[i]).selectAll(textClass)
            .text(function(d){return d;})
            .text(function(d){return fitWordingLength($(this),$(this).parent(),3);})
            .append("title").text(function(d){return d;});

            if ($(allQueryCharts[i]).find(".chart-container").hasClass("correlation")) {
                var currentCorrSVG = $("#query-chart"+qcID+" .correMatrix");
                var gridWidth = (conWidth-10)/(questNum+1)/2;
                var gridHeight = (conHeight-questNum*wordingHeight)/(questNum+1);
                var correMaxMin = {"max":currentCorrSVG.attr("correMax"),"min":currentCorrSVG.attr("correMin")};

                d3.select(allQueryCharts[i]).selectAll(".correGrid")
                .attr("x",function(d){
                    return d.x * gridWidth;
                })
                .attr("y",function(d){
                    return d.y * gridHeight;
                })
                .attr("width", gridWidth - 1)
                .attr("height", gridHeight)

                d3.select(currentCorrSVG[0]).selectAll(".correMatrixWording")
                .attr("x", function(d,i) {
                    if (i < questNum) return (i+1+0.1)*gridWidth;
                    else return 0.1*gridWidth;
                })
                .attr("y", function(d,i) {
                    if (i < questNum) return 0.5*gridHeight;
                    else return (i+1-questNum+0.5)*gridHeight;
                })
            }

            $(allQueryCharts[i]).find(".panel").css("padding-bottom","10px");
        }
        if ($(allQueryCharts[i]).find(".chart-container").hasClass("histogram")){
            var currentContainer = $(allQueryCharts[i]).find(".chart-container");
            var markNum = 6;

            var conWidth = parseInt(currentContainer.css("width"));
            var conHeight = parseInt(currentContainer.css("height"));
            var marginLeft = parseFloat(currentContainer.attr("marginLeft"));
            var marginRight = parseFloat(currentContainer.attr("marginRight"));
            var marginTop = parseFloat(currentContainer.attr("marginTop"));
            var marginBottom = parseFloat(currentContainer.attr("marginBottom"));

            var SVGWidth = parseInt(currentContainer.find(".histChart").css("width"));
            var SVGHeight = parseInt(currentContainer.find(".histChart").css("height"));
            var xaxisMin = parseFloat(currentContainer.attr("xaxisMin"));
            var xaxisMax = parseFloat(currentContainer.attr("xaxisMax"));
            var yaxisMin = parseFloat(currentContainer.attr("yaxisMin"));
            var yaxisMax = parseFloat(currentContainer.attr("yaxisMax"));
            var histHeight = SVGHeight * (1 - marginBottom - marginTop);
            var histWidth = SVGWidth * (1 - marginLeft - marginRight);

            d3.select(allQueryCharts[i]).selectAll(".scatter-xaxis")
            .attr("x1",SVGWidth * marginLeft)
            .attr("x2",SVGWidth * (1 - marginRight))
            .attr("y1",SVGHeight * (1 - marginBottom))
            .attr("y2",SVGHeight * (1 - marginBottom))

            d3.select(allQueryCharts[i]).selectAll(".scatter-yaxis")
            .attr("x1",SVGWidth * marginLeft)
            .attr("x2",SVGWidth * marginLeft)
            .attr("y1",SVGHeight * marginTop)
            .attr("y2",SVGHeight * (1 - marginBottom))

            d3.select(allQueryCharts[i]).selectAll(".yMark")
            .attr("y",function(d,index) {
                if (index == markNum) return SVGWidth * 0.03;
                else return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
            })
            .attr("x",function(d,index){
                if (index == markNum){
                    //return (marginBottom - 1) * SVGHeight;
                    return  SVGHeight * (-0.5);
                }
                else {
                    return marginLeft * SVGWidth * 0.95;;
                }
            });

            d3.select(allQueryCharts[i]).selectAll(".xMark")
            .attr("y",function(d,index) {
                if (index == markNum) return (1 - marginBottom) * SVGHeight * 0.99;
                else return (1 - marginBottom) * SVGHeight * 1.08;            
            })
            .attr("x",function(d,index){
                if (index == markNum){
                    return (1 - marginRight) * SVGWidth * 1.02;
                }
                else {
                    return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
                }
            });

            d3.select(allQueryCharts[i]).selectAll(".totalHistRect")
            .attr("x",function(d) {
                return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
            })
            .attr("y", function(d) {
                return SVGHeight * (1 - marginBottom) - (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
            })
            .attr("width", function(d) {
                return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
            })
            .attr("height", function(d) {
                return (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
            });

            d3.select(allQueryCharts[i]).selectAll(".brushedHistRect")
            .attr("x",function(d) {
                //console.log(d);
                //return SVGWidth * marginLeft + (this.getAttribute("lobound") - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
                return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
            })
            .attr("height", function(d) {
                if ($(this).attr("brushed") == "true") return (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
                else return 0;
            })
            .attr("y", function(d) {
                return SVGHeight * (1 - marginBottom) - $(this).attr("height");
            })
            .attr("width", function(d) {
                //return (this.getAttribute("upbound") - this.getAttribute("lobound")) / (xaxisMax - xaxisMin) * histWidth;
                return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
            })
            //.attr("height",function(d){})
        }
    }
}

function resizeOverviewHistogram(cID, qID) {
    var currentContainer = $("#panel0-sm"+qID).find(".chart-container");
    var markNum = 6;

    var conWidth = parseInt(currentContainer.css("width"));
    var conHeight = parseInt(currentContainer.css("height"));
    var marginLeft = parseFloat(currentContainer.attr("marginLeft"));
    var marginRight = parseFloat(currentContainer.attr("marginRight"));
    var marginTop = parseFloat(currentContainer.attr("marginTop"));
    var marginBottom = parseFloat(currentContainer.attr("marginBottom"));

    var SVGWidth = parseInt(currentContainer.find(".histChart").css("width"));
    var SVGHeight = parseInt(currentContainer.find(".histChart").css("height"));
    var xaxisMin = parseFloat(currentContainer.attr("xaxisMin"));
    var xaxisMax = parseFloat(currentContainer.attr("xaxisMax"));
    var yaxisMin = parseFloat(currentContainer.attr("yaxisMin"));
    var yaxisMax = parseFloat(currentContainer.attr("yaxisMax"));
    var histHeight = SVGHeight * (1 - marginBottom - marginTop);
    var histWidth = SVGWidth * (1 - marginLeft - marginRight);

    d3.select(currentContainer[0]).selectAll(".scatter-xaxis")
    .attr("x1",SVGWidth * marginLeft)
    .attr("x2",SVGWidth * (1 - marginRight))
    .attr("y1",SVGHeight * (1 - marginBottom))
    .attr("y2",SVGHeight * (1 - marginBottom))

    d3.select(currentContainer[0]).selectAll(".scatter-yaxis")
    .attr("x1",SVGWidth * marginLeft)
    .attr("x2",SVGWidth * marginLeft)
    .attr("y1",SVGHeight * marginTop)
    .attr("y2",SVGHeight * (1 - marginBottom))

    d3.select(currentContainer[0]).selectAll(".yMark")
    .attr("y",function(d,index) {
        if (index == markNum) return SVGWidth * 0.03;
        else return (1 - marginBottom) * SVGHeight - (d - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
    })
    .attr("x",function(d,index){
        if (index == markNum){
            //return (marginBottom - 1) * SVGHeight;
            return  SVGHeight * (-0.5);
        }
        else {
            return marginLeft * SVGWidth * 0.95;;
        }
    })
    .attr("font-size",function(d,index) {
        if (histHeight >= 150 & histWidth >= 320) return 15;
        else {
            if (index == 0 | index == markNum - 1) return 8;
            else return 0;
        }
    });

    d3.select(currentContainer[0]).selectAll(".xMark")
    .attr("y",function(d,index) {
        if (index == markNum) return (1 - marginBottom) * SVGHeight * 0.99;
        else return (1 - marginBottom) * SVGHeight * 1.08;            
    })
    .attr("x",function(d,index){
        if (index == markNum){
            return (1 - marginRight) * SVGWidth * 1.02;
        }
        else {
            return marginLeft * SVGWidth + (d - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
        }
    })
    .attr("font-size",function(d,index) {
        if (histWidth >= 320) return 15;
        else {
            if (index == 0 | index == markNum - 1) return 8;
            else return 0;
        }
    });

    d3.select(currentContainer[0]).selectAll(".totalHistRect")
    .attr("x",function(d) {
        return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
    })
    .attr("y", function(d) {
        return SVGHeight * (1 - marginBottom) - (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
    })
    .attr("width", function(d) {
        return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
    })
    .attr("height", function(d) {
        return (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
    });

    d3.select(currentContainer[0]).selectAll(".brushedHistRect")
    .attr("x",function(d) {
        //console.log(d);
        //return SVGWidth * marginLeft + (this.getAttribute("lobound") - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
        return SVGWidth * marginLeft + (d.min - xaxisMin) / (xaxisMax - xaxisMin) * histWidth;
    })
    .attr("height", function(d) {
        if ($(this).attr("brushed") == "true") return (d.value - yaxisMin) / (yaxisMax - yaxisMin) * histHeight;
        else return 0;
    })
    .attr("y", function(d) {
        return SVGHeight * (1 - marginBottom) - $(this).attr("height");
    })
    .attr("width", function(d) {
        //return (this.getAttribute("upbound") - this.getAttribute("lobound")) / (xaxisMax - xaxisMin) * histWidth;
        return (d.max - d.min) / (xaxisMax - xaxisMin) * histWidth;
    })
}