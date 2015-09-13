// DOM script file for panels3.js

panel_col_class="col-lg-12";
sm_panel_class={"Response":"col-lg-2 col-md-3 col-sm-6 col-xs-12",
                "Multiple Responses":"col-lg-2 col-md-3 col-sm-6 col-xs-12",
                "Numeric":"col-lg-2 col-md-3 col-sm-6 col-xs-12",
                "Open-Ended Response":"col-lg-4 col-md-6 col-sm-12 col-xs-12",
                "Ranking Response":"col-lg-2 col-md-3 col-sm-6 col-xs-12",};

more_panel_col_class="col-lg-3";
default_sm_height=180;
default_smcon_height=113;
resize_grid_y=50;
overview_query_class = "col-lg-12 col-md-12 col-sm-12 col-xs-12";
//query_container_class = "col-lg-11 col-md-11 col-sm-11 col-xs-11";

// Function to return a panel container DOM with specified ID
function newColumnDOM(ID) {
    return $('<div class="'+panel_col_class+' panel-container ui-widget-content" id="col'+ID+'" style="padding:0px; margin-bottom:5px; border:none" pID='+ID+'></div>');
}

// Function to return a panel container DOM with specified ID, with close button and setting-toggling button
function newPanelDOM(ID) {
	// Panel tag with specified ID
    var DOMstring = '<div class="panel panel-primary chart-panel" id="panel'+ID+'" pID='+ID+' style="padding:0px; margin:0; overflow:hidden; width:100%">';

    // Setting-toggling button
    DOMstring += '<span class="btn pull-left hide-btn" id="panel'+ID+'-hide-btn" style="margin-right:0px;padding-right:0px">';
    DOMstring += '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></span>';

    // Panel header and panel close tag
    DOMstring += '<div class="panel-heading panel-primary-heading" style="text-align:center; cursor:default" id="panel'+ID+'-heading">New Panel '+ID+'</div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newTabDOM(pID) {
    var DOMstring = '<ul class="nav nav-tabs col-lg-12 col-md-12 col-sm-12 col-xs-12" id='+pID+' style="padding:0">';

    DOMstring += '<li class="active" type="overview-btn"><a data-toggle="tab" href="#overview-area">Overview</a></li>';
    DOMstring += '<li><a data-toggle="tab" href="#query-area">Query</a></li>';

    DOMstring += '<span class="btn btn-sm pull-right hide-btn" id="panel'+pID+'-hide-btn">';
    DOMstring += '<span class="glyphicon glyphicon-cog" aria-hidden="true"></span></span>';

    DOMstring += '<span class="btn btn-sm pull-right add-btn" id="panel'+pID+'-add-btn" style="display:none">';
    DOMstring += '<span class="glyphicon glyphicon-plus" aria-hidden="true"></span></span>';

    DOMstring += '<div class="tab-content '+overview_query_class+'" style="padding:0">';
    DOMstring += '<div id="overview-area" class="tab-pane fade in active '+overview_query_class+'" pID=0 style="padding:0">';
    DOMstring += '<div class="'+overview_query_class+' page-header" style="text-align:center;margin-top:0px;margin-bottom:0px;display:none;';
    DOMstring += 'border-width:1px; border-style:solid; border-color:#ddd;padding-top:7px;padding-bottom:5px"></div></div>';
    DOMstring += '<div id="query-area" class="tab-pane fade '+overview_query_class+'" style="padding:0; border-width:1px;';
    DOMstring += 'border-top-style:solid; border-right-style:solid; border-left-style:solid; border-width:1px; border-color:#ddd">';
    DOMstring += '<div class="'+overview_query_class+' page-header" style="text-align:center;margin-top:5px;margin-bottom:1px"></div></div>';

    DOMstring += '</div></ul>';

    return $(DOMstring);
}

function newTabContentDOM() {
    return $('<div class="tab-content" style="border-style:solid;border-color:#ddd;margin-top:0"></div>');
}

function newOverviewDOM(pID) {
    return $('<div id="overview-area" class="tab-pane fade in active overview-area"></div>');
}

// function newQueryChartDOM(qcID) {
//     return $('<div id="query-chart'+qcID+'" class="query-chart '+overview_query_class+'" qcID='+qcID+' style="padding:0px"></div>');
// }

function newQueryChartDOM(qcID) {
    var DOMstring = '<div id="query-chart'+qcID+'" class="query-chart col-lg-6" qcID='+qcID+' style="padding:5px">';

    DOMstring += '<div class="panel panel-primary col-lg-12" style="padding:0px;height:100%;border-color:black;">';

    DOMstring += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="position:absolute;z-index:100">';
    DOMstring += '<button type="button" class="close pull-right sm-panel-close" aria-label="Close">';
    DOMstring += '<span aria-hidden="true">×</span><span class="sr-only">Close</span></button>';
    DOMstring += '</div>';

    DOMstring += '<div class="col-lg-12 chart-container no-drag" style="height:200px"></div>';

    DOMstring += '</div>';
    DOMstring += '</div>';

    return $(DOMstring);
}

function newSurveyAreaDOM(ID) {
	var DOMstring = '<div class="survey-area col-lg-12 col-sm-12 col-xs-12 no-drag" id="panel'+ID+'-survey-area"';
    DOMstring += ' style="padding:10px 5px 5px 5px; border-top-style:solid; border-right-style:solid; border-left-style:solid; border-width:1px; border-color:#ddd">';

    // Add survey selector
    DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12" style="padding-left:20px">';
    DOMstring += '<select id="panel'+ID+'-surveyselector"';
    DOMstring += 'class="selectpicker surveyselector vcenter" data-max-options="1" data-live-search="true" ';
    DOMstring += 'data-live-search-placeholder="Search" title="Choose a survey" data-width="91%" data-container="body">';

    // Add in available survey entries
    var resp_num;
    var option_text;
    for (var i = 0; i < surveyDataIndex.length; i ++){
        resp_num = surveyDataTable[i].length-2;
        option_text = surveyDataIndex[i]+' ('+resp_num+" responses)";
        DOMstring += '<option value = '+i+' title="'+option_text+'">'+option_text+'</option>';
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
    var DOMstring = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 question-area no-drag" id="panel'+pID+'-question-area"';
    DOMstring += ' style="padding:5px; border-right-style:solid; border-left-style:solid; border-width:1px; border-color:#ddd"></div>'

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

	var DOMstring = '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style="padding-left:20px; padding-top:5px; padding-bottom:5px"><select id="panel'+pID+'-selector"';

    DOMstring += ' pID='+pID;

	DOMstring += ' class="selectpicker question-selector" multiple data-live-search="true" data-selected-text-format="count"';
    DOMstring += ' data-live-search-placeholder="Search" title="Choose a question" data-width="91%" data-container="body">';

	// Add in available survey entries
    //var surveyIndex = $("#panel"+pID+"-surveyselector").val();
    surveyIndex = window.sID;
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

    //DOMstring += '<button class="btn btn-xs btn-primary add-all" style="margin-left:10px; width:8%;font-size:11px"><span class="glyphicon glyphicon-plus-sign"></span>&nbspAll</button>';
    //DOMstring += '<button class="btn btn-primary btn-xs rmv-all" style="margin-left:10px; width:8%;font-size:11px"><span class="glyphicon glyphicon-minus-sign"></span>&nbspAll</button>';
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
    DOMstring += 'style="width:100%; height:100%; padding-left:10px; padding-right:10px; padding-bottom:0px; margin:0px; overflow-y:auto; ';
    DOMstring += 'padding:5px; border-right-style:solid; border-left-style:solid; border-width:1px; border-color:#ddd">';

    //DOMstring += '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 vcenter" style="height:150px"><h1 style="color:#BBBBBB">No Chart</h1></div>';

    //DOMstring += '<div class="col-lg-12 col-sm-12 col-xs-12">';
    //DOMstring += '<text text-anchor="middle" x="100" y="20" font-size="20"></text>';
    //DOMstring += '</div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newSmallMultiplePanelDOM(pID,qID,panel_class) {
    //var DOMstring = '<div class="panel panel-primary col-lg-3 col-sm-5 col-xs-12 sm-panel" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    //DOMstring += ' style="margin-right:20px; padding:0px">';
    var DOMstring = '<div class="'+panel_class+' sm-panel chart" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    //var DOMstring = '<div class="sm-panel" id="panel'+pID+'-sm'+qID+'" pID='+pID+' qID='+qID;
    DOMstring += ' style="margin-right:0px; margin-bottom:5px; padding-left:5px; padding-right:5px; overflow:hidden; height:'+default_sm_height+'">';
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
    DOMstring += ' id="panel'+pID+'-sm'+qID+'-heading" style="width:100%; height:67px; overflow:auto; padding:0"> ';
    DOMstring += '</div>';
    //DOMstring += '<textarea rows=3 class="panel-heading panel-primary-heading col-lg-12 col-sm-12 col-xs-12" ';
    //DOMstring += 'style="resize:none; padding-right:18px;" id="panel'+pID+'-sm'+qID+'-heading">';
    //DOMstring += 'Question '+qID;
    //DOMstring +='</textarea>';
    //DOMstring += '</div>';


    DOMstring += '<div class="col-lg-12 chart-container no-drag" style="height:200px"></div>';

    //DOMstring += '<span class="btn btn-default btn-xs pull-right sm-panel-more" style="margin:2px;position:absolute;bottom:0px;right:8px">More</span>';

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

    DOMstring += '<div class="col-lg-12 resp-text chart no-drag" sID='+sID+' qID='+qID+' readonly="readonly" style="height:200px; overflow:auto; resize:none"></div>';

    DOMstring += '</div>';
    //DOMstring += '</div>';

    return $(DOMstring);
}

function newQueryHeaderDOM(qcID) {
    var DOMstring = '<div class="'+overview_query_class+' query-header" style="height:54px;display:none;overflow-y:auto;';
    DOMstring += 'padding:10px 0 0 16px">Selected questions: none</div>';
    return $(DOMstring);
}

function adjustSMPanelSize(qID) {
    var currentSMPanel = $(".sm-panel[qID='"+qID+"']");
    var currentHeading = currentSMPanel.find(".panel-heading");
    //console.log(currentHeading.css("height"));

    if (parseInt(currentHeading.find(".text-content").css("height")) > 50) currentHeading.css("height",70);
    else if (parseInt(currentHeading.find(".text-content").css("height")) > 30) currentHeading.css("height",50);
    else currentHeading.css("height",30);

    //if (currentSMPanel.hasClass("sm-text")) {
        var currentHeight = parseInt(currentSMPanel.css("height"));
        currentSMPanel.css("height",Math.round(currentHeight/resize_grid_y)*50);
    //}
    //else {

    //}

    currentSMPanel.find(".chart-container").css("height","100%");
    var old_con_height = parseInt(currentSMPanel.find(".chart-container").css("height"));
    //console.log(old_con_height);
    var heading_height = parseInt(currentSMPanel.find(".panel-heading").css("height"));
    //console.log(heading_height);
    currentSMPanel.find(".chart-container").css("height",(old_con_height - heading_height)+"px");

    if (!currentSMPanel.hasClass("sm-text")) {
        if (currentSMPanel.hasClass("sm-barchart-num")) resizeOverviewHistogram(currentSMPanel.attr("pID"),currentSMPanel.attr("qID"));
        else resizeRect(currentSMPanel.attr("pID"),currentSMPanel.attr("qID"));
    }

    currentSMPanel.find(".ui-resizable-se").css("bottom","1px");
    currentSMPanel.find(".ui-resizable-se").css("right","5px");
}

function adjustQCSize(qcID) {
    var currentQueryChart = $(".query-chart[qcID='"+qcID+"']");
    var currentQuestionArea = currentQueryChart.find(".question-area");
    //console.log(currentHeading.css("height"));

    // if (parseInt(currentHeading.find(".text-content").css("height")) > 50) currentHeading.css("height",70);
    // else if (parseInt(currentHeading.find(".text-content").css("height")) > 30) currentHeading.css("height",50);
    // else currentHeading.css("height",30);

    //if (currentSMPanel.hasClass("sm-text")) {
        var currentHeight = parseInt(currentQueryChart.css("height"));
        currentQueryChart.css("height",Math.round(currentHeight/resize_grid_y)*50);
    //}
    //else {

    //}

    currentQueryChart.find(".chart-container").css("height","100%");
    var old_con_height = parseInt(currentQueryChart.find(".chart-container").css("height"));
    //console.log(old_con_height);
    var question_height = parseInt(currentQuestionArea.css("height"));
    //console.log(heading_height);
    currentQueryChart.find(".chart-container").css("height",(old_con_height - question_height)+"px");

    // if (currentQueryChart.find(".chart-container").hasClass("barchart")) {
    //     resizeRect(qcID,currentQueryChart.find(".chart-container").attr("qID"),"query");
    // }
    // else if (currentQueryChart.find(".chart-container").hasClass("barchart")) {
    //     resizeRect(qcID,currentQueryChart.find(".chart-container").attr("qID"),"query");
    // }

    if (!currentQueryChart.find(".chart-container").hasClass("resp-text")) resizeQueryElements(qcID);

    currentQueryChart.find(".ui-resizable-se").css("bottom","1px");
    currentQueryChart.find(".ui-resizable-se").css("right","5px");
}