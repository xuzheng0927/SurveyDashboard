// Global variable declaration
window.focusID = 0;
window.previousID = 0;
window.maxID = 0;
panel_col_class="col-lg-12";

function addNewPanel() {
	// Record IDs, focus ID become previous ID, max ID is increased by 1 becomes the focus ID
    window.previousID = window.focusID;
    window.maxID += 1;
    window.focusID = window.maxID;

    // If there is more than one panels, dehighlight the previous focused panel
    if (window.previousID!=0){
        dehighlightPanel(window.previousID);       
    }

    // Create new panel DOM object
    var nextColumn = newColumnDOM(focusID);
    var nextPanel = newPanelDOM(focusID);
    var nextSurveyArea = newSurveyAreaDOM(focusID);
    var nextSurveySelector = newSurveySelectorDOM(focusID);
    var nextDatePicker = newDatePickerDOM(focusID);
    var nextLocationSelector = newLocationSelectorDOM(focusID);
    var nextQuestionGroup = newQuestionGroupDOM(focusID,1);
    //var nextQuestionSelector = newQuestionSelectorDOM(focusID,1,1);
    var nextQuestionAddBtn = newQuestionAddBtnDOM(focusID);

    // Append the column to panels
    nextColumn.prependTo("#panels");

    // Append the panel to parent column
    nextPanel.appendTo(nextColumn);

    nextSurveyArea.appendTo(nextPanel);
    //nextSurveySelector.appendTo($("#panel"+focusID+"-parameters"));

    //var nextParameters = $("#panel"+focusID+"-parameters");
    nextSurveySelector.appendTo(nextSurveyArea);
    nextDatePicker.appendTo(nextSurveyArea);
    nextLocationSelector.appendTo(nextSurveyArea);

    nextQuestionGroup.appendTo(nextPanel);
    var nextQuestionSelector = newQuestionSelectorDOM(focusID,1,1);
    nextQuestionSelector.appendTo(nextQuestionGroup);
    nextQuestionAddBtn.appendTo(nextQuestionSelector);

    $(".selectpicker").selectpicker();
    $(".input-group").datetimepicker();

    $( "#panels" ).sortable({
    items: '.panel-container',
    cancel: "svg",
    cancel: ".parameter-area",
    forcePlaceholderSize: true
    });
    $( "#panels" ).disableSelection();
	
	//$(".panel-container").resizable();
}

//addNewPanel();

$('#btnAdd').click(function (e) {
    addNewPanel();
});

// close or delete a panel, called when users click on the 'X' icon
$('#panels').on('click', ' div div .close', function() {
    $(this).parent().parent().remove();
    //highlightPanel(topID);
    if ($("panels").children('panel-container').length > 0) {
        window.focusID = $("#panels").children().first().attr("pID");
        highlightPanel(window.focusID);
    }
});

$('#panels').on('click', 'div div .hide-btn', function() {
    var panelID = $(this).parent().parent().attr('pID');
    $("#panel"+panelID+"-survey-area").toggle();
    $("#panel"+panelID+' .question-group').toggle();
    //$("#panel"+panelID+"-history").toggle();
});

$('#panels').on('change','.surveyselector', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    $("#panel"+panelID+" .question-group .selectpicker option").remove();
    var newSurveyIndex = $(this).val();

    if (newSurveyIndex != null) {
        var newQuestionList = surveyDataTable[newSurveyIndex][0];
        //console.log(newQuestionList);
        for (q in newQuestionList) {
            newOption = $('<option value = '+q+'>'+q+':'+newQuestionList[q]+'</option>');
            //console.log(newOption);
            $("#panel"+panelID+" .question-group .selectpicker").append(newOption);
        }
        $("#panel"+panelID+"-heading").text($(this).text());
    }
    else {
        $("#panel"+panelID+"-heading").text("New Panel "+panelID);
    }
    $("#panel"+panelID+" .question-group .selectpicker").selectpicker('refresh');
});

$('#panels').on('click','.question-addbtn', function() {
    var panelID = $(this).attr('pID');
    var newQGID = $("#panel"+panelID+" .question-group").length + 1;
    nextQuestionGroup = newQuestionGroupDOM(panelID,newQGID);
    nextQuestionGroup.appendTo("#panel"+panelID);

    var newQID = $("panel"+panelID+" select.question-selector").length + 1;
    nextQuestionSelector = newQuestionSelectorDOM(panelID,newQGID,newQID);
    nextQuestionSelector.appendTo(nextQuestionGroup);
    nextQuestionRmvBtn = newQuestionRmvBtn(panelID,newQGID,newQID);
    nextQuestionRmvBtn.appendTo(nextQuestionSelector);

    $(".selectpicker").selectpicker();
});

//highlight a panel
function highlightPanel(ID){
    $('#panel'+ID).removeClass('panel-default').addClass('panel-primary');
}

//dehighlight a panel
function dehighlightPanel(ID){
    if(ID == 0){
        return;
    }
    $('#panel'+ID).removeClass('panel-primary').addClass('panel-default');
}

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
    DOMstring += '<div class="panel-heading panel-primary-heading" style="text-align:center" id="panel'+ID+'-heading">New Panel '+ID+'</div></div>';

    return $(DOMstring);
}

function newSurveyAreaDOM(ID) {
	var DOMstring = '<div class="row vcenter survey-area" id="panel'+ID+'-survey-area" style="padding:5px">';

	//DOMstring += '<div class="col-lg-12 vcenter" id="panel'+ID+'-parameters"></div>';
	//DOMstring += '<div class="col-lg-3 vcenter" id="panel'+ID+'-history" style="border-style:solid; border-width:1px; background-color:#444444; color:white">';
	//DOMstring += '<div class="panel-heading"> History </div></div>';

	DOMstring += '</div>';

	return $(DOMstring);
}

function newSurveySelectorDOM(ID) {
	var DOMstring = '<div class="col-lg-6 vcenter">';

	// Add sub heading
    DOMstring += '<div class="row" style="padding-left:0px"><div class="col-lg-12" style="margin-bottom:10px">Survey Data</div></div>';

	DOMstring += '<select id="panel'+ID+'-surveyselector"';

	DOMstring += 'class="selectpicker surveyselector"  multiple data-max-options="1" data-live-search="true" ';
    DOMstring += 'data-live-search-placeholder="Search" title="Choose a survey" data-width="90%">';

	// Add in available survey entries
	//DOMstring += '<option value = "Midterm CSC110 2015"> Midterm CSC110 2015 </option>';
	//DOMstring += '<option value = "Midterm CSC100 2015"> Midterm CSC100 2015 </option>';
    for (var i = 0; i < surveyDataIndex.length; i ++){
        DOMstring += '<option value = '+i+'>'+surveyDataIndex[i]+'</option>';
    }

	DOMstring += '</select></div>';

	return $(DOMstring);
}

function newDatePickerDOM(ID) {
	var DOMstring = '<div class="col-lg-3 vcenter" style="margin-right:30px margin-left:30px">';

    // Add sub heading
    DOMstring += '<div class="row" style="padding-left:10px"><div class="col-lg-12">Time Range (Optional)</div></div>';
    
    DOMstring += '<div class="row" style ="padding-top:10px">';
    //DOMstring += '<div class="col-lg-4"><div class="panel-heading text-center">From</div></div>';
    DOMstring += '<div class="col-lg-12"><div class="form-group">';
    DOMstring += '<div class="input-group date" id="panel'+ID+'-datetimepicker1">';
    DOMstring += '<span class="input-group-addon">From</span>';
    DOMstring += '<input type="text" class="form-control" />';
    DOMstring += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
    DOMstring += '</div></div></div></div>';

    DOMstring += '<div class="row">';
    //DOMstring += '<div class="col-lg-4"><div class="panel-heading text-center">To</div></div>';
    DOMstring += '<div class="col-lg-12"><div class="form-group">';
    DOMstring += '<div class="input-group date" id="panel'+ID+'-datetimepicker2">';
    DOMstring += '<span class="input-group-addon">&nbsp To &nbsp</span>';
    DOMstring += '<input type="text" class="form-control" />';
    DOMstring += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
    DOMstring += '</div></div></div></div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newLocationSelectorDOM(ID) {
	var DOMstring = '<div class="col-lg-3 vcenter" style="margin-right:30px margin-left:30px">';

	// Add sub heading
    DOMstring += '<div class="row" style="padding-left:10px"><div class="col-lg-12">Location (Optional)</div></div>';
    
    DOMstring += '<div class="row vcenter" style ="padding-top:10px">';
    //DOMstring += '<div class="col-lg-4"><div class="panel-heading text-center">From</div></div>';
    DOMstring += '<div class="col-lg-12"><div class="form-group">';
    DOMstring += '<div class="input-group" id="panel'+ID+'-locationpicker1">';
    //DOMstring += '<span class="input-group-addon">Location</span>';
    DOMstring += '<input type="text" class="form-control" />';
    DOMstring += '</div></div></div></div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newQuestionGroupDOM(pID,qGID) {
	var DOMstring = '<div class="row question-group" id="panel'+pID+'-qG'+qGID+'" style="padding:5px">';

	//DOMstring += '<div class="col-lg-12 vcenter">Choose your question</div>'

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionSelectorDOM(pID,qGID,qID) {
	//var DOMstring = '<div class="col-lg-12 vcenter" style="padding:10px">';

	// Add sub heading
    //var DOMstring = '<div class="col-lg-12 vcenter">Choose a question</div>';

	var DOMstring = '<div class="col-lg-12 vcenter"><select id="panel'+pID+'-qG'+qGID+'-question'+qID+'"';

    DOMstring += ' pID='+pID+' qGID='+qGID+" qID="+qID;

	DOMstring += ' class="selectpicker question-selector" multiple data-max-options="1" data-live-search="true"';
    DOMstring += ' data-live-search-placeholder="Search" title="Choose a question" data-width="90%">';

	// Add in available survey entries
	//DOMstring += '<option value = 1> How helpful is this course? </option>';
	//DOMstring += '<option value = 2> How helpful is the instructor? </option>';
    var surveyIndex = $("#panel"+pID+"-surveyselector").val();
    //console.log(surveyIndex)
    if (surveyIndex != null){
        var questionList = surveyDataTable[surveyIndex][0];
        //console.log(questionList);

        for (q in questionList) {
            DOMstring += '<option value = '+q+'>'+q+':'+questionList[q]+'</option>';
        }
    }
    

	DOMstring += '</select></div>';

	return $(DOMstring);
}

function newQuestionAddBtnDOM(pID) {
    var DOMstring = '<button class="btn question-addbtn" style="margin-left:10px" pID='+pID+'><span class="glyphicon glyphicon-plus">';

    DOMstring += '</span></button>';

    return $(DOMstring);
}

function newQuestionRmvBtn(pID,qGID,qID) {
    var DOMstring = '<button class="btn question-addbtn" style="margin-left:10px" pID='+pID+'qGID='+qGID+' qID='+qID+'>';

    DOMstring += '<span class="glyphicon glyphicon-minus">';

    DOMstring += '</span></button>';

    return $(DOMstring);
}