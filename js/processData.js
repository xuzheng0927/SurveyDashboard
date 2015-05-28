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
		else {
			responseAnswerList[q] = new Array();
			answerCount = 0;
			for (var i = 2; i < json.length; i++) {
				if (responseAnswerList[q].length == 0){
					responseAnswerList[q][0] = json[i][q];
					answerCount = 1;
				}
				else {
					newAnswer = true;
					answerCount = responseAnswerList[q].length;
					//console.log("current answers:"+answerCount);
					for (var j = 0; j < answerCount; j++){
						//console.log(j);
						if (json[i][q] == responseAnswerList[q][j] | json[i][q]=="") {
							newAnswer = false;
							break;
						}
					}
					if (newAnswer == true) {
						responseAnswerList[q][answerCount] = json[i][q];
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
	}
	return responseAnswerList;
}