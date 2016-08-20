/*function getDataIndex(list) {
	var surveyDataIndex1 = new Array();
	for (var i = 0; i < list.length; i ++){
		surveyDataIndex1[i] = list[i];
	}
	return surveyDataIndex1;
}*/

function getResponseAnswer(json) {
	var responseAnswerList = new Object();
	for (q in json[1]) {
		//console.log(q);
		if (json[1][q] == "Open-Ended Response"){
			responseAnswerList[q] = null;
		}
		else if (json[1][q] == "Response" | json[1][q] == "Multiple Responses") {
			responseAnswerList[q] = new Array();
			answerCount = 0;
			for (var i = 2; i < json.length; i++) {
				if (responseAnswerList[q].length == 0){
					if (json[i][q] instanceof Array == true) {
						for (var r = 0; r < json[i][q].length; r++){
							responseAnswerList[q][r] = json[i][q][r];
						}
						answerCount = json[i][q].length;
					}
					else {
						responseAnswerList[q][0] = json[i][q];
						answerCount = 1;
					}
				}
				else {
					if (json[i][q] instanceof Array == true) {
						for (var r = 0; r < json[i][q].length; r++){
							newAnswer = true;
							answerCount = responseAnswerList[q].length;
							for (var j = 0; j < answerCount; j++){
								if (json[i][q][r] == responseAnswerList[q][j] | json[i][q][r]=="" | json[i][q]==null){
									newAnswer = false;
									break;
								}
							}
							if (newAnswer == true) {
								responseAnswerList[q][answerCount] = json[i][q][r];
							}
						}
					}
					else {
						newAnswer = true;
						answerCount = responseAnswerList[q].length;
						//console.log("current answers:"+answerCount);
						for (var j = 0; j < answerCount; j++){
							//console.log(j);
							if (json[i][q] == responseAnswerList[q][j] | json[i][q]=="" | json[i][q]==null) {
								newAnswer = false;
								break;
							}
						}
						if (newAnswer == true) {
							responseAnswerList[q][answerCount] = json[i][q];
						}
					}
					
					//console.log(responseAnswerList);
				}
			}
			/*responseAnswerList[q][1] = json[2][q];
			answerCount = 1;
			for (var i = 0; i < answerCount; i++){
				console.log(i);
				for (var j = 3; j < json.length; j ++){
					if (json[j][q] == responseAnswerList[q][i]) {
						console.log("alredy exist");
						break;
					}
					responseAnswerList[q][i] = json[j][q];
					break;
				}
			}*/
		}
		else if (json[1][q] == "Numeric"){ // Numeric attributes
			responseAnswerList[q] = new Array();
			var binNum = 5;
			var fullArray = new Array();
			for (var i=2; i < json.length; i++) {
				//fullArray[i-2] = json[i][q];
				if (json[i][q] != null) fullArray[fullArray.length] = json[i][q];
			}
			var maxInArray = Math.max.apply(null,fullArray);
			var minInArray = Math.min.apply(null,fullArray);
			//console.log(fullArray+" "+maxInArray+" "+minInArray);
			//var binValues = new Array();
			for (var i=0; i < binNum; i++) {
				responseAnswerList[q][i] = minInArray + (maxInArray - minInArray) / binNum * (i+1);
			}
		}
		else if (json[1][q] == "Ranking Response") {
			responseAnswerList[q] = new Array();
			for (var i=2; i < json.length; i++) {
				if (json[i][q] instanceof Array) {
					responseAnswerList[q] = json[i][q];
					break;
				}
			}
		}
		else {

		}
	}
	return responseAnswerList;
}

function getDistinctAnswer(responseAnswerList) {
	var distinctRespList = new Array();
	var isEqual;
	for (q in responseAnswerList) {
		if (responseAnswerList[q] == null) continue;
		if (distinctRespList.length == 0) distinctRespList[0] = responseAnswerList[q];
		else {
			isEqual = true;
			for (var i=0; i<distinctRespList.length; i++) {
				if (equalArrays(responseAnswerList[q],distinctRespList[i])) isEqual = false;
			}
			if (isEqual == true) {
				distinctRespList[distinctRespList.length] = responseAnswerList[q];
			}
		}
	}
	return distinctRespList;
}