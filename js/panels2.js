// Global variable declaration
window.focusID = 0;
window.previousID = 0;
window.maxID = 0;
window.maxSelectorID = new Array();
//panel_col_class="col-lg-12";

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
    var nextQuestionArea = newQuestionAreaDOM(focusID);
    var nextChartSelect = newChartSelectDOM(focusID);
    var nextChartArea = newChartAreaDOM(focusID);

    // Append the column to panels
    nextColumn.prependTo("#panels");

    // Append the panel to parent column
    nextPanel.appendTo(nextColumn);

    nextSurveyArea.appendTo(nextPanel);
    nextQuestionArea.appendTo(nextPanel);
    nextChartSelect.appendTo(nextPanel);
    nextChartArea.appendTo(nextPanel);

    $(".selectpicker").selectpicker();

    $( "#panels" ).sortable({
    items: '.panel-container',
    cancel: "svg",
    cancel: ".survey-area",
    cancel: ".question-area",
    forcePlaceholderSize: true
    });
    $( "#panels" ).disableSelection();

    $("#panel"+focusID+"-question-area").sortable({
        items: '.question-group',
        cancel: ".label",
        cancel: ".tag-row",
        forcePlaceholderSize: true
    });
	
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
        $("#panel"+panelID+"-addbtn").removeAttr("disabled");
        $("#panel"+panelID+"-addallbtn").removeAttr("disabled");
        $("#panel"+panelID+"-chart-select").show();
        $("#panel"+panelID+"-chart-area").show();

        // Update all existing selectors
        /*var newQuestionList = surveyDataTable[newSurveyIndex][0];
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
        usedOptions = new Array();*/
        
        /*if (currentQuestions.length > 0) {
            //$("#panel"+panelID+" option").attr("disabled","disabled");
            
        }*/

        /*for (var q = 0; q < currentQuestions.length; q++){
            for (var o = 0; o < currentQuestions.length; o++) {
                if (q != o){
                    optionToDisable = $($(currentQuestions[q]).find("option")[o]);
                    optionToDisable.attr("disabled","disabled");
                }
            }
            optionToSet = $(currentQuestions[q]).find("option")[q];
            currentQuestions[q].value = optionToSet.value;
            addAnswerTags(panelID,$(currentQuestions[q]).attr("qGID"),$(currentQuestions[q]).attr("qID"));
        }*/

        $("#panel"+panelID+"-heading").text($(this).text());
        reorderQuestions(panelID);
    }
    else {
        //$("#panel"+panelID+"-addbtn").hide();
        $("#panel"+panelID+"-heading").text("New Panel "+panelID);
        $("#panel"+panelID+" .question-group").remove();
        $("#panel"+panelID+"-addbtn").attr("disabled","disabled");
        $("#panel"+panelID+"-addallbtn").attr("disabled","disabled");
        $("#panel"+panelID+"-chart-select").hide();
        $("#panel"+panelID+"-chart-area").hide();
    }

    $("#panel"+panelID+" .question-group .selectpicker").selectpicker('refresh');
    $("#panels .tag-row").sortable({
        items: '.response-tag',
        cancel: '.open-response-tag',
        forcePlaceholderSize: true
    });
});

$('#panels').on('click','.question-addbtn', function() {
    var panelID = $(this).attr('pID');

    if (window.maxSelectorID[panelID-1] != null) window.maxSelectorID[panelID-1] += 1;
    else window.maxSelectorID[panelID-1] = 1;

    //var newQGID = $("#panel"+panelID+" .question-group").length + 1;
    var newSID = window.maxSelectorID[panelID-1];
    //console.log(newSID);
    nextQuestionGroup = newQuestionGroupDOM(panelID,newSID);
    //nextQuestionGroup.appendTo("#panel"+panelID);
    nextQuestionGroup.appendTo("#panel"+panelID+"-question-area");

    //var newQID = $("#panel"+panelID+" select.question-selector").length + 1;
    nextQuestionSelector = newQuestionSelectorDOM(panelID,newSID);
    nextQuestionSelector.prependTo(nextQuestionGroup);
    nextQuestionSelector.children().attr("prevVal",nextQuestionSelector.children().val());
    nextQuestionRmvBtn = newQuestionRmvBtnDOM(panelID,newSID);
    nextQuestionRmvBtn.appendTo(nextQuestionSelector);

    currentSelectors = $("#panel"+panelID+" select.question-selector");
    if ($("#panel"+panelID+"-surveyselector").val() != null) {
        if (newSID > 1) {
            for (var q=0; q < currentSelectors.length - 1; q++) {
                oldOptionValue = currentSelectors[q].value;
                optionToDisable = $("#panel"+panelID+"-select"+newSID+"-"+oldOptionValue);
                //console.log(optionToDisable);
                optionToDisable.attr("disabled","disabled");
            }
            /*for (var o=0; o < nextQuestionSelector.children().children().length; o++){
                //console.log(nextQuestionSelector.children().children()[o]);
                if (nextQuestionSelector.children().children()[o].getAttribute("disabled") != "disabled") {
                    newOptionValue = nextQuestionSelector.children().children()[o].value;
                    //console.log(newOptionValue);
                    nextQuestionSelector.children().val(newOptionValue);
                    nextQuestionSelector.children().attr("prevVal",newOptionValue);

                    for (var q=0; q < currentSelectors.length - 1; q++) {
                        optionToDisable = $("#panel"+panelID+"-qID"+$(currentSelectors[q]).attr("qID")+"-"+newOptionValue);
                        //console.log(optionToDisable);
                        optionToDisable.attr("disabled","disabled");
                    }
                    break;
                }
            }*/
        }       
        addAnswerTags(panelID,newSID);
        nextQuestionGroup.find(".tag-row").sortable({
            over: function(event,ui){console.log("sorted")},
            items: '.response-tag',
            cancel: '.open-response-tag',
            forcePlaceholderSize: true
        });
        reorderQuestions(panelID);

        if ($("#panel"+panelID+" .question-group").length == nextQuestionGroup.find("option").length) {
            $("#panel"+panelID+" .question-addbtn").attr("disabled","disabled");
            $("#panel"+panelID+" .question-addallbtn").attr("disabled","disabled");
        }
    }
    
    /*for (var q=0; q < newQID - 1; q++){
        disableOptionWithValue(nextQuestionSelector,$("#panel"+panelID+" select.question-selector")[q].value);
    }*/

    $(".selectpicker").selectpicker("refresh");
    $("#panel"+panelID+"-question-area").sortable({
        items: '.question-group',
        cancel: '.label',
        cancel: '.tag-row',
        forcePlaceholderSize: true,
        stop: function(event,ui) { 
            reorderQuestions(panelID);
            //console.log($(this).find(".question-selector"));
        }
    });
    $("#panel"+panelID).disableSelection();
    if ($("panel"+panelID).attr("class") == "panel panel-default") dehighlightPanel(panelID);
});

$('#panels').on('click','.question-addallbtn', function() {
    var panelID = $(this).attr('pID');
    var currentSurveyIndex = $("#panel"+panelID+"-surveyselector").val();
    var currentQuestions = surveyDataTable[currentSurveyIndex][0];
    $("#panel"+panelID+" .question-group").remove();

    for (q in currentQuestions) {
        if (window.maxSelectorID[panelID-1] != null) window.maxSelectorID[panelID-1] += 1;
        else window.maxSelectorID[panelID-1] = 1;
        var newSID = window.maxSelectorID[panelID-1];
        var newValue = q;

        nextQuestionGroup = newQuestionGroupDOM(panelID,newSID);
        //nextQuestionGroup.appendTo("#panel"+panelID);
        nextQuestionGroup.appendTo("#panel"+panelID+"-question-area");

        nextQuestionSelector = newQuestionSelectorDOM(panelID,newSID);
        nextQuestionSelector.prependTo(nextQuestionGroup);
        nextQuestionSelector.children().val(newValue);
        //console.log(nextQuestionSelector.children().val());
        nextQuestionSelector.find("option").attr("disabled","disabled");
        $("#panel"+panelID+"-select"+newSID+"-"+newValue).removeAttr("disabled");
        nextQuestionSelector.children().attr("prevVal",nextQuestionSelector.children().val());
        nextQuestionRmvBtn = newQuestionRmvBtnDOM(panelID,newSID);
        nextQuestionRmvBtn.appendTo(nextQuestionSelector);

        addAnswerTags(panelID,newSID);
        nextQuestionGroup.find(".tag-row").sortable({
            over: function(event,ui){console.log("sorted")},
            items: '.response-tag',
            cancel: '.open-response-tag',
            forcePlaceholderSize: true
        });
    }
    $(".selectpicker").selectpicker("refresh");
    reorderQuestions(panelID);
    $("#panel"+panelID+" .question-addallbtn").attr("disabled","disabled");
    $("#panel"+panelID+" .question-addbtn").attr("disabled","disabled");
    if ($("#panel"+panelID).attr("class") == "panel panel-default") dehighlightPanel(panelID);
});

$('#panels').on('change','select.question-selector', function() {
    var panelID = $(this).attr('pID');
    var selectorID = $(this).attr('sID');

    //console.log($(this).attr("prevVal")+","+$(this).val());
    if ($(this).attr("prevVal") != $(this).val()){
        $("#panel"+panelID+"-select"+selectorID+"-group .label").remove();
        $("#panel"+panelID+"-select"+selectorID+"-group .open-response-tag").remove();
        addAnswerTags(panelID,selectorID);
    }

    var currentSelectors = $("#panel"+panelID+" select.question-selector");
    var selectorNum = currentSelectors.length;

    for (var s=0; s < selectorNum; s++){
        var tempsID = currentSelectors[s].getAttribute("sID");

        if (tempsID != selectorID) {
            optionToDisable = $("#panel"+panelID+"-select"+tempsID+"-"+$(this).val());
            optionToEnable = $("#panel"+panelID+"-select"+tempsID+"-"+$(this).attr("prevVal"));
            if (optionToDisable != null) optionToDisable.attr("disabled","disabled");
            if (optionToEnable != null) optionToEnable.removeAttr("disabled");
        }
    }

    $(this).attr("prevVal",$(this).val());
    $(".selectpicker").selectpicker("refresh");
    reorderQuestions(panelID);
    if ($("#panel"+panelID).attr("class") == "panel panel-default") dehighlightPanel(panelID);
});

$('#panels').on('click','.question-rmvbtn', function() {
    var panelID = $(this).attr('pID');
    var optionToRelease = $(this).parent().find("select").val();
    var allOptions = $("#panel"+panelID+" .question-selector option");
    //console.log(allOptions);
    for (var o=0; o < allOptions.length; o++){
        if ($(allOptions[o]).val() == optionToRelease){
            $(allOptions[o]).removeAttr("disabled");
        }
    }
    $(".selectpicker").selectpicker("refresh");
    $(this).parent().parent().remove();
    reorderQuestions(panelID);
    $("#panel"+panelID+" .question-addbtn").removeAttr("disabled");
    $("#panel"+panelID+" .question-addallbtn").removeAttr("disabled");
});

$('#panels').on('click', ' div .panel-heading', function() {
    window.previousID = window.focusID;
    window.focusID = $(this).parent().parent().attr('pID');

    dehighlightPanel(window.previousID);
    highlightPanel(window.focusID);
});

$('#panels').on('click', 'img', function() {
    var panelID = $(this).attr('pID');
    $(this).siblings().css("border-width","0px");
    $(this).css("border-width","2px");
    $("#panel"+panelID+" svg text").text($(this).attr("id"));
});

//highlight a panel
function highlightPanel(ID){
    $('#panel'+ID).removeClass('panel-default').addClass('panel-primary');
    $('#panel'+ID+'-addbtn').removeClass('btn-default').addClass('btn-primary');
    $('#panel'+ID+'-addallbtn').removeClass('btn-default').addClass('btn-primary');
    $('#panel'+ID+' .label').removeClass('label-default').addClass('label-primary');
}

//dehighlight a panel
function dehighlightPanel(ID){
    if(ID == 0){
        return;
    }
    $('#panel'+ID).removeClass('panel-primary').addClass('panel-default');
    $('#panel'+ID+'-addbtn').removeClass('btn-primary').addClass('btn-default');
    $('#panel'+ID+'-addallbtn').removeClass('btn-primary').addClass('btn-default');
    $('#panel'+ID+' .label').removeClass('label-primary').addClass('label-default');
}

function addAnswerTags(pID,sID) {
    var selectedSurvey = $("#panel"+pID+"-surveyselector").val();
    var allAnswerList = surveyResponseAnswer[selectedSurvey];
    var selectedQuestion = $("#panel"+pID+"-select"+sID).val();
    var selectedAnswers = allAnswerList[selectedQuestion];
    var selectedQuestionGroup = $("#panel"+pID+"-select"+sID+"-group");

    if (selectedAnswers != null) {
        //console.log(currentQuestionGroup);
        $("#panel"+pID+"-select"+sID+"-group .tag-row").text("Available answers:");
        for (var i=0; i < selectedAnswers.length; i++){
            if (selectedAnswers[i] == "" | selectedAnswers[i] == null) continue;
            var nextAnswerTag = newAnswerTagDOM(pID,sID,selectedAnswers[i]);
            nextAnswerTag.appendTo(selectedQuestionGroup.find(".tag-row"));
        }
    }
    else if (selectedQuestion != null) {
        $("#panel"+pID+"-select"+sID+"-group .tag-row").text("Open responses:")
        var allAnswerList = surveyDataTable[selectedSurvey];
        if (allAnswerList.length > 10) var lastAnswerToRead = 10;
        else lastAnswerToRead = allAnswerList.length;
        for (var i=2; i < lastAnswerToRead; i++) {
            //console.log(surveyDataTable[selectedSurvey][i][selectedQuestion]);
            if (surveyDataTable[selectedSurvey][i][selectedQuestion] == "" | 
                surveyDataTable[selectedSurvey][i][selectedQuestion] == null) continue;
            var nextOpenResponseTag = newOpenResponseTagDOM(pID,sID,surveyDataTable[selectedSurvey][i][selectedQuestion]);
            //console.log(nextOpenResponseTag);
            nextOpenResponseTag.appendTo(selectedQuestionGroup.find(".tag-row"));
        }
    }
}

function reorderQuestions(pID){
    var currentSurveyIndex = $("#panel"+pID+" .surveyselector").val();
    var currentSelectors = $("#panel"+pID+" .question-group");
    currentSelectors.find(".tag-row").show();
    currentSelectors.find("hr").show();
    if (currentSelectors.length < 2) return;

    var currentQuestionIndices = new Array();
    //for (q in surveyResponseAnswer[currentSurveyIndex]) currentQuestionIndices[currentQuestionIndices.length] = q;
    for (var q=0; q < currentSelectors.length; q++) currentQuestionIndices[q] = $(currentSelectors[q]).find("select").val();

    for (var q1=0; q1<currentQuestionIndices.length-1; q1++) {
        for (var q2=q1+1; q2<currentQuestionIndices.length; q2++){
            if (surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q1]] != null &
                surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q2]] != null){
                //$(currentQuestions[q1]).find(".tag-row").show();
                if (equalArrays(surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q1]],
                    surveyResponseAnswer[currentSurveyIndex][currentQuestionIndices[q2]])){
                    //console.log(currentSelectors[q1]);
                    //console.log(currentSelectors[q2]);
                    $(currentSelectors[q1]).after($(currentSelectors[q2]));
                    $(currentSelectors[q1]).find(".tag-row").hide();
                    $(currentSelectors[q1]).find(" hr").hide();
                    $(currentSelectors[q2]).find(".tag-row").show();
                    $(currentSelectors[q2]).find(" hr").show();
                }
            }
                
        }
    }
}