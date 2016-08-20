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
    var nextTopLevelRow = $('<div class="row top-row" id="top-row'+focusID+'"></div>');
    var nextColumn = newColumnDOM(focusID);
    var nextMoreInfoCol = newMoreInfoColDOM(focusID);
    var nextPanel = newPanelDOM(focusID);
    var nextSurveyArea = newSurveyAreaDOM(focusID);
    var nextQuestionArea = newQuestionAreaDOM(focusID);
    var nextChartSelect = newChartSelectDOM(focusID);
    var nextChartArea = newChartAreaDOM(focusID);

    // Append the column to panels
    //nextColumn.prependTo("#panels");
    nextTopLevelRow.prependTo("#panels");
    nextColumn.appendTo(nextTopLevelRow);
    nextColumn.after(nextMoreInfoCol);
    nextTopLevelRow.append($('<hr class="col-lg-12">'));

    // Append the panel to parent column
    nextPanel.appendTo(nextColumn);

    nextSurveyArea.appendTo(nextPanel);
    nextQuestionArea.appendTo(nextPanel);
    nextChartSelect.appendTo(nextPanel);
    nextChartArea.appendTo(nextPanel);

    $(".selectpicker").selectpicker();

    $( "#panels" ).sortable({
    items: '.top-row',
    cancel: "svg",
    cancel: ".survey-area",
    cancel: ".question-area",
    cancel: ".chart-area",
    cancel: ".resp-text",
    forcePlaceholderSize: true
    });
    $( "#panels" ).disableSelection();

    /*$("#panel"+focusID+"-question-area").sortable({
        items: '.question-group',
        cancel: ".label",
        cancel: ".tag-row",
        stop: function(event,ui) { 
            reorderQuestions(focusID);
        },
        forcePlaceholderSize: true
    });*/
    
    //$(".panel-container").resizable();
    updatePanelBySurveyChange(focusID);
    updateDefaultChart(focusID);
}

//addNewPanel();

$('#btnAdd').click(function (e) {
    addNewPanel();
});

// close or delete a panel, called when users click on the 'X' icon
$('#panels').on('click', '.panel-close', function() {
    $(this).parent().parent().remove();
    //highlightPanel(topID);
    if ($("panels").children('panel-container').length > 0) {
        window.focusID = $("#panels").children().first().attr("pID");
        highlightPanel(window.focusID);
    }
});

$('#panels').on('click', '.sm-panel-close', function() {
    var panelID = $(this).parent().parent().parent().attr("pID");
    var questionID = $(this).parent().parent().parent().attr("qID");
    var valueToRemove = 'Q'+questionID;
    //console.log("#panel"+panelID+"-selector-Q"+questionID);
    var newValue = removeElement(valueToRemove,$("#panel"+panelID+"-selector").val());
    $("#panel"+panelID+"-selector").val(newValue);
    $("#panel"+panelID+"-selector").selectpicker("refresh");
    $(this).parent().parent().parent().hide();
});


$('#panels').on('click', 'div div .hide-btn', function() {
    var panelID = $(this).parent().parent().attr('pID');
    $("#panel"+panelID+"-survey-area").toggle();
    $("#panel"+panelID+'-question-area').toggle();
    //$("#panel"+panelID+"-history").toggle();
});

$('#panels').on('click','.label .btn', function() {
    $(this).parent().remove();
});

$('#panels').on('change','.surveyselector', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    updatePanelBySurveyChange(panelID);
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
    
    var allOptions = $(this).find("option");
    for (var i=0; i<allOptions.length; i++){
        if (containedInArray(allOptions[i].value, $(this).val())) $("#panel"+panelID+"-sm"+(i+1)).show();
        else $("#panel"+panelID+"-sm"+(i+1)).hide();
    }
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

$('#panels').on('click', '.sm-panel-more', function() {
    var panelID = $(this).parent().parent().attr('pID');
    var questionID = $(this).parent().parent().attr('qID');
    //console.log(panelID+" "+questionID);
    if ($('#panel'+panelID+'-resp-panel'+questionID).length > 0) {
        if ($(this).hasClass("active")) {
            if ($("#more-col"+panelID).find(".resp-panel").length == 1) {
                $("#col"+panelID).removeClass("col-lg-8").addClass("col-lg-12");
            }
            $(this).removeClass("active");
            $('#panel'+panelID+'-resp-panel'+questionID).hide();
        }
        else {
            if ($("#more-col"+panelID).find(".resp-panel").length == 1) {
                $("#col"+panelID).removeClass("col-lg-12").addClass("col-lg-8");
            }
            $(this).addClass("active");
            $('#panel'+panelID+'-resp-panel'+questionID).show();
        }
    }
    else {
        $("#col"+panelID).removeClass("col-lg-12").addClass("col-lg-8");
        showAllResponses(panelID,questionID);
        $(this).addClass("active");
    }
});

$('#panels').on('click', '.resp-panel-close', function() {
    var panelID = $(this).parent().parent().attr('pID');
    var questionID = $(this).parent().parent().attr('qID');
    $("#panel"+panelID+"-sm"+questionID).find(".sm-panel-more").removeClass("active");
    $(this).parent().parent().hide();
})

//highlight a panel
function highlightPanel(ID){
    $('#panel'+ID).removeClass('panel-default').addClass('panel-primary');
    $('#panel'+ID+'-addbtn').removeClass('btn-default').addClass('btn-primary');
    $('#panel'+ID+'-addallbtn').removeClass('btn-default').addClass('btn-primary');
    //$('#panel'+ID+' .label').removeClass('label-default').addClass('label-primary');
    $('#panel'+ID+' .sm-panel .panel-default').removeClass('panel-default').addClass('panel-primary');
}

//dehighlight a panel
function dehighlightPanel(ID){
    if(ID == 0){
        return;
    }
    $('#panel'+ID).removeClass('panel-primary').addClass('panel-default');
    $('#panel'+ID+'-addbtn').removeClass('btn-primary').addClass('btn-default');
    $('#panel'+ID+'-addallbtn').removeClass('btn-primary').addClass('btn-default');
    //$('#panel'+ID+' .label').removeClass('label-primary').addClass('label-default');
    $('#panel'+ID+' .panel-primary').removeClass('panel-primary').addClass('panel-default');
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

function updatePanelBySurveyChange(pID) {
    var newSurveyIndex = $("#panel"+pID+"-surveyselector").val();

    if (newSurveyIndex != null) {
        //$("#panel"+panelID+"-addbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-addallbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-chart-select").show();
        $("#panel"+pID+"-chart-area").show();

        $("#panel"+pID+" .question-selector").remove();
        var nextQuestionSelector = newQuestionSelectorDOM(pID);
        nextQuestionSelector.appendTo("#panel"+pID+"-question-area");
        var nextOptions = nextQuestionSelector.find("option");
        var nextOptionValues = new Array();
        for (var i=0;i<nextOptions.length;i++) {
            nextOptionValues[i] = nextOptions[i].value;
        }
        nextQuestionSelector.children().val(nextOptionValues);
        $(".selectpicker").selectpicker("refresh");

        $("#panel"+pID+"-heading").text($("#panel"+pID+"-surveyselector").text());
        //reorderQuestions(panelID);
    }
    else {
        //$("#panel"+panelID+"-addbtn").hide();
        $("#panel"+pID+"-heading").text("New Panel "+pID);
        $("#panel"+pID+" .question-selector").remove();
        //$("#panel"+panelID+"-addbtn").attr("disabled","disabled");
        //$("#panel"+panelID+"-addallbtn").attr("disabled","disabled");
        $("#panel"+pID+"-chart-select").hide();
        $("#panel"+pID+"-chart-area").hide();
    }
}

function updateDefaultChart(pID) {
    var currentSurveyIndex = $("#panel"+pID+"-surveyselector").val();
    var currentOptions = $("#panel"+pID+"-selector").find("option");

    for (var i=0; i<currentOptions.length;i++){
        var qID = i+1;
        var nextSmallMultiplePanel = newSmallMultiplePanelDOM(pID,i+1);
        nextSmallMultiplePanel.find(".panel-heading").text($(currentOptions[i]).text());
        nextSmallMultiplePanel.find(".panel-heading").attr("title",$(currentOptions[i]).text());
        //$("#panel"+pID+"-sm"+(i+1)+'-heading').text($(currentOptions[i]).text());
        nextSmallMultiplePanel.appendTo("#panel"+pID+"-chart-area");
        if (surveyResponseAnswer[currentSurveyIndex][currentOptions[i].value] != null) {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            //createBarchart(pID,qID,currentSurveyIndex);
        }
        else {
            //createWordCloud(pID,qID,currentSurveyIndex);
        }
    }

    $("#panel"+pID+"-chart-area").sortable({
        items: '.sm-panel',
        cancel: 'svg',
        forcePlaceholderSize: true
    }).disableSelection();

}

function showAllResponses(pID,qID) {
    var currentSurveyIndex = $("#panel"+pID+"-surveyselector").val();
    var currentResponseNum = surveyDataTable[currentSurveyIndex].length;

    var nextAllResponses = newAllResponsesDOM(pID,qID);
    nextAllResponses.find(".panel-heading").text("(All responses for) "+$("#panel"+pID+"-sm"+qID+"-heading").text());
    nextAllResponses.find(".panel-heading").attr("title",$("#panel"+pID+"-sm"+qID+"-heading").text());
    nextAllResponses.appendTo("#more-col"+pID);

    var newText;
    for (var i=2; i<currentResponseNum;i++){
        newText = surveyDataTable[currentSurveyIndex][i]['Q'+qID];
        if (newText.length > 0){
            nextAllResponses.find(".resp-text").append(newText);
            nextAllResponses.find(".resp-text").append("\n\n");
        }
        //else console.log(i+": "+newText);
    }

    $("#more-col"+pID).sortable({
        items: '.resp-panel',
        cancel: '.resp-text',
        forcePlaceholderSize: true
    }).disableSelection();
}