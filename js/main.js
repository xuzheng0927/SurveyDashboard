/**
 * This is where the visualization starts
 * @author xuzheng0927@gmail.com (Xu, Zheng)
 */

//global variables 
var surveyDataIndex = new Array();
var surveyDataTable = new Object();
var surveyResponseAnswer = new Array();

/*d3.csv("../data/csc110.csv",function(data){

            surveyDataTable = data;
});*/

/*d3.json("../data/dataindex.json",function(error,json){
    if (error) {
        return console.warn(error);
    }
    else {
        surveyDataIndex=getDataIndex(json);
        //console.log(surveyDataIndex);

        surveyNum = surveyDataIndex.length;
        console.log(surveyNum);

        for (var i = 0; i < surveyNum; i++){
            d3.json("../data/"+surveyDataIndex[i]+".json",function(e,d){
                if (e) {
                    return console.warn(e);
                }
                else {
                    //console.log(i);
                    var current_SID = surveyDataTable.length;
                    //console.log(i);
                    //surveyDataTable[i] = new Object();
                    surveyDataTable[surveyDataIndex[i-1]]=d;
                    //surveyDataTable[i-1]={"Name":surveyDataIndex[i],"Data":d};
                }
            });
        }
        addNewPanel();
    }
});*/

d3.json("../data/SurveyData.json",function(error,json){
    if (error) {
        return console.warn(error);
    }
    else {
        surveyDataIndex = json[0];
        for (i=1;i<json.length;i++) {
            surveyDataTable[i-1] = json[i];
            surveyResponseAnswer[i-1] = getResponseAnswer(json[i]);
        }
    }
    //console.log(surveyDataIndex);
    //console.log(surveyDataTable);
    console.log(surveyResponseAnswer);
    addNewPanel();
});

