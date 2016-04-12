function brushAllCharts(sID,qID,response,panel,clickedbar,resptype) {
	if ((window.brushSettings[sID] instanceof Object) == false) window.brushSettings[sID] = new Object();
	window.brushSettings[sID] = {"qID":qID,"response":response,"clickedbar":clickedbar,"resptype":resptype};
	// if (window.brushSettings[sID]["clickedbar"] instanceof Object) clickedbar = window.brushSettings[sID]["clickedbar"];
	// else window.brushSettings[sID]["clickedbar"] = clickedbar;

	if (panel instanceof Object) {
		var allCharts = panel.find(".chart-container");
	}
	else var allCharts = $(".chart-container");
	var currentAllTotalRects;
	var currentAllBrushedRects;
	var newWidth, newHeight;
	var tempResp;
	//console.log(clickedbar);

	for (var i=0; i<allCharts.length; i++) {
		//if ($(allCharts[i]).attr("sID") != sID) continue;
		//console.log($(allCharts[i]).parent().parent());

		if ($(allCharts[i]).parent().parent().hasClass("sm-barchart") | $(allCharts[i]).hasClass("barchart")) {
			//console.log($(allCharts[i]).find("rect"));
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			var brushedNums = new Array();
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;
			//console.log(currentAllTotalRects);

			for (var j=2; j<surveyDataTable[sID].length; j++){
				//if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;
				if (!responseMatch(j,qID,response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					if (resptype == "ranking" & qID.length == 1 & currentAllTotalRects[r].getAttribute("qID") == qID[0]) continue;
					if (currentAllTotalRects[r].getAttribute("qID") == qID[0] & qID.length == 1
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
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (resptype != "scatter") {
					if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];
				}
				newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
				//console.log(currentAllBrushedRects[r]);
				//console.log(newWidth);
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
					return getBrushedTitle(brushedNums[r],qID,response,resptype);
					// if (resptype == "histogram") {
					// 	return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID[0];
					// }
					// else if (resptype == "ranking") {
					// 	return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID[0];
					// }
					// else if (resptype == "scatter") {
					// 	return brushedNums[r]+' response >='+response.ylobound+" and <="+response.yupbound+" in "+qID[0]+", >="+response.xlobound+" and <="+response.xupbound+" in "+qID[1];
					// }
					// else return brushedNums[r]+' response "'+response+'" in '+qID[0];
				});

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
		else if ($(allCharts[i]).parent().parent().hasClass("sm-text") | $(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			//console.log(currentAllRespText);
			$(allCharts[i]).find("hr").show("slow");
			for (var r=0; r<currentAllRespTextPri.length; r++) {
				// if (!responseMatch(surveyDataTable[sID][$(currentAllRespTextPri[r]).attr("rID")][qID],response,resptype)) {
				// 	$(currentAllRespTextPri[r]).hide("slow").animate({color:"#337CB7"});
				// }
				// else {
				// 	$(currentAllRespTextPri[r]).attr("title",'Response "'+response+'" in '+qID);
				// 	$(currentAllRespTextPri[r]).show("slow").animate({color:"#337CB7"});
				// }

				if (!responseMatch($(currentAllRespTextPri[r]).attr("rID"),qID,response,resptype)) {
					$(currentAllRespTextPri[r]).hide("slow").animate({color:"#337CB7"});
				}
				else {
					$(currentAllRespTextPri[r]).attr("title",function(){
						return getBrushedTitle(null,qID,response,resptype);
						// if (resptype == "histogram") {
						// 	return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID[0];
						// }
						// else if (resptype == "ranking") {
						// 	return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID[0];
						// }
						// else if (resptype == "scatter") {
						// 	return brushedNums[r]+' response >='+response.ylobound+" and <="+response.yupbound+" in "+qID[0]+", >="+response.xlobound+" and <="+response.xupbound+" in "+qID[1];
						// }
						// else return brushedNums[r]+' response "'+response+'" in '+qID[0];
					});
					$(currentAllRespTextPri[r]).show("slow").animate({color:"#337CB7"});
				}
			}

			for (var r=0; r<currentAllRespTextSec.length; r++) {
				// if (responseMatch(surveyDataTable[sID][$(currentAllRespTextSec[r]).attr("rID")][qID],response,resptype)) {
				// 	$(currentAllRespTextSec[r]).hide("slow");
				// }
				// else {
				// 	//$(currentAllRespTextSec[r]).attr("title",'Response "'+response+'" in '+qID);
				// 	$(currentAllRespTextSec[r]).show("slow");
				// }

				if (responseMatch($(currentAllRespTextSec[r]).attr("rID"),qID,response,resptype)) {
					$(currentAllRespTextSec[r]).hide("slow");
				}
				else {
					//$(currentAllRespTextSec[r]).attr("title",'Response "'+response+'" in '+qID);
					$(currentAllRespTextSec[r]).show("slow");
				}
			}
		}
		// else if ($(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
		// 	currentAllTotalRects = $(allCharts[i]).find(".totalRect");
		// 	currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
		// 	var brushedNums = new Array();
		// 	var tempUpBound, tempLoBound;
		// 	for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

		// 	for (var j=2; j<surveyDataTable[sID].length;j++) {
		// 		//if (surveyDataTable[sID][j][qID] != response) continue;
		// 		if (!responseMatch(surveyDataTable[sID][j][qID],response)) continue;

		// 		for (var r=0; r<currentAllTotalRects.length; r++){
		// 			tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];
		// 			tempUpBound = currentAllTotalRects[r].getAttribute("upbound");
		// 			tempLoBound = currentAllTotalRects[r].getAttribute("lobound");
		// 			if (tempLoBound == "-Infinity") {
		// 				if (parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
		// 			}
		// 			else {
		// 				if (parseFloat(tempResp) > parseFloat(tempLoBound) & parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
		// 			}
		// 		}
		// 	}

		// 	for (var r=0; r<currentAllBrushedRects.length; r++){
		// 		if (currentAllTotalRects[r].__data__ == 0) continue;
		// 		if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];

		// 		newWidth = $(currentAllTotalRects[r]).attr("width") / currentAllTotalRects[r].__data__ * brushedNums[r];
		// 		d3.select(currentAllBrushedRects[r])
		// 		.attr("brushed","true")
		// 		.transition().duration(500)
		// 		.attr("width",newWidth)
		// 		.attr("stroke-width",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return 2;
		// 			else return 1;
		// 		})
		// 		.attr("stroke",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return "cyan";
		// 			else return "black";
		// 		})
		// 		.attr("fill-opacity",function(){
		// 			if (currentAllTotalRects[r] == clickedbar) return 0.7;
		// 			else return 1;
		// 		})
		// 		.selectAll("title")
		// 		.text(function(){
		// 			if (response instanceof Object) {
		// 				return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
		// 			}
		// 			else return brushedNums[r]+' response "'+response+'" in '+qID;
		// 		});

		// 		currentAllBrushedRects[r].__data__ = brushedNums[r]
		// 	}
		// }
		else if ($(allCharts[i]).hasClass("histogram") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
			currentAllTotalRects = $(allCharts[i]).find(".totalHistRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedHistRect");
			var brushedNums = new Array();
			var tempUpBound, tempLoBound;
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

			for (var j=2; j<surveyDataTable[sID].length;j++) {
				//if (surveyDataTable[sID][j][qID] != response) continue;
				// if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;
				if (!responseMatch(j,qID,response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					tempResp = surveyDataTable[sID][j][currentAllTotalRects[r].getAttribute("qID")];
					tempUpBound = currentAllTotalRects[r].getAttribute("upbound");
					tempLoBound = currentAllTotalRects[r].getAttribute("lobound");
					if (parseFloat(tempResp) > parseFloat(tempLoBound) & parseFloat(tempResp) <= parseFloat(tempUpBound)) brushedNums[r] += 1;
				}
			}

			for (var r=0; r<currentAllBrushedRects.length; r++){
				if (currentAllTotalRects[r].__data__.value == 0) continue;
				if (resptype != "scatter") {
					if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];
				}

				newHeight = $(currentAllTotalRects[r]).attr("height") / currentAllTotalRects[r].__data__.value * brushedNums[r];
				oldHeight = $(currentAllBrushedRects[r]).attr("height");

				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("height",newHeight)
				.attr("y",function(d) {
					//console.log($(this).attr("y") - newHeight + oldHeight);
					//return $(this).attr("y") + oldHeight - newHeight;
					return parseInt($(currentAllTotalRects[r]).attr("y")) + parseInt($(currentAllTotalRects[r]).attr("height")) - newHeight;
				})
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
					// if (resptype == "histogram") {
					// 	return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID[0];
					// }
					// else return brushedNums[r]+' response "'+response+'" in '+qID[0];
					return getBrushedTitle(brushedNums[r],qID,response,resptype);

					// if (resptype == "histogram") {
					// 	return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID[0];
					// }
					// else if (resptype == "ranking") {
					// 	return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID[0];
					// }
					// else if (resptype == "scatter") {
					// 	return brushedNums[r]+' response >='+response.ylobound+" and <="+response.yupbound+" in "+qID[0]+", >="+response.xlobound+" and <="+response.xupbound+" in "+qID[1];
					// }
					// else return brushedNums[r]+' response "'+response+'" in '+qID[0];
				});

				//currentAllBrushedRects[r].__data__ = {"value":brushedNums[r],"min":currentAllTotalRects[r].__data__.min,"max":currentAllTotalRects[r].__data__.max};
				currentAllBrushedRects[r].__data__ = new Object();
				currentAllBrushedRects[r].__data__.value = brushedNums[r];
				currentAllBrushedRects[r].__data__.min = currentAllTotalRects[r].__data__.min;
				currentAllBrushedRects[r].__data__.max = currentAllTotalRects[r].__data__.max;
				//console.log(currentAllTotalRects[r].__data__);
			}
		}
		else if ($(allCharts[i]).hasClass("scatter") | $(allCharts[i]).hasClass("correlation")) {
			var currentScatter = $(allCharts[i]).find(".scatterplot");

			d3.select(allCharts[i]).selectAll(".scatter-point")
			.attr("fill",function (d,index) {
				// if (responseMatch(surveyDataTable[sID][$(this).attr("index")][qID],response,resptype)) {
				// 	return "cyan";
				// }
				//if ($(this).attr("index") == undefined) console.log(this);
				if (responseMatch($(this).attr("index"),qID,response,resptype)) {
					if (equalArrays([currentScatter.attr("qID1"),currentScatter.attr("qID2")],qID)) return "#00bbff";
					else return "#00dddd";
				}
				else return "#333333";
			})
			.attr("stroke",function() {
				if (responseMatch($(this).attr("index"),qID,response,resptype)) {
					if (equalArrays([currentScatter.attr("qID1"),currentScatter.attr("qID2")],qID)) return "cyan";
					else return "black";
				}
				else return "black";
			})
			.attr("stroke-width",function() {
				if (responseMatch($(this).attr("index"),qID,response,resptype)) {
					if (equalArrays([currentScatter.attr("qID1"),currentScatter.attr("qID2")],qID)) return 2;
					else return 1;
				}
				else return 1;
			})
			.selectAll("title")
			.text(function(d){
				if (responseMatch($(this).parent().attr("index"),qID,response,resptype)) {
					return getBrushedTitle(1,qID,response,resptype,"point");
				}
				else return $(this).parent().parent().attr("qID1")+"'s answer: "+d.y+"; "+$(this).parent().parent().attr("qID2")+"'s answer: "+d.x;;
			})
		}
		else if ($(allCharts[i]).hasClass("barchart-rank") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-rank")) {
			//console.log(clickedbar.getAttribute("onclick"))
			currentAllTotalRects = $(allCharts[i]).find(".totalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");

			for (var r=0; r<currentAllBrushedRects.length; r++){
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (resptype != "scatter") {
					if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) {
						clickedbar = currentAllTotalRects[r];
						currentAllBrushedRects[r].__data__ = currentAllBrushedRects[r].getAttribute("rank");
					}
					else currentAllBrushedRects[r].__data__ = 0;
				}	

				d3.select(currentAllBrushedRects[r])
				.attr("brushed","true")
				.transition().duration(500)
				.attr("width",function(){
					if (currentAllTotalRects[r] == clickedbar) return currentAllTotalRects[r].getAttribute("width");
					else return 0;
				})
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
				.text(function(d){
					if (resptype == "ranking") {
						var rankastop = 0;
						for (var j=2; j<surveyDataTable[sID].length; j++) {
							if (surveyDataTable[sID][j][qID[0]] == null) continue;
							if (surveyDataTable[sID][j][qID[0]][0] == currentAllBrushedRects[r].getAttribute("response")) rankastop += 1;
						}
						return rankastop+" respondents rank "+currentAllBrushedRects[r].getAttribute("response")+" as No. 1";
					}
					else if (resptype == "histogram") {
						return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					}
					else return brushedNums[r]+' response "'+response+'" in '+qID;
				});
			}
		}
		else if ($(allCharts[i]).hasClass("stacked")) {
			console.log("stacked")
			currentAllTotalRects = $(allCharts[i]).find(".stackedTotalRect");
			currentAllBrushedRects = $(allCharts[i]).find(".stackedBrushedRect");

			var brushedNums = new Array();
			for (var j=0; j<currentAllTotalRects.length;j++) brushedNums[j]=0;

			for (var j=2; j<surveyDataTable[sID].length; j++){
				// if (!responseMatch(surveyDataTable[sID][j][qID],response,resptype)) continue;
				if (!responseMatch(j,qID,response,resptype)) continue;

				for (var r=0; r<currentAllTotalRects.length; r++){
					if (resptype == "ranking" & qID.length == 1 & currentAllTotalRects[r].getAttribute("qID") == qID[0]) continue;
					if (currentAllTotalRects[r].getAttribute("qID") == qID[0] & qID.length == 1
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
				//console.log(currentAllTotalRects[r].getAttribute("onclick"));
				if (resptype != "scatter") {
					if (currentAllTotalRects[r].getAttribute("onclick") == clickedbar.getAttribute("onclick")) clickedbar = currentAllTotalRects[r];
				}
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
					else return "#337CB7";
				})
				.attr("fill","#337CB7")
				.attr("fill-opacity",function(){
					//console.log($(this).siblings(".totalRect").attr("qID"));
					if (currentAllTotalRects[r] == clickedbar) return 0.3;
					else return 0.7;
				})
				.selectAll("title")
				.text(function(){
					return getBrushedTitle(brushedNums[r],qID,response,resptype);
					// if (resptype == "histogram") {
					// 	return brushedNums[r]+' response '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID;
					// }
					// else if (resptype == "ranking") {
					// 	return brushedNums[r]+" respondents rank "+response+" as No. 1 in "+qID;
					// }
					// else return brushedNums[r]+' response "'+response+'" in '+qID;
				});

				currentAllBrushedRects[r].__data__ = brushedNums[r]
			}
		}
	}
}

function clearBrushing(sID) {
	var allCharts = $(".chart-container");

	for (var i=0; i<allCharts.length; i++) {
		//if ($(allCharts[i]).attr("sID") != sID) continue;

		if ($(allCharts[i]).parent().parent().hasClass("sm-barchart") | $(allCharts[i]).hasClass("barchart") |
			$(allCharts[i]).parent().parent().hasClass("sm-barchart-rank") | $(allCharts[i]).hasClass("barchart-rank")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".brushedRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.attr("brushed","false")
				.transition().duration(500)
				.attr("width",0)
				.attr("stroke","black")
				.attr("stroke-width",1)

				currentAllBrushedRects[j].__data__ = 0;
			}
		}
		else if ($(allCharts[i]).parent().parent().hasClass("sm-text") | $(allCharts[i]).hasClass("resp-text")) {
			var currentAllRespTextPri = $(allCharts[i]).find(".response-pri");
			var currentAllRespTextSec = $(allCharts[i]).find(".response-sec");
			currentAllRespTextPri.show("slow").animate({color:"black"});
			currentAllRespTextPri.removeAttr("title");
			currentAllRespTextSec.hide("slow");
			$(allCharts[i]).find("hr").hide("slow");
		}
		else if ($(allCharts[i]).hasClass("histogram") | $(allCharts[i]).parent().parent().hasClass("sm-barchart-num")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".brushedHistRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.attr("brushed","false")
				.transition().duration(500)
				.attr("y",function(d){
					return parseFloat($(this).attr("y")) + parseFloat($(this).attr("height"));
				})
				.attr("height",0)
				.attr("stroke","black")
				.attr("stroke-width",1)

				currentAllBrushedRects[j].__data__ = 0;
			}
		}
		else if ($(allCharts[i]).hasClass("scatter") | $(allCharts[i]).hasClass("correlation")) {
			d3.select(allCharts[i]).selectAll(".scatter-point")
			.transition().duration(500)
			.attr("fill",function (d,index) {
				return "#333333";
			})
			.attr("stroke","black")
			.attr("stroke-width",1)
			.selectAll("title")
			.text(function(d){
				return $(this).parent().parent().attr("qID1")+"'s answer: "+d.y+"; "+$(this).parent().parent().attr("qID2")+"'s answer: "+d.x;
			})
		}
		else if ($(allCharts[i]).hasClass("stacked")) {
			var currentAllBrushedRects = $(allCharts[i]).find(".stackedBrushedRect");
			for (var j=0; j<currentAllBrushedRects.length; j++) {
				d3.select(currentAllBrushedRects[j])
				.transition().duration(500)
				.attr("width",0)
				
				currentAllBrushedRects[j].__data__ = 0;
			}
		}
	}

	window.brushSettings[sID] = null;
}

// function responseMatch(responseChk,response,resptype) {
// 	if (responseChk == null) return false;
// 	var matched = false;
// 	if (resptype == "ranking") {
// 		//console.log(responseChk+" "+response)
// 		//if (responseChk == null) return;
// 		if (responseChk[0] == response) {
// 			matched = true;
// 			//console.log("matched")
// 		}
// 	}
// 	else if (resptype == "histogram") {
// 		if (response["lobound"] == "-Infinity") {
// 			if (responseChk <= response["upbound"]) matched = true;
// 		}
// 		else {
// 			if (responseChk <= response["upbound"] & responseChk > response["lobound"]) matched = true;
// 		}
// 	}
// 	else if (resptype == "scatter") {

// 	}
// 	else {
// 		if (responseChk instanceof Array) {
// 			for (var i=0; i<responseChk.length; i++) if (responseChk[i] == response) matched = true;
// 		}
// 		else{
// 			if (responseChk == response) matched = true;
// 		}
// 	}
// 	return matched;
// }

function responseMatch(respondentID, qID, response, resptype) {
	var matched = true;
	var partly_matched;
	var responseChk;
	for (var i=0; i<qID.length; i++) {
		//console.log(respondentID+" "+qID[i]);
		responseChk = surveyDataTable[window.sID][respondentID][qID[i]];
		if (responseChk == null) return false;

		if (resptype == "ranking") {
			// if (responseChk[0] == response) matched = true;
			matched = (matched & (responseChk[0] == response));
		}
		else if (resptype == "histogram") {
			if (response["lobound"] == "-Infinity") {
				// if (responseChk <= response["upbound"]) matched = true;
				matched = (matched & (responseChk <= response["upbound"]));
			}
			else {
				// if (responseChk <= response["upbound"] & responseChk > response["lobound"]) matched = true;
				matched = (matched & responseChk <= response["upbound"] & responseChk > response["lobound"]);
			}
		}
		else if (resptype == "scatter") {
			if (i == 0) matched = (matched & responseChk <= response["yupbound"] & responseChk >= response["ylobound"]);
			if (i == 1) matched = (matched & responseChk <= response["xupbound"] & responseChk >= response["xlobound"]);
		}
		else {
			if (responseChk instanceof Array) {
				for (var j=0; j<responseChk.length; j++) {
					if (responseChk[j] == response) matched = true;
					//matched = (matched & (responseChk[j] == response));
				}
			}
			else{
				// if (responseChk == response) matched = true;
				matched = (matched & (responseChk == response));
			}
		}
	}
	return matched;
}

function getBrushedTitle(brushedNum,qID,response,resptype,brushedObject) {
	if (brushedObject == "point" | brushedNum == null) var titleHead = "R";
	else var titleHead = brushedNum+" r";

	if (resptype == "histogram") {
		return titleHead+'esponse '+(response.lobound=='-Infinity'?'':'>'+response.lobound+' and')+' <='+response.upbound+' in '+qID[0];
	}
	else if (resptype == "ranking") {
		return titleHead+"espondents rank "+response+" as No. 1 in "+qID[0];
	}
	else if (resptype == "scatter") {
		return titleHead+'esponse >='+response.ylobound+" and <="+response.yupbound+" in "+qID[0]+", >="+response.xlobound+" and <="+response.xupbound+" in "+qID[1];
	}
	else return titleHead+'esponse "'+response+'" in '+qID[0];
}