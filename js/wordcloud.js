wordFilterList = ["I","you","he","she","they","it","me","him","her","them","my","your","his","their","yours","theirs","hers",
 					"to","as","a","in","on","of","at","for","is","am","are","the","and","or","that","this","will","would","be"];

wordTrimList = [",",".",":",";","!"];

magnifyPara = 1.3;

function createWordCloud (pID, qID, sID) {
	var responseText;
	var currentSurveyData = surveyDataTable[sID];
	var allText = "";

	for (var i=2; i<currentSurveyData.length; i++) {
		if (currentSurveyData[i][qID].length > 0) {
			allText += currentSurveyData[i][qID]
			allText += " ";
		}
	}
	//console.log(allText);
	var frequencyList = convertToFrqList(allText);
	frequencyList = cutByThreshold(frequencyList,5);
	//console.log(frequencyList);

	$("#panel"+pID+"-sm"+qID+" .chart-container").append($('<svg style="width:100%;height:100%"></svg>'));
	var currentSVGWidth = parseInt($("#panel"+pID+"-sm"+qID+" svg").css("width"));
	var currentSVGHeight = parseInt($("#panel"+pID+"-sm"+qID+" svg").css("height"));
	$("#panel"+pID+"-sm"+qID+" svg").attr("originWidth",currentSVGWidth);
	$("#panel"+pID+"-sm"+qID+" svg").attr("originHeight",currentSVGHeight);

	d3.layout.cloud().size([currentSVGWidth, currentSVGHeight])
	.words(frequencyList)
	.padding(3)
	.rotate(0)
	.font("Impact")
	.fontSize(function(d) {return d.size;})
	.on("end",draw)
	.start();

	function draw(words) {
		d3.select($("#panel"+pID+"-sm"+qID+" svg")[0])
		.append("g")
		.attr("transform", "translate("+(currentSVGWidth/2)+","+(currentSVGHeight/2)+")")
		.selectAll("text")
		.data(words)
		.enter().append("text")
		.style("font-size", function(d) {return d.size + "px";})
		.style("font-family", "Impact")
		.style("fill", "black")
		.attr("text-anchor","middle")
		.attr("transform", function(d) {
			//return "translate(" + [d.x*magnifyPara, d.y*magnifyPara] + ")rotate(" + d.rotate + ")";
			return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
		})
		.text(function(d) { return d.text;})
		.append("title").text(function(d) { return d.text+": "+d.size+" times";});
	}
}

function convertToFrqList (allText) {
	var splitList = new Array();
	var frequencyList = new Array();
	var newWordFound = false;
	var tempWord = "";

	for (var i=0; i<allText.length; i++){
		if (allText[i] != " ") {
			newWordFound = true;
		}
		else {
			newWordFound = false;
			//splitList.concat(tempWord);
			//tempWord = trimWord(tempWord);
			if (trimWord(tempWord).length > 0 & $.inArray(trimWord(tempWord),wordFilterList) == -1) {
				splitList[splitList.length] = trimWord(tempWord);
			}
			//splitList.concat(trimWord(tempWord));
			tempWord = "";
		}

		if (newWordFound == true) {
			tempWord += allText[i];
		}
	}
	//console.log(splitList);
	return getFrequencyList(splitList);
}

function trimWord(word) {
	for (var i=0; i < wordTrimList.length; i++) {
		if (word[word.length-1] == wordTrimList[i]) word = word.substring(0,word.length-1);
	}

	if (word[0] == "'" | word[0] == "(") word = word.substring(1);

	if (word[word.length-1] == "'" | word[0] == ")") word = word.substring(0,word.length-1);

	return word;
}

function getFrequencyList(fullwordList) {
	//var wordArray = new Array();
	//var frequencyArray = new Array();
	var frequencyList = new Array();
	var matchFound;

	for (var i=0; i<fullwordList.length; i++){
		if (frequencyList.length == 0) {
			frequencyList[0] = new Object();
			frequencyList[0]["text"] = fullwordList[0].toLowerCase();
			frequencyList[0]["size"] = 1;
			//wordArray[0] = fullwordList[0].toLowerCase();
			//frequencyArray[0] = 1;
		}
		else {
			matchFound = false;
			for (j=0; j<frequencyList.length; j++){
				// if (fullwordList[i].toLowerCase() == wordArray[j].toLowerCase()) {
				// 	frequencyArray[j] += 1;
				// 	matchFound = true;
				// 	continue;
				// }
				if (fullwordList[i].toLowerCase() == frequencyList[j]["text"].toLowerCase()){
					frequencyList[j]["size"] += 1;
					matchFound = true;
					continue;
				}
			}
			if (matchFound == false) {
				frequencyList[frequencyList.length] = new Object();
				frequencyList[frequencyList.length-1]["text"] = fullwordList[i].toLowerCase();
				frequencyList[frequencyList.length-1]["size"] = 1;
				//wordArray[wordArray.length] = fullwordList[i].toLowerCase();
				//frequencyArray[frequencyArray.length] = 1;
			}
		}
	}

	return frequencyList;
}

function cutByThreshold(List,Threshold) {
	var newList = new Array();
	for (var i=0; i<List.length; i++){
		if (List[i]["size"] >= Threshold) newList[newList.length] = List[i];
	}
	return newList;
}

function resizeCloud(pID, qID) {
	var newWidthRatio = parseInt($("#panel"+pID+"-sm"+qID+" svg").css("width")) / $("#panel"+pID+"-sm"+qID+" svg").attr("originWidth");
	var newHeightRatio = parseInt($("#panel"+pID+"-sm"+qID+" svg").css("height")) / $("#panel"+pID+"-sm"+qID+" svg").attr("originHeight");
	var newRatio = (newWidthRatio < newHeightRatio) ? newWidthRatio : newHeightRatio;
	//console.log(newWidthRatio+" "+newHeightRatio+" "+newRatio);
	//console.log(d3.select($("#panel"+pID+"-sm"+qID+" svg")[0]).selectAll("text"));
	d3.select($("#panel"+pID+"-sm"+qID+" svg")[0]).selectAll("g")
	.attr("transform", "translate("+(parseInt($("#panel"+pID+"-sm"+qID+" svg").css("width"))/2)+","+(parseInt($("#panel"+pID+"-sm"+qID+" svg").css("height"))/2)+")")

	d3.select($("#panel"+pID+"-sm"+qID+" svg")[0]).selectAll("text")
	.transition()
	.style("font-size",function(d){
		return d.size * newRatio + "px";
	})
	.attr("transform", function(d) {
		//return "translate(" + [d.x * magnifyPara * newRatio, d.y * magnifyPara * newRatio] + ")rotate(" + d.rotate + ")";
		return "translate(" + [d.x * newRatio, d.y * newRatio] + ")rotate(" + d.rotate + ")";
	});
}