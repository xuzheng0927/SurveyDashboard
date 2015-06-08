panel_col_class="col-lg-12";

// Function to return a panel container DOM with specified ID
function newColumnDOM(ID) {
    return $('<div class="'+panel_col_class+' panel-container ui-widget-content" id="col'+ID+'" pID='+ID+'></div>');
}

// Function to return a panel container DOM with specified ID, with close button and setting-toggling button
function newPanelDOM(ID) {
	// Panel tag with specified ID
    var DOMstring = '<div class="panel panel-primary" id="panel'+ID+'" pID='+ID+'>';

    // Close button
    DOMstring += '<button type="button" class="close pull-right" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span></button>';

    // Setting-toggling button
    DOMstring += '<span class="btn pull-left hide-btn" id="panel'+ID+'-hide-btn">';
    DOMstring += '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></span>';

    // Panel header and panel close tag
    DOMstring += '<div class="panel-heading panel-primary-heading" style="text-align:center" id="panel'+ID+'-heading">New Panel '+ID+'</div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newSurveyAreaDOM(pID) {
	var DOMstring = '<div class="survey-area col-lg-12 col-sm-12 col-xs-12" id="panel'+pID+'-survey-area" style="padding:5px">';

    // Add survey selector
    DOMstring += '<div class="col-lg-8 col-sm-12 col-xs-12 vcenter">';
    DOMstring += '<select id="panel'+pID+'-surveyselector"';
    DOMstring += 'class="selectpicker surveyselector vcenter" multiple data-max-options="1" data-live-search="true" ';
    DOMstring += 'data-live-search-placeholder="Search" title="Choose a survey" data-width="90%">';

    // Add in available survey entries
    for (var i = 0; i < surveyDataIndex.length; i ++){
        DOMstring += '<option value = '+i+'>'+surveyDataIndex[i]+'</option>';
    }
    DOMstring += '</select></div>';

    // "Add one question button"
    DOMstring += '<div class="col-lg-2 col-sm-6 col-xs-6 vcenter"><button class="btn btn-primary question-addbtn" style="margin:10px; " ';
    DOMstring += ' id="panel'+pID+'-addbtn" disabled="disabled" pID='+pID+">Add a question</button></div>";	

    // "Add all questions button"
	DOMstring += '<div class="col-lg-2 col-sm-6 col-xs-6 vcenter"><button class="btn btn-primary question-addallbtn" style="margin:10px; " ';
    DOMstring += ' id="panel'+pID+'-addallbtn" disabled="disabled" pID='+pID+">Add all questions</button></div>"; 

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionAreaDOM(pID) {
    var DOMstring = '<div class="row question-area" id="panel'+pID+'-question-area"></div>'

    return $(DOMstring);
}

function newQuestionGroupDOM(pID,sID) {
	var DOMstring = '<div class="row question-group" id="panel'+pID+'-select'+sID+'-group" style="padding:5px">';

	//DOMstring += '<div class="row tag-row vcenter" style="margin:10px; padding-left:52px; padding-right:52px"></div>';
    DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12 tag-row" style="margin:10px; padding-left:60px"></div>';

    DOMstring += '<hr size=5 style="margin-top:0px; margin-bottom:0px;" width="90%" />';

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionSelectorDOM(pID,sID) {
	//var DOMstring = '<div class="col-lg-12 vcenter" style="padding:10px">';

	// Add sub heading
    //var DOMstring = '<div class="col-lg-12 vcenter">Choose a question</div>';

	var DOMstring = '<div class="col-lg-12 col-sm-12 col-xs-12 vcenter"><select id="panel'+pID+'-select'+sID+'"';

    DOMstring += ' pID='+pID+' sID='+sID;

	DOMstring += ' class="selectpicker question-selector" multiple data-max-options="1" data-live-search="true"';
    DOMstring += ' data-live-search-placeholder="Search" title="Choose a question" data-width="85%">';

	// Add in available survey entries
    var surveyIndex = $("#panel"+pID+"-surveyselector").val();
    //console.log(surveyIndex)
    if (surveyIndex != null){
        var questionList = surveyDataTable[surveyIndex][0];
        //console.log(questionList);

        for (q in questionList) {
            DOMstring += '<option id = "panel'+pID+'-select'+sID+'-'+q+'" value = '+q+'>'+q+':'+questionList[q]+'</option>';
        }
    }
    

	DOMstring += '</select></div>';

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
    var DOMstring = '<div class="row chart-area" pID='+pID+' id="panel'+pID+'-chart-area" style="display:none">';

    DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12"><svg height="50">';
    DOMstring += '<text text-anchor="middle" x="100" y="20" font-size="20">Small Multiples</text>';
    DOMstring += '</svg></div>';

    DOMstring += '</div>';

    return $(DOMstring);
}