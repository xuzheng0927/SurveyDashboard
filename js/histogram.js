/**
 * @fileoverview This is the code for creating histograms
 * Call creatHistogram(fTable,KPISelections) to creat timelines
 * @author liuchenyi77@gmail.com (Chenyi Liu)
 */

/** create grids for the selected panel
 * @para {number} num An interger of the number of selected KPIs
 */
function creatHistogramGrid(num){
    var Colomn=[];
    if (num <= 4){
        for(var i = 0; i < num ; i++){
            Colomn.push($('<div class="col-xs-3" id="subchart'+window.currentID+'_'+i+'">'));
        }
    }
    else {
        for(var i = 0; i < num ; i++){
            Colomn.push($('<div class="col-xs-2" id="subchart'+window.currentID+'_'+i+'">'));
        }
    }

    $("#chart"+window.currentID).children().remove();
    //append all the grid to the current panel
    for (var i = 0; i < num; i++) {
        Colomn[i].appendTo("#chart"+window.currentID);
    }
}
/**
* @para {Array} table The filtered flat table, each line is a testing case
* @para {Array} KPISelection a list of KPI names
*/
function creatHistogram(table,KPISettings){

    var formatCount = d3.format(",.0f");

    var margin = {top: 2, right: 6, bottom: 6, left: 6},
        width = 180 - margin.left - margin.right,
        height = 125 - margin.top - margin.bottom;
    var xScales=[];
    var yScales=[];
    var oData = [];
    for (var i = 0; i < KPISettings.length; i++) {

        var map = table.map(function (d){ return d[KPISettings[i]];});
        var maxV=d3.max(table,function(d){return d[KPISettings[i]];});
        var x = d3.scale.linear()
            .domain([0, maxV])
            .range([0, width]);
        
        // Generate a histogram using 5 uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(x.ticks(6))
            (map);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.y; })])
            .range([height, 0]);

        yScales[i]=y;
        xScales[i]=x;
        oData[i] = data;
        var KPIIndex = i;

        var xAxis = d3.svg.axis()
            .scale(x) 
            .ticks(6)
            .orient("bottom");

        var svg = d3.select("#chart"+window.currentID).select("#subchart"+window.currentID+"_"+i)
            .append("svg")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            // make it resizable
            .attr("viewBox",'0,0,200,140')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            //click on a bar(bucket), 
            //highlight all the other KPIs of the same testings with the KPI falls into the clicked bucket
            .on("click",function(d,i){
                var node = d3.select(this.parentNode.parentNode.parentNode);
                //get rid of the first 10 letters in id, eg subchart1_1
                var KPIIndex = node.attr("id")[10];
                creatLinkedHistogram(d,i,table,KPISettings,yScales,xScales,KPIIndex,oData)
            })
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(data[0].dx) - 1)
            .attr("height", function(d) { return height - y(d.y); });

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", -7)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); });

        bar.append("title").text(function(d,i) { 
                                  var s =d.y.toFixed(0); 
                                  return s; });
        //tilt the label of axis in case it's too long
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
                .style("transform", function(d){ 
                        if( d > 10000){
                            return "rotate(45deg)";
                        }
                    else{
                        return "0";
                    }
                });
        //tilt the label of axis in case it's too long
        svg.selectAll(".x axis text")
            .attr("transform", function(d) {
                return "translate(" + this.getBBox().height * -2 + "," + this.getBBox().height + ")rotate(-45)";
            });
        
        // append the title
        svg.append("text")
            .attr("dy", ".75em")
            .attr("y", 0)
            .attr("x", (width - margin.left - margin.right)/2)
            .text(KPISettings[i]);
    }
}
/**
* @param {object}  clickedBin  A bin object in histogram, it has 3 attributes
*    x - the lower bound of the bin (inclusive).
*    dx - the width of the bin; x + dx is the upper bound (exclusive).
*    y - the count (if frequency is true), or the probability (if frequency is false).
* @param {number} clickedBinNum the index of the bin in histogram
* @param {Array} table An array, the filted table
* @param {Array} KPISettings An array of strings, each string is a KPI name
* @param {Array} yScales A list of y scales of the baseline histogram
* @param {Array} xScales A list of x scales of the baseline histogram
* @param {number} KPIIndex the histogram index of the baseline histograms
* @param {Array} oData An array of histogram objects in baseline histograms
*/
function creatLinkedHistogram(clickedBin,clickedBinNum,table,KPISettings,yScales,xScales,KPIIndex,oData){
    var lowThreshold = clickedBin.x,
        highThreshold = clickedBin.x+clickedBin.dx;

    var formatCount = d3.format(",.0f");
    $('#chart'+window.currentID+' .bHistogram').remove();
    
    var margin = {top: 2, right: 6, bottom: 6, left: 6},
        width = 180 - margin.left - margin.right,
        height = 125 - margin.top - margin.bottom;

    for (var i = 0; i < KPISettings.length; i++) {
        var histogram = oData[i];
        for (var j = 0; j < histogram.length; j++) {
            var bin = histogram[j];
            var count = 0;
            for (var k = 0; k < table.length; k++) {
                var currentKPI = table[k][KPISettings[i]];
                var selectedKPI = table[k][KPISettings[KPIIndex]];
                //item's selected KPI in the range of clicked bin
                if (selectedKPI >= lowThreshold && selectedKPI < highThreshold){
                    //item's current rendering KPI in range of its original bin
                    if(currentKPI >= bin.x && currentKPI < (bin.x+bin.dx))
                        count++;
                }
            }
            oData[i][j].y = count;
            count = 0;
        }
        //  use the previous scales
        var y = yScales[i];
        var x = xScales[i];

        data = oData[i];
        var svg = d3.select("#chart"+window.currentID).select("#subchart"+window.currentID+"_"+i)
            .select("svg")
            .append("g")
            .attr("class","bHistogram")
            // .attr("width", width + margin.left + margin.right)
            // .attr("height", height + margin.top + margin.bottom)
            // make it resizable
            .attr("viewBox",'0,0,200,140')
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.append("rect")
            .attr("class","brushed")
            .attr("x", 1)
            .attr("width", x(data[0].dx) - 1)
            .attr("height", function(d) { return height - y(d.y); });

        bar.append("text")
            .attr("class","brushed")
            .attr("dy", ".75em")
            .attr("y", 2)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .text(function(d) { return formatCount(d.y); });
    }
}