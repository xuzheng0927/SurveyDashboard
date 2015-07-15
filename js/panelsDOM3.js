// DOM script file for panels3.js

panel_col_class="col-lg-8";
more_panel_col_class="col-lg-3";

// Function to return a panel container DOM with specified ID
function newColumnDOM(ID) {
    return $('<div class="'+panel_col_class+' panel-container ui-widget-content" id="col'+ID+'" style="padding:0px; margin-bottom:5px;" pID='+ID+'></div>');
}

// Function to return a panel container DOM with specified ID, with close button and setting-toggling button
function newPanelDOM(ID) {
	// Panel tag with specified ID
    var DOMstring = '<div class="panel panel-primary chart-panel" id="panel'+ID+'" pID='+ID+' style="padding:0px; margin:0; overflow:hidden; width:100%">';

    // Close button
    DOMstring += '<button type="button" class="close pull-right panel-close" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span></button>';

    // Setting-toggling button
    DOMstring += '<span class="btn pull-left hide-btn" id="panel'+ID+'-hide-btn" style="margin-right:0px;padding-right:0px">';
    DOMstring += '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></span>';

    // Setting-toggling button
    //DOMstring += '<span class="btn pull-left hide-chart-btn" id="panel'+ID+'-hide-chart-btn" style="margin-left:0px;padding-left:5px">';
    //DOMstring += '<span class="glyphicon glyphicon-stats" aria-hidden="true"></span></span>';

    // Panel header and panel close tag
    DOMstring += '<div class="panel-heading panel-primary-heading" style="text-align:center" id="panel'+ID+'-heading">New Panel '+ID+'</div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newSurveyAreaDOM(pID) {
	var DOMstring = '<div class="survey-area col-lg-12 col-sm-12 col-xs-12" id="panel'+pID+'-survey-area" style="padding:5px">';

    // Add survey selector
    DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12" style="padding-left:20px">';
    DOMstring += '<select id="panel'+pID+'-surveyselector"';
    DOMstring += 'class="selectpicker surveyselector vcenter" data-max-options="1" data-live-search="true" ';
    DOMstring += 'data-live-search-placeholder="Search" title="Choose a survey" data-width="80%" data-container="body">';

    // Add in available survey entries
    for (var i = 0; i < surveyDataIndex.length; i ++){
        DOMstring += '<option value = '+i+' title="'+surveyDataIndex[i]+'">'+surveyDataIndex[i]+'</option>';
    }
    DOMstring += '</select></div>';

    // "Add one question button"
    //DOMstring += '<div class="col-lg-2 col-sm-6 col-xs-6 vcenter"><button class="btn btn-primary question-addbtn" style="margin:10px; " ';
    //DOMstring += ' id="panel'+pID+'-addbtn" disabled="disabled" pID='+pID+">Add a question</button></div>";	

    // "Add all questions button"
	//DOMstring += '<div class="col-lg-2 col-sm-6 col-xs-6 vcenter"><button class="btn btn-primary question-addallbtn" style="margin:10px; " ';
    //DOMstring += ' id="panel'+pID+'-addallbtn" disabled="disabled" pID='+pID+">Add all questions</button></div>"; 

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionAreaDOM(pID) {
    var DOMstring = '<div class="col-lg-12 col-md-12 question-area" id="panel'+pID+'-question-area" style="padding:5px"></div>'

    return $(DOMstring);
}

function newQuestionGroupDOM(pID,sID) {
	var DOMstring = '<div class="row question-group" id="panel'+pID+'-select'+sID+'-group" style="padding:5px">';

	//DOMstring += '<div class="row tag-row vcenter" style="margin:10px; padding-left:52px; padding-right:52px"></div>';

    //DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12 tag-row" style="margin:10px; padding-left:60px"></div>';

    DOMstring += '<hr size=5 style="margin-top:0px; margin-bottom:0px;" width="90%" />';

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionSelectorDOM(pID) {
	//var DOMstring = '<div class="col-lg-12 vcenter" style="padding:10px">';

	// Add sub heading
    //var DOMstring = '<div class="col-lg-12 vcenter">Choose a question</div>';

	var DOMstring = '<div class="col-lg-12 col-sm-12 col-xs-12" style="padding-left:20px; padding-top:5px; padding-bottom:5px"><select id="panel'+pID+'-selector"';

    DOMstring += ' pID='+pID;

	DOMstring += ' class="selectpicker question-selector" multiple data-live-search="true" data-selected-text-format="count"';
    DOMstring += ' data-live-search-placeholder="Search" title="Choose a question" data-width="80%" data-container="body">';

	// Add in available survey entries
    var surveyIndex = $("#panel"+pID+"-surveyselector").val();
    //console.log(surveyIndex)
    if (surveyIndex != null){
        var questionList = surveyDataTable[surveyIndex][0];
        //console.log(questionList);
        var keyDetected = false;
        var questionDetected = false;

        for (q in questionList) {
            var questionText = questionList[q].length > 80 ? questionList[q].substring(0,80)+"..." : questionList[q];
            DOMstring += '<option id = "panel'+pID+'-selector-'+q+'" value = '+q+' title="'+questionList[q]+'">'+q+':'+questionText+'</option>';
        }
    }
    

	DOMstring += '</select>';
    //DOMstring += '<div id="dvDiv'+pID+'" style="display:none;position:absolute;padding:1px;border:1px solid #333333;;background-color:#fffedf;font-size:smaller;z-index:999;"></div>';
    //DOMstring+= '<iframe id="frm'+pID+'" style="display:none;position:absolute;z-index:998"></iframe>';
    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionRmvBtnDOM(pID,sID) {
    var DOMstring = '<button class="btn question-rmvbtn" style="margin-left:10px" pID='+pID+' sID='+sID+'>';

    DOMstring += '<span class="glyphicon glyphicon-minus">';

    DOMstring += '</span></button>';

    return $(DOMstring);
}

function newAnswerTagDOM(pID,sID,answerText) {
    var DOMstring = '<span class="label label-primary response-tag" pID='+pID+' sID='+sID;
    DOMstring += ' style="font-size:12px; margin:15px; cursor:pointer">';
    DOMstring += answerText;

    DOMstring += '<span type="button" class="btn" aria-label="Close">';
    DOMstring += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>';

    DOMstring += '</span>';

    return $(DOMstring);
}

function newOpenResponseTagDOM(pID,sID,answerText) {
    //var DOMstring = '<span style="border-style:solid; border-width:1px; font-size:12px; margin:15px; padding:3px; cursor:default" ';
    //DOMstring += 'pID='+pID+' sID='+sID+' class="open-response-tag" ';
    var DOMstring = '<span class="label label-primary open-response-tag" pID='+pID+' sID='+sID+' style="font-size:12px; margin:15px; cursor:default" ';

    if (answerText.length > 20) {
        DOMstring += 'title="'+answerText+'"';
        DOMstring += '>'+answerText.substring(0,19)+'...';
    }
    else DOMstring += '>'+answerText;

    DOMstring += '</span>';

    return $(DOMstring);
}

function newChartSelectDOM(pID) {
    var DOMstring = '<div class="row chart-select" pID='+pID+' id="panel'+pID+'-chart-select" style="display:none">'

    DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12" style="padding-left:60px; margin-bottom:10px">';
    DOMstring += '<img src="../image/sm.png" id="panel'+pID+'-chart-sm" pID='+pID;
    DOMstring += ' style="margin-left:5px; border-style:solid; border-width:2px; cursor:pointer">';
    DOMstring += '<img src="../image/lc.png" id="panel'+pID+'-chart-lc" pID='+pID
    DOMstring += ' style="margin-left:5px; border-style:solid; cursor:pointer">';
    DOMstring += '</div>';

    DOMstring += '<hr size=5 style="margin-top:0px; margin-bottom:0px;" width="90%" />';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newChartAreaDOM(pID) {
    var DOMstring = '<div class="row chart-area" pID='+pID+' id="panel'+pID+'-chart-area" ';
    DOMstring += 'style="width:100%; height:100%; padding-left:25px; padding-right:20px; padding-bottom:0px; overflow-y:auto">';

    //DOMstring += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 vcenter" style="height:150px"><h1 style="color:#BBBBBB">No Chart</h1></div>';

    //DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12">';
    //DOMstring += '<text text-anchor="middle" x="100" y="20" font-size="20"></text>';
    //DOMstring += '</div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newSmallMultiplePanelDOM(pID,qID) {
    //var DOMstring = '<div class="panel panel-primary col-lg-3 col-sm-5 col-xs-12 sm-panel" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    //DOMstring += ' style="margin-right:20px; padding:0px">';
    var DOMstring = '<div class="col-lg-4 col-md-4 col-sm-6 col-xs-12 sm-panel chart" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    //var DOMstring = '<div class="sm-panel" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    DOMstring += ' style="margin-right:0px; margin-bottom:5px; padding-left:0px; overflow:hidden;">';
    DOMstring += '<div class="col-lg-12 panel panel-primary" style="padding:0px;height:100%;border-color:black;">';

    // Close button
    DOMstring += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position:absolute;z-index:100">';
    DOMstring += '<button type="button" class="close pull-right sm-panel-close" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
    //DOMstring += '<span aria-hidden="true" class="pull-right close">×</span>';
    DOMstring += '</div>';


    // Setting-toggling button
    //DOMstring += '<span class="btn pull-left hide-btn" id="panel'+ID+'-hide-btn">';
    //DOMstring += '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></span>';

    // Panel header and panel close tag
    DOMstring += '<div class="panel-heading panel-primary-heading"';
    DOMstring += ' id="panel'+pID+'-sm'+qID+'-heading" style="width:100%; height:67px; overflow:auto; padding-right:12px"> ';
    DOMstring += '</div>';
    //DOMstring += '<textarea rows=3 class="panel-heading panel-primary-heading col-lg-12 col-sm-12 col-xs-12" ';
    //DOMstring += 'style="resize:none; padding-right:18px;" id="panel'+pID+'-sm'+qID+'-heading">';
    //DOMstring += 'Question '+qID;
    //DOMstring +='</textarea>';
    //DOMstring += '</div>';


    DOMstring += '<div class="col-lg-12 chart-container" style="height:200px"></div>';

    DOMstring += '<span class="btn btn-default btn-xs pull-right sm-panel-more" style="margin:2px;position:absolute;bottom:0px;right:8px">More</span>';

    DOMstring += '</div>';
    DOMstring += '</div>';

    return $(DOMstring);

    /*var DOMstring = '<div class="panel panel-primary col-lg-4" id="panel'+pID+'-sm'+qID+'" pID='+pID+' style="padding:0px;">';

    // Close button
    DOMstring += '<button type="button" class="close pull-right sm-panel-close" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span></button>';

    // Panel header and panel close tag
    DOMstring += '<div class="panel-heading panel-primary-heading col-lg-12" style="text-align:center; height:67px; overflow:auto"';
    DOMstring += ' id="panel'+pID+'-heading">New Panel '+pID+'</div>';

    DOMstring += '</div>';

    return $(DOMstring);*/
}

function newMoreInfoColDOM(pID) {
    return $('<div class="'+more_panel_col_class+'"panel-container ui-widget-content more-col" id="more-col'+pID+'" pID='+pID+'></div>');
}

function newAllResponsesDOM(sID,qID) {
    //var DOMstring = '<div class="col-lg-6 resp-panel" id="panel'+pID+'-resp-panel'+qID+'" pID='+pID+' qID='+qID;
    //DOMstring += ' style="margin-right:0px; padding:10px"><div class="col-lg-12 panel panel-primary" style="padding:0px">';
    var DOMstring = '<div class="'+more_panel_col_class+' resp-panel panel panel-container panel-default" id="survey'+sID+'-resp-panel'+qID+'" sID='+sID+' qID='+qID;
    DOMstring += ' style="margin-right:5px; margin-left:5px; padding:0px">';

    // Close button
    DOMstring += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position:absolute;z-index:100">';
    DOMstring += '<button type="button" class="close pull-right resp-panel-close" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
    DOMstring += '</div>';

    DOMstring += '<textarea rows=3 class="panel-heading panel-default-heading col-lg-12 col-md-12 col-sm-12 col-xs-12" ';
    DOMstring += 'style="resize:none; padding-right:18px" readonly="readonly" id="survey'+sID+'-ar'+qID+'-heading">';
    DOMstring += 'Question '+qID;
    DOMstring +='</textarea>';

    DOMstring += '<div class="col-lg-12 resp-text chart" sID='+sID+' qID='+qID+' readonly="readonly" style="height:200px; overflow:auto; resize:none"></div>';

    DOMstring += '</div>';
    //DOMstring += '</div>';

    return $(DOMstring);
}
