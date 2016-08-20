// Global variable declaration
window.focusID = 0;
window.previousID = 0;
window.maxID = 0;
window.maxQuestionID = new Array();
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
    //var nextQuestionAddBtn = newQuestionAddBtnDOM(focusID);

    // Append the column to panels
    nextColumn.prependTo("#panels");

    // Append the panel to parent column
    nextPanel.appendTo(nextColumn);

    nextSurveyArea.appendTo(nextPanel);
    //nextSurveySelector.appendTo($("#panel"+focusID+"-parameters"));

    //var nextParameters = $("#panel"+focusID+"-parameters");
    nextSurveySelector.appendTo(nextSurveyArea);
    //$("#panel"+focusID+"-addbtn").hide();
    nextDatePicker.appendTo(nextSurveyArea);
    nextLocationSelector.appendTo(nextSurveyArea);

    //nextQuestionGroup.appendTo(nextPanel);
    //var nextQuestionSelector = newQuestionSelectorDOM(focusID,1,1);
    //nextQuestionSelector.appendTo(nextQuestionGroup);
    //nextQuestionAddBtn.appendTo(nextQuestionSelector);

    $(".selectpicker").selectpicker();
    $(".input-group").datetimepicker();

    $( "#panels" ).sortable({
    items: '.panel-container',
    cancel: "svg",
    cancel: ".survey-area",
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

$('#panels').on('click','.label .btn', function() {
    $(this).parent().remove();
});

$('#panels').on('change','.surveyselector', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    $("#panel"+panelID+" .question-group .selectpicker option").remove();
    $("#panel"+panelID+" .question-group .label").remove();
    var newSurveyIndex = $(this).val();

    if (newSurveyIndex != null) {
        //$("#panel"+panelID+"-addbtn").show();
        var newQuestionList = surveyDataTable[newSurveyIndex][0];
        //console.log(newQuestionList);
        newOptionNum = 0;
        for (q in newQuestionList) {
            newOptionNum += 1;
            newOption = $('<option value = '+q+'>'+q+':'+newQuestionList[q]+'</option>');
            //console.log(newOption);
            $("#panel"+panelID+" .question-group .selectpicker").append(newOption);
        }

        allOptions = $("#panel"+panelID+" .question-group option");
        for (var o=0; o < allOptions.length; o++){

            $(allOptions[o]).attr("id","panel"+panelID+"-qID"+$(allOptions[o]).parent().attr("qID")+"-"+$(allOptions[o]).val());
        }

        currentQuestions = $("#panel"+panelID+" select.question-selector");
        if (newOptionNum < currentQuestions.length) {
            for (var q = newOptionNum; q < currentQuestions.length; q++){
                $(currentQuestions[q]).parent().parent().remove();
            }
        }

        currentQuestions = $("#panel"+panelID+" select.question-selector");
        usedOptions = new Array();
        
        /*if (currentQuestions.length > 0) {
            //$("#panel"+panelID+" option").attr("disabled","disabled");
            
        }*/

        for (var q = 0; q < currentQuestions.length; q++){
            for (var o = 0; o < currentQuestions.length; o++) {
                if (q != o){
                    optionToDisable = $($(currentQuestions[q]).find("option")[o]);
                    optionToDisable.attr("disabled","disabled");
                }
            }
            optionToSet = $(currentQuestions[q]).find("option")[q];
            currentQuestions[q].value = optionToSet.value;
            addAnswerTags(panelID,$(currentQuestions[q]).attr("qGID"),$(currentQuestions[q]).attr("qID"));
        }

        $("#panel"+panelID+"-heading").text($(this).text());
        reorderQuestions(panelID);
    }
    else {
        //$("#panel"+panelID+"-addbtn").hide();
        $("#panel"+panelID+"-heading").text("New Panel "+panelID);
    }

    $("#panel"+panelID+" .question-group .selectpicker").selectpicker('refresh');
    $("#panels .tag-row").sortable({
        forcePlaceholderSize: true
    });
});

$('#panels').on('click','.question-addbtn', function() {
    var panelID = $(this).attr('pID');

    if (maxQuestionID[panelID-1] != null) maxQuestionID[panelID-1] += 1;
    else maxQuestionID[panelID-1] = 1;

    //var newQGID = $("#panel"+panelID+" .question-group").length + 1;
    var newQGID = maxQuestionID[panelID-1];
    nextQuestionGroup = newQuestionGroupDOM(panelID,newQGID);
    nextQuestionGroup.appendTo("#panel"+panelID);

    //var newQID = $("#panel"+panelID+" select.question-selector").length + 1;
    newQID = newQGID;
    nextQuestionSelector = newQuestionSelectorDOM(panelID,newQGID,newQID);
    nextQuestionSelector.prependTo(nextQuestionGroup);
    nextQuestionSelector.children().attr("prevVal",nextQuestionSelector.children().val());
    nextQuestionRmvBtn = newQuestionRmvBtnDOM(panelID,newQGID,newQID);
    nextQuestionRmvBtn.appendTo(nextQuestionSelector);

    currentQuestions = $("#panel"+panelID+" select.question-selector");
    if ($("#panel"+panelID+"-surveyselector").val() != null) {
        if (newQID > 1) {
            for (var q=0; q < currentQuestions.length - 1; q++) {
                oldOptionValue = currentQuestions[q].value;
                optionToDisable = $("#panel"+panelID+"-qID"+newQID+"-"+oldOptionValue);
                optionToDisable.attr("disabled","disabled");
            }
            for (var o=0; o < nextQuestionSelector.children().children().length; o++){
                //console.log(nextQuestionSelector.children().children()[o]);
                if (nextQuestionSelector.children().children()[o].getAttribute("disabled") != "disabled") {
                    newOptionValue = nextQuestionSelector.children().children()[o].value;
                    //console.log(newOptionValue);
                    nextQuestionSelector.children().val(newOptionValue);
                    nextQuestionSelector.children().attr("prevVal",newOptionValue);

                    for (var q=0; q < currentQuestions.length - 1; q++) {
                        optionToDisable = $("#panel"+panelID+"-qID"+$(currentQuestions[q]).attr("qID")+"-"+newOptionValue);
                        //console.log(optionToDisable);
                        optionToDisable.attr("disabled","disabled");
                    }
                    break;
                }
            }
        }       
        addAnswerTags(panelID,newQGID,newQID);
        nextQuestionGroup.find(".tag-row").sortable({
            over: function(event,ui){console.log("sorted")},
            forcePlaceholderSize: true
        });
        reorderQuestions(panelID);
    }
    
    /*for (var q=0; q < newQID - 1; q++){
        disableOptionWithValue(nextQuestionSelector,$("#panel"+panelID+" select.question-selector")[q].value);
    }*/

    $(".selectpicker").selectpicker("refresh");
    $("#panel"+panelID).sortable({
        items: '.question-group',
        cancel: 'label',
        forcePlaceholderSize: true,
        stop: function(event,ui) { 
            reorderQuestions(panelID);
            console.log($(this).find(".question-selector"));
        }
    });
    $("#panel"+panelID).disableSelection();
});

$('#panels').on('change','select.question-selector', function() {
    panelID = $(this).attr('pID');
    questionGroupID = $(this).attr('qGID');
    questionID = $(this).attr('qID');

    if ($(this).attr("prevVal") != $(this).val()){
        $("#panel"+panelID+"-qG"+questionGroupID+" .label").remove();
        addAnswerTags(panelID,questionGroupID,questionID);
    }

    currentQuestions = $("#panel"+panelID+" select.question-selector");
    questionNum = currentQuestions.length;

    for (var q=0; q < questionNum; q++){
        tempQID = currentQuestions[q].getAttribute("qID");

        if (tempQID != questionID) {
            optionToDisable = $("#panel"+panelID+"-qID"+tempQID+"-"+$(this).val());
            optionToEnable = $("#panel"+panelID+"-qID"+tempQID+"-"+$(this).attr("prevVal"));
            optionToDisable.attr("disabled","disabled");
            optionToEnable.removeAttr("disabled");
        }
    }

    $(this).attr("prevVal",$(this).val());
    $(".selectpicker").selectpicker("refresh");
    reorderQuestions(panelID);
});

$('#panels').on('click','.question-rmvbtn', function() {
    panelID = $(this).attr('pID');
    optionToRelease = $(this).parent().find("select").val();
    allOptions = $("#panel"+panelID+" .question-selector option");
    //console.log(allOptions);
    for (var o=0; o < allOptions.length; o++){
        if ($(allOptions[o]).val() == optionToRelease){
            $(allOptions[o]).removeAttr("disabled");
        }
    }
    $(".selectpicker").selectpicker("refresh");
    $(this).parent().parent().remove();
    reorderQuestions(panelID);
});

$('#panels').on('click', ' div .panel-heading', function() {
    window.previousID = window.focusID;
    window.focusID = $(this).parent().parent().attr('pID');

    dehighlightPanel(window.previousID);
    highlightPanel(window.focusID);
});

//highlight a panel
function highlightPanel(ID){
    $('#panel'+ID).removeClass('panel-default').addClass('panel-primary');
    $('#panel'+ID+'-addbtn').removeClass('btn-default').addClass('btn-primary');
    $('#panel'+ID+' .label').removeClass('label-default').addClass('label-primary');
}

//dehighlight a panel
function dehighlightPanel(ID){
    if(ID == 0){
        return;
    }
    $('#panel'+ID).removeClass('panel-primary').addClass('panel-default');
    $('#panel'+ID+'-addbtn').removeClass('btn-primary').addClass('btn-default');
    $('#panel'+ID+' .label').removeClass('label-primary').addClass('label-default');
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

function newSurveySelectorDOM(pID) {
	var DOMstring = '<div class="col-sm-12 col-xs-12 col-lg-6 vcenter">';

	// Add sub heading
    DOMstring += '<div class="row" style="padding-left:0px"><div class="col-lg-12" style="margin-bottom:10px">Survey Data</div></div>';

	DOMstring += '<select id="panel'+pID+'-surveyselector"';

	DOMstring += 'class="selectpicker surveyselector" multiple data-max-options="1" data-live-search="true" ';
    DOMstring += 'data-live-search-placeholder="Search" title="Choose a survey" data-width="90%">';

	// Add in available survey entries
	//DOMstring += '<option value = "Midterm CSC110 2015"> Midterm CSC110 2015 </option>';
	//DOMstring += '<option value = "Midterm CSC100 2015"> Midterm CSC100 2015 </option>';
    for (var i = 0; i < surveyDataIndex.length; i ++){
        DOMstring += '<option value = '+i+'>'+surveyDataIndex[i]+'</option>';
    }

	DOMstring += '</select>';

    DOMstring += '<div class="col-lg-12"><button class="btn btn-primary question-addbtn" style="margin:10px; width:90%" ';
    DOMstring += ' id="panel'+pID+'-addbtn" pID='+pID+">Add a question</button>";

    DOMstring += '</div>';

	return $(DOMstring);
}

function newDatePickerDOM(ID) {
	var DOMstring = '<div class="col-sm-6 col-xs-12 col-lg-3 vcenter" style="margin-right:30px margin-left:30px">';

    // Add sub heading
    DOMstring += '<div class="row" style="padding-left:10px"><div class="col-lg-12">Time Range (Optional)</div></div>';
    
    DOMstring += '<div class="row" style ="padding-top:10px;">';
    //DOMstring += '<div class="col-lg-4"><div class="panel-heading text-center">From</div></div>';
    DOMstring += '<div class="col-lg-12"><div class="form-group">';
    DOMstring += '<div class="input-group date" id="panel'+ID+'-datetimepicker1" style="width:90%;">';
    DOMstring += '<span class="input-group-addon">From</span>';
    DOMstring += '<input type="text" class="form-control" />';
    DOMstring += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
    DOMstring += '</div></div></div></div>';

    DOMstring += '<div class="row">';
    //DOMstring += '<div class="col-lg-4"><div class="panel-heading text-center">To</div></div>';
    DOMstring += '<div class="col-lg-12"><div class="form-group">';
    DOMstring += '<div class="input-group date" id="panel'+ID+'-datetimepicker2" style="width:90%">';
    DOMstring += '<span class="input-group-addon">&nbsp To &nbsp</span>';
    DOMstring += '<input type="text" class="form-control" />';
    DOMstring += '<span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span>';
    DOMstring += '</div></div></div></div>';

    DOMstring += '</div>';

    return $(DOMstring);
}

function newLocationSelectorDOM(ID) {
	var DOMstring = '<div class="col-sm-6 col-xs-12 col-lg-3 vcenter" style="margin-right:30px margin-left:30px">';

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

	DOMstring += '<div class="col-lg-12 tag-row vcenter" style="margin:10px"></div>';

    DOMstring += '<hr style="margin-top:0px; margin-bottom:0px" width="90%">';

    DOMstring += '</div>';

	return $(DOMstring);
}

function newQuestionSelectorDOM(pID,qGID,qID) {
	//var DOMstring = '<div class="col-lg-12 vcenter" style="padding:10px">';

	// Add sub heading
    //var DOMstring = '<div class="col-lg-12 vcenter">Choose a question</div>';

	var DOMstring = '<div class="col-lg-12 vcenter"><select id="panel'+pID+'-qG'+qGID+'-question'+qID+'"';

    DOMstring += ' pID='+pID+' qGID='+qGID+' qID='+qID;

	DOMstring += ' class="selectpicker question-selector" data-max-options="1" data-live-search="true"';
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
            DOMstring += '<option id = "panel'+pID+'-qID'+qID+'-'+q+'" value = '+q+'>'+q+':'+questionList[q]+'</option>';
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

function newQuestionRmvBtnDOM(pID,qGID,qID) {
    var DOMstring = '<button class="btn question-rmvbtn" style="margin-left:10px" pID='+pID+' qGID='+qGID+' qID='+qID+'>';

    DOMstring += '<span class="glyphicon glyphicon-minus">';

    DOMstring += '</span></button>';

    return $(DOMstring);
}

function newAnswerTagDOM(pID,qGID,qID,answerText) {
    var DOMstring = '<span class="label label-primary sortable" pID='+pID+' qGID='+qGID+' +qID='+qID+' style="font-size:12px; margin:15px; cursor:default">';

    DOMstring += answerText;

    DOMstring += '<span type="button" class="btn" aria-label="Close">';
    DOMstring += '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></span>';

    DOMstring += '</span>';

    return $(DOMstring);
}

function addAnswerTags(pID,qGID,qID) {
    allAnswerList = surveyResponseAnswer[$("#panel"+pID+"-surveyselector").val()];
    selectedQuestion = $("#panel"+pID+"-qG"+qGID+"-question"+qID).val();
    selectedAnswers = allAnswerList[selectedQuestion];

    if (selectedAnswers != null) {
        currentQuestionGroup = $("#panel"+pID+"-qG"+qGID);
        //console.log(currentQuestionGroup);
        for (var i=0; i < selectedAnswers.length; i++){
            if (selectedAnswers[i] == "" | selectedAnswers[i] == null) continue;
            nextAnswerTag = newAnswerTagDOM(pID,qGID,qID,selectedAnswers[i]);
            nextAnswerTag.appendTo(currentQuestionGroup.find(".tag-row"));
        }
    }
}

function reorderQuestions(pID){
    currentSurveyIndex = $("#panel"+pID+" .surveyselector").val();
    currentQuestions = $("#panel"+pID+" .question-group");
    if (currentQuestions.length < 2) return;

    currentQuestionIndices = new Array();
    //for (q in surveyResponseAnswer[currentSurveyIndex]) currentQuestionIndices[currentQuestionIndices.length] = q;
    for (var q=0; q < currentQuestions.length; q++) currentQuestionIndices[q] = $(currentQuestions[q]).find("select").val();

    for (var q1=0; q1<currentQuestionIndices.length-1; q1++) {
        for (var q2=q1+1; q2<currentQuestionIndices.length; q2++){
            if (surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q1]] != null &
                surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q2]] != null){
                //$(currentQuestions[q1]).find(".tag-row").show();
                if (equalArrays(surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q1]],
                    surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q2]])){
                    console.log(currentQuestions[q1]);
                    console.log(currentQuestions[q2]);
                    $(currentQuestions[q1]).after($(currentQuestions[q2]));
                    $(currentQuestions[q1]).find(".tag-row").hide();
                    $(currentQuestions[q1]).find(" hr").hide();
                    $(currentQuestions[q2]).find(".tag-row").show();
                    $(currentQuestions[q2]).find(" hr").show();
                }
            }
                
        }
    }
}