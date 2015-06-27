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
    /*if (window.previousID!=0){
        dehighlightPanel(window.previousID);       
    }*/

    // Create new panel DOM object
    //var nextTopLevelRow = $('<div class="row top-row ui-widget-content" id="top-row'+focusID+'"></div>');
    var nextColumn = newColumnDOM(focusID);
    //var nextMoreInfoCol = newMoreInfoColDOM(focusID);
    var nextPanel = newPanelDOM(focusID);
    var nextSurveyArea = newSurveyAreaDOM(focusID);
    var nextQuestionArea = newQuestionAreaDOM(focusID);
    var nextChartSelect = newChartSelectDOM(focusID);
    var nextChartArea = newChartAreaDOM(focusID);

    // Append the column to panels
    nextColumn.prependTo("#panels");
    //nextTopLevelRow.prependTo("#panels");
    //nextColumn.appendTo(nextTopLevelRow);
    //nextColumn.after(nextMoreInfoCol);
    //nextTopLevelRow.append($('<hr class="col-lg-12">'));

    // Append the panel to parent column
    nextPanel.appendTo(nextColumn);

    nextSurveyArea.appendTo(nextPanel);
    nextQuestionArea.appendTo(nextPanel);
    nextChartSelect.appendTo(nextPanel);
    nextChartArea.appendTo(nextPanel);

    $(".selectpicker").selectpicker();

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
    //updateDefaultChart(focusID);

    //console.log(parseInt(nextColumn.css("width")));
    //console.log(parseInt(nextColumn.css("height")));

    // nextColumn.find(".sm-panel").resizable( {
    //     containment: "parent",
    //     //revert: true,
    //     //aspectRatio: function() { return parseInt($(this).css("width")) / parseInt($(this).css("height"))},
    //     //aspectRatio: 1,
    //     alsoResize: $(this).find('.panel'),
    //     //helper: "ui-resizable-helper",
    //     //alsoResize: $(this).parent(),
    //     //resize: function(event, ui) {$(this).find("svg").css("top","-67px");}
    //     start: function(event, ui) {
    //         $(this).find(".ui-resizable-se").css("bottom","1px");
    //         //$(this).css("position","fix");
    //         //console.log($(this).position());
    //         //$(this).css("left",-$(this).position().left);
    //         //$(this).css("top",-$(this).position().top);
    //         $(this).attr("keepleft",parseInt($(this).css("left")));
    //         $(this).attr("keeptop",parseInt($(this).css("top")));
    //         //$(this).css("top",0);
    //         //$(this).css("position","fix");
    //         // console.log("start position:"+$(this).position().left+","+$(this).position().top);
    //         // console.log("start offset:"+$(this).offset().left+","+$(this).offset.top);
    //         // console.log("start css:"+$(this).css("left")+","+$(this).css("top"));
    //         setActivePanel($(this));
    //         //$(this).find(".ui-resizable-s").css("bottom","-3px");
    //         //$(this).find(".ui-resizable-e").show();
    //     },
    //     resize: function(event, ui) {    
    //         $(this).css("position","fixed");
    //         $(this).css("left",$(this).attr("keepleft")+"px");
    //         $(this).css("top",$(this).attr("keeptop")+"px");
    //         $(this).css("position","relative");
    //         // console.log("resize position:"+$(this).position().left+","+$(this).position().top);
    //         // console.log("resize offset:"+$(this).offset().left+","+$(this).offset.top);
    //         // console.log("resize css:"+$(this).css("left")+","+$(this).css("top")); 
    //         $(this).find(".chart-container").css("height","100%");
    //         //$(this).find(".chart-container").css("width","100%");
    //         oldSVGH = parseInt($(this).find(".chart-container").css("height"));
    //         $(this).find(".chart-container").css("height",(oldSVGH-67)+"px");
    //         if ($(this).find(".sm-panel-more").css("visibility") == "hidden") {
    //             resizeRect($(this).attr("pID"),$(this).attr("qID"));
    //         }
    //         else {
    //             resizeCloud($(this).attr("pID"),$(this).attr("qID"));
    //         }
    //     },
    //     stop: function(event, ui) {
    //         //resizeRect($(this).attr("pID"),$(this).attr("qID"),ui.originalSize,ui.size);
    //         $(this).css("position","relative");
    //         // console.log("stop position:"+$(this).position().left+","+$(this).position().top);
    //         // console.log("stop offset:"+$(this).offset().left+","+$(this).offset.top);
    //         // console.log("stop css:"+$(this).css("left")+","+$(this).css("top"));   
    //         //$(this).css("left","0");
    //         //$(this).css("top","0");
    //     }
    // });
    //nextColumn.find(".sm-panel .ui-resizable-e").css("right","12px");
    //nextColumn.find(".sm-panel .ui-resizable-e").hide();
    //nextColumn.find(".sm-panel .ui-resizable-s").css("bottom","7px");
    //nextColumn.find(".sm-panel .ui-resizable-s").hide();
    //nextColumn.find(".sm-panel .ui-resizable-se").css("right","14px");
    //nextColumn.find(".sm-panel .ui-resizable-se").css("bottom","11px");
    setActivePanel(nextColumn);
    //var defaultSVGH = parseInt(nextColumn.find("svg").css("height"));
    //nextColumn.find("svg").css("height",(defaultSVGH+67)+"px");
    //nextColumn.find("svg").css("height","100%");
    //nextColumn.find("svg").css("top","-67px");
    nextChartArea.attr("keeptop",nextChartArea.position().top);
    nextChartArea.attr("keepleft",nextChartArea.position().left);
    nextColumn.resizable({
        //aspectRatio: parseInt(nextColumn.css("width")) / parseInt(nextColumn.css("height")),
        //stop: function(event, ui) {console.log($(this));},
        //aspectRatio: 1 / 1,
        minHeight: 180,
        minWidth: 300,
        alsoResize: nextPanel,
        start: function(event,ui) {
            $(this).attr("resized",true);
            $(this).attr("keepleft",parseInt($(this).offset().left));
            $(this).attr("keeptop",parseInt($(this).offset().top));
            //console.log(document.body.scrollTop)
            // $(this).attr("origHeight",parseInt($(this).css("height")));
            // $(this).attr("origScrTop",document.body.scrollTop);
            // $(this).css("position","fixed");
            // $(document.body).css("height",parseInt($(document.body).css("height")+parseInt($(this).attr("origHeight"))-parseInt($(this).css("height"))));
            // document.body.scrollTop = $(this).attr("origScrTop");
            // $(this).css("height",$(this).attr("origHeight"));
            // $(this).find(".chart-panel").css("height",$(this).attr("origHeight"));
        },
        resize: function(event, ui) {
            $(this).css("position","fixed");
            $(this).css("left",$(this).attr("keepleft")+"px");
            $(this).css("top",$(this).attr("keeptop")+"px");
            $(this).attr("keepleft",parseInt($(this).offset().left));
            $(this).attr("keeptop",parseInt($(this).offset().top));
            //$(this).css("position","relative");
            var allSMPanels = $(this).find(".sm-panel");
            for (var i=0;i<allSMPanels.length;i++){
                if ($(allSMPanels[i]).find(".sm-panel-more").css("visibility") == "hidden") {
                    resizeRect($(allSMPanels[i]).attr("pID"),$(allSMPanels[i]).attr("qID"));
                }
                else resizeCloud($(allSMPanels[i]).attr("pID"),$(allSMPanels[i]).attr("qID"));
            }
        },
        stop: function(event, ui) {
            $(this).css("position","relative");
            $(this).css("left",-$(this).offset().left+parseInt($(this).attr("keepleft"))*2+"px");
            $(this).css("top",-$(this).offset().top+parseInt($(this).attr("keeptop"))*2+"px");
            $(this).find(".chart-area").css("height",parseInt($(this).css("height"))-$(this).find(".chart-area").attr("keeptop"));
        }
    });
    nextColumn.draggable({
        //containment: "parent",
        start: function(event, ui) {
            //$(this).css("z-index",100);
            //$(this).siblings().css("z-index",0);
            setActivePanel($(this));
        }
    });
    nextColumn.draggable('option','cancel','rect');
    nextColumn.draggable('option','cancel','text');
    nextColumn.draggable('option','cancel','svg');

    nextChartArea.attr("oldHeight",parseInt(nextChartArea.css("height")));
    nextChartArea.attr("origTop",nextChartArea.position().top);
}

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
    //var questionID = $(this).parent().parent().parent().attr("qID");
    var valueToRemove = $(this).parent().parent().parent().attr("qID");
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

    if ($("#col"+panelID).attr("resized") == "true") {
        var surveyAreaHeight = parseInt($("#panel"+panelID+"-survey-area").css("height"));
        var questionAreaHeight = parseInt($("#panel"+panelID+"-question-area").css("height"));
        var currentColHeight = parseInt($("#col"+panelID).css("height"));
        if ($("#panel"+panelID+"-survey-area").css("display") == "none") {
            $("#col"+panelID).css("height",currentColHeight-surveyAreaHeight-questionAreaHeight+"px");
            $("#panel"+panelID).css("height",currentColHeight-surveyAreaHeight-questionAreaHeight+"px");
        }
        else{
            $("#col"+panelID).css("height",currentColHeight+surveyAreaHeight+questionAreaHeight+"px");
            $("#panel"+panelID).css("height",currentColHeight+surveyAreaHeight+questionAreaHeight+"px");
        }
    }
});

$('#panels').on('click', 'div div .hide-chart-btn', function() {
    var panelID = $(this).parent().parent().attr('pID');
    // $("#panel"+panelID+"-chart-area").attr("oldHeight",parseInt($("#panel"+panelID+"-chart-area").css("height")));
    // $("#panel"+panelID+"-chart-area").attr("oldTop",$("#panel"+panelID+"-chart-area").position().top);    

    if ($("#col"+panelID).attr("resized") == "true") {
        //var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").css("height"));
        //var chartTop = $("#panel"+panelID+"-chart-area").position().top;
        var currentColHeight = parseInt($("#col"+panelID).css("height"));
        var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").attr("oldHeight"));
        var chartTop = parseInt($("#panel"+panelID+"-chart-area").attr("origTop"));
        
        if ($("#panel"+panelID+"-chart-area").css("display") == "none") {
            $("#col"+panelID).css("height",(currentColHeight+chartAreaHeight-chartTop)+"px");
            $("#panel"+panelID).css("height",(currentColHeight+chartAreaHeight-chartTop)+"px");
        }
        else{
            var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").css("height"));
            $("#panel"+panelID+"-chart-area").attr("oldHeight",chartAreaHeight);
            console.log(chartAreaHeight+" "+chartTop+" "+currentColHeight);

            $("#col"+panelID).css("height",(currentColHeight-chartAreaHeight+chartTop)+"px");
            $("#panel"+panelID).css("height",(currentColHeight-chartAreaHeight+chartTop)+"px");
        }
    }

    $("#panel"+panelID+"-chart-area").toggle();
});

$('#panels').on('click','.label .btn', function() {
    $(this).parent().remove();
});

$('#panels').on('change','.surveyselector', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    updatePanelBySurveyChange(panelID);
});

// $('#panels').on('click','.question-addbtn', function() {
//     var panelID = $(this).attr('pID');

//     if (window.maxSelectorID[panelID-1] != null) window.maxSelectorID[panelID-1] += 1;
//     else window.maxSelectorID[panelID-1] = 1;

//     //var newQGID = $("#panel"+panelID+" .question-group").length + 1;
//     var newSID = window.maxSelectorID[panelID-1];
//     //console.log(newSID);
//     nextQuestionGroup = newQuestionGroupDOM(panelID,newSID);
//     //nextQuestionGroup.appendTo("#panel"+panelID);
//     nextQuestionGroup.appendTo("#panel"+panelID+"-question-area");

//     //var newQID = $("#panel"+panelID+" select.question-selector").length + 1;
//     nextQuestionSelector = newQuestionSelectorDOM(panelID,newSID);
//     nextQuestionSelector.prependTo(nextQuestionGroup);
//     nextQuestionSelector.children().attr("prevVal",nextQuestionSelector.children().val());
//     nextQuestionRmvBtn = newQuestionRmvBtnDOM(panelID,newSID);
//     nextQuestionRmvBtn.appendTo(nextQuestionSelector);

//     currentSelectors = $("#panel"+panelID+" select.question-selector");
//     if ($("#panel"+panelID+"-surveyselector").val() != null) {
//         if (newSID > 1) {
//             for (var q=0; q < currentSelectors.length - 1; q++) {
//                 oldOptionValue = currentSelectors[q].value;
//                 optionToDisable = $("#panel"+panelID+"-select"+newSID+"-"+oldOptionValue);
//                 //console.log(optionToDisable);
//                 optionToDisable.attr("disabled","disabled");
//             }
//             for (var o=0; o < nextQuestionSelector.children().children().length; o++){
//                 //console.log(nextQuestionSelector.children().children()[o]);
//                 if (nextQuestionSelector.children().children()[o].getAttribute("disabled") != "disabled") {
//                     newOptionValue = nextQuestionSelector.children().children()[o].value;
//                     //console.log(newOptionValue);
//                     nextQuestionSelector.children().val(newOptionValue);
//                     nextQuestionSelector.children().attr("prevVal",newOptionValue);

//                     for (var q=0; q < currentSelectors.length - 1; q++) {
//                         optionToDisable = $("#panel"+panelID+"-qID"+$(currentSelectors[q]).attr("qID")+"-"+newOptionValue);
//                         //console.log(optionToDisable);
//                         optionToDisable.attr("disabled","disabled");
//                     }
//                     break;
//                 }
//             }
//         }       
//         addAnswerTags(panelID,newSID);
//         nextQuestionGroup.find(".tag-row").sortable({
//             over: function(event,ui){console.log("sorted")},
//             items: '.response-tag',
//             cancel: '.open-response-tag',
//             forcePlaceholderSize: true
//         });
//         reorderQuestions(panelID);

//         if ($("#panel"+panelID+" .question-group").length == nextQuestionGroup.find("option").length) {
//             $("#panel"+panelID+" .question-addbtn").attr("disabled","disabled");
//             $("#panel"+panelID+" .question-addallbtn").attr("disabled","disabled");
//         }
//     }
    
//     /*for (var q=0; q < newQID - 1; q++){
//         disableOptionWithValue(nextQuestionSelector,$("#panel"+panelID+" select.question-selector")[q].value);
//     }*/

//     $(".selectpicker").selectpicker("refresh");
//     $("#panel"+panelID+"-question-area").sortable({
//         items: '.question-group',
//         cancel: '.label',
//         cancel: '.tag-row',
//         forcePlaceholderSize: true,
//         stop: function(event,ui) { 
//             reorderQuestions(panelID);
//             //console.log($(this).find(".question-selector"));
//         }
//     });
//     $("#panel"+panelID).disableSelection();
//     if ($("panel"+panelID).attr("class") == "panel panel-default") dehighlightPanel(panelID);
// });

// $('#panels').on('click','.question-addallbtn', function() {
//     var panelID = $(this).attr('pID');
//     var currentSurveyIndex = $("#panel"+panelID+"-surveyselector").val();
//     var currentQuestions = surveyDataTable[currentSurveyIndex][0];
//     $("#panel"+panelID+" .question-group").remove();

//     for (q in currentQuestions) {
//         if (window.maxSelectorID[panelID-1] != null) window.maxSelectorID[panelID-1] += 1;
//         else window.maxSelectorID[panelID-1] = 1;
//         var newSID = window.maxSelectorID[panelID-1];
//         var newValue = q;

//         nextQuestionGroup = newQuestionGroupDOM(panelID,newSID);
//         //nextQuestionGroup.appendTo("#panel"+panelID);
//         nextQuestionGroup.appendTo("#panel"+panelID+"-question-area");

//         nextQuestionSelector = newQuestionSelectorDOM(panelID,newSID);
//         nextQuestionSelector.prependTo(nextQuestionGroup);
//         nextQuestionSelector.children().val(newValue);
//         //console.log(nextQuestionSelector.children().val());
//         nextQuestionSelector.find("option").attr("disabled","disabled");
//         $("#panel"+panelID+"-select"+newSID+"-"+newValue).removeAttr("disabled");
//         nextQuestionSelector.children().attr("prevVal",nextQuestionSelector.children().val());
//         nextQuestionRmvBtn = newQuestionRmvBtnDOM(panelID,newSID);
//         nextQuestionRmvBtn.appendTo(nextQuestionSelector);

//         addAnswerTags(panelID,newSID);
//         nextQuestionGroup.find(".tag-row").sortable({
//             over: function(event,ui){console.log("sorted")},
//             items: '.response-tag',
//             cancel: '.open-response-tag',
//             forcePlaceholderSize: true
//         });
//     }
//     $(".selectpicker").selectpicker("refresh");
//     reorderQuestions(panelID);
//     $("#panel"+panelID+" .question-addallbtn").attr("disabled","disabled");
//     $("#panel"+panelID+" .question-addbtn").attr("disabled","disabled");
//     if ($("#panel"+panelID).attr("class") == "panel panel-default") dehighlightPanel(panelID);
// });

$('#panels').on('change','select.question-selector', function() {
    var panelID = $(this).attr('pID');
    
    var allOptions = $(this).find("option");
    for (var i=0; i<allOptions.length; i++){
        if (containedInArray(allOptions[i].value, $(this).val())) $("#panel"+panelID+"-sm"+allOptions[i].value).show();
        else $("#panel"+panelID+"-sm"+allOptions[i].value).hide();
    }
});

// $('#panels').on('click','.question-rmvbtn', function() {
//     var panelID = $(this).attr('pID');
//     var optionToRelease = $(this).parent().find("select").val();
//     var allOptions = $("#panel"+panelID+" .question-selector option");
//     //console.log(allOptions);
//     for (var o=0; o < allOptions.length; o++){
//         if ($(allOptions[o]).val() == optionToRelease){
//             $(allOptions[o]).removeAttr("disabled");
//         }
//     }
//     $(".selectpicker").selectpicker("refresh");
//     $(this).parent().parent().remove();
//     reorderQuestions(panelID);
//     $("#panel"+panelID+" .question-addbtn").removeAttr("disabled");
//     $("#panel"+panelID+" .question-addallbtn").removeAttr("disabled");
// });

/*$('#panels').on('click', ' div .panel-heading', function() {
    window.previousID = window.focusID;
    window.focusID = $(this).parent().parent().attr('pID');

    dehighlightPanel(window.previousID);
    highlightPanel(window.focusID);
});*/

$('#panels').on('click', 'img', function() {
    var panelID = $(this).attr('pID');
    $(this).siblings().css("border-width","0px");
    $(this).css("border-width","2px");
    $("#panel"+panelID+" svg text").text($(this).attr("id"));
});

$('#panels').on('click', '.sm-panel', function() {
    setActivePanel($(this))
})

$('#panels').on('click', '.sm-panel-more', function() {
    var panelID = $(this).parent().parent().attr('pID');
    var questionID = $(this).parent().parent().attr('qID');
    //console.log(panelID+" "+questionID);
    // if ($('#panel'+panelID+'-resp-panel'+questionID).length > 0) {
    //     if ($(this).hasClass("active")) {
    //         if ($("#more-col"+panelID).find(".resp-panel").length == 1) {
    //             $("#col"+panelID).removeClass("col-lg-8").addClass("col-lg-12");
    //         }
    //         $(this).removeClass("active");
    //         $('#panel'+panelID+'-resp-panel'+questionID).hide();
    //     }
    //     else {
    //         if ($("#more-col"+panelID).find(".resp-panel").length == 1) {
    //             $("#col"+panelID).removeClass("col-lg-12").addClass("col-lg-8");
    //         }
    //         $(this).addClass("active");
    //         $('#panel'+panelID+'-resp-panel'+questionID).show();
    //     }
    // }
    // else {
    //     $("#col"+panelID).removeClass("col-lg-12").addClass("col-lg-8");
    //     showAllResponses(panelID,questionID);
    //     $(this).addClass("active");
    // }
    showAllResponses(panelID,questionID);
});

$('#panels').on('click', '.resp-panel-close', function() {
    var panelID = $(this).parent().parent().attr('pID');
    var questionID = $(this).parent().parent().attr('qID');
    $("#panel"+panelID+"-sm"+questionID).find(".sm-panel-more").removeClass("active");
    $(this).parent().parent().hide();
});

$('#panels').on('click', '.panel-container', function() {
    setActivePanel($(this));
});

$('#panels').on('click', '.resp-panel', function() {
    setActivePanel($(this));
});

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
    var allSiblings = $("#col"+pID).siblings();
    for (var i=0;i<allSiblings.length;i++){
        $(allSiblings[i]).attr("tempofftop",parseInt($(allSiblings[i]).offset().top));
        $(allSiblings[i]).attr("tempoffleft",parseInt($(allSiblings[i]).offset().left));
        $(allSiblings[i]).attr("tempcsstop",parseInt($(allSiblings[i]).css("top")));
        $(allSiblings[i]).attr("tempcssleft",parseInt($(allSiblings[i]).css("left")));
        console.log($(allSiblings[i]).attr("tempofftop"));
    }

    if (newSurveyIndex != null) {
        //$("#panel"+panelID+"-addbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-addallbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-chart-select").show();
        $("#panel"+pID+"-chart-area").show();

        $("#panel"+pID+" .question-selector").parent().remove();
        var nextQuestionSelector = newQuestionSelectorDOM(pID);
        nextQuestionSelector.appendTo("#panel"+pID+"-question-area");
        var nextOptions = nextQuestionSelector.find("option");
        var nextOptionValues = new Array();
        for (var i=0;i<nextOptions.length;i++) {
            nextOptionValues[i] = nextOptions[i].value;
        }
        nextQuestionSelector.children().val(nextOptionValues);
        $(".selectpicker").selectpicker("refresh");

        $("#panel"+pID+"-heading").text(surveyDataIndex[$("#panel"+pID+"-surveyselector").val()]);

        $("#panel"+pID+" .sm-panel").remove();
        updateDefaultChart(pID);
        //reorderQuestions(panelID);

        $("#panel"+pID).find(".sm-panel").resizable( {
            containment: "parent",
            //revert: true,
            //aspectRatio: function() { return parseInt($(this).css("width")) / parseInt($(this).css("height"))},
            //aspectRatio: 1,
            alsoResize: $(this).find('.panel'),
            //helper: "ui-resizable-helper",
            //alsoResize: $(this).parent(),
            //resize: function(event, ui) {$(this).find("svg").css("top","-67px");}
            start: function(event, ui) {
                $(this).find(".ui-resizable-se").css("bottom","1px");
                $(this).attr("keepleft",parseInt($(this).offset().left));
                $(this).attr("keeptop",parseInt($(this).offset().top));
                console.log($(this).attr("true"));
                //setActivePanel($(this));
            },
            resize: function(event, ui) {                   
                setActivePanel($(this));
                
                if ($(this).attr("dragged")=="yes") {
                    $(this).css("position","fixed");
                    $(this).css("top",parseInt($(this).css("top"))+parseInt($(this).attr("keeptop"))-parseInt($(this).offset().top));
                    $(this).css("left",parseInt($(this).css("left"))+parseInt($(this).attr("keepleft"))-parseInt($(this).offset().left));
                }
                
                //console.log("keeptop:"+$(this).attr("keeptop")+" top:"+$(this).css("top")+" offset-top:"+$(this).offset().top+" csstop:"+$(this).attr("csstop"));
                $(this).find(".chart-container").css("height","100%");
                //$(this).find(".chart-container").css("width","100%");
                oldSVGH = parseInt($(this).find(".chart-container").css("height"));
                $(this).find(".chart-container").css("height",(oldSVGH-67)+"px");
                if ($(this).find(".sm-panel-more").css("visibility") == "hidden") {
                    resizeRect($(this).attr("pID"),$(this).attr("qID"));
                }
                else {
                    resizeCloud($(this).attr("pID"),$(this).attr("qID"));
                }
            },
            stop: function(event, ui) {
                //resizeRect($(this).attr("pID"),$(this).attr("qID"),ui.originalSize,ui.size);
                $(this).css("position","relative");
                //console.log("keeptop:"+$(this).attr("keeptop")+" top:"+$(this).css("top")+" offset-top:"+$(this).offset().top+" csstop:"+$(this).attr("csstop"));
                if ($(this).attr("dragged") == "yes") {
                    $(this).css("top",parseInt($(this).css("top"))+parseInt($(this).attr("keeptop"))-$(this).offset().top);
                    $(this).css("left",parseInt($(this).css("left"))+parseInt($(this).attr("keepleft"))-$(this).offset().left);
                }
                $("#col"+$(this).attr("pID")).css("height",parseInt($(this).parent().attr("height"))+$(this).attr("keeptop"));
                $("#panel"+$(this).attr("pID")).css("height",parseInt($(this).parent().attr("height"))+$(this).attr("keeptop"));
            }
        });
        $("#panel"+pID).find(".sm-panel .ui-resizable-e").hide();
        //nextColumn.find(".sm-panel .ui-resizable-s").css("bottom","7px");
        $("#panel"+pID).find(".sm-panel .ui-resizable-s").hide();
        $("#panel"+pID).find(".sm-panel .ui-resizable-se").css("right","14px");
        $("#panel"+pID).find(".sm-panel .ui-resizable-se").css("bottom","11px");
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

    for (var i=0; i<allSiblings.length; i++){
        console.log(parseInt($(allSiblings[i]).css("top")));
        console.log(parseInt($(allSiblings[i]).css("left")));
        console.log(parseInt($(allSiblings[i]).attr("tempofftop")));
        console.log(parseInt($(allSiblings[i]).attr("tempoffleft")));
        console.log($(allSiblings[i]).offset().top);
        console.log($(allSiblings[i]).offset().left);
        $(allSiblings[i]).css("top",parseInt($(allSiblings[i]).css("top"))+parseInt($(allSiblings[i]).attr("tempofftop"))-$(allSiblings[i]).offset().top);
        $(allSiblings[i]).css("left",parseInt($(allSiblings[i]).css("left"))+parseInt($(allSiblings[i]).attr("tempoffleft"))-$(allSiblings[i]).offset().left);
    }
}

function updateDefaultChart(pID) {
    var currentSurveyIndex = $("#panel"+pID+"-surveyselector").val();
    var currentOptions = $("#panel"+pID+"-selector").find("option");
    var currentOptionValues = new Array();
    var qID;

    for (var i=0; i<currentOptions.length;i++){
        //var qID = i+1;
        qID = currentOptions[i].value;
        var nextSmallMultiplePanel = newSmallMultiplePanelDOM(pID,qID);
        nextSmallMultiplePanel.find(".panel-heading").text($(currentOptions[i]).text());
        nextSmallMultiplePanel.find(".panel-heading").attr("title",$(currentOptions[i]).text());
        //$("#panel"+pID+"-sm"+(i+1)+'-heading').text($(currentOptions[i]).text());
        nextSmallMultiplePanel.appendTo("#panel"+pID+"-chart-area");
        if (surveyDataTable[currentSurveyIndex][1][qID] == "Response") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            createBarChart(pID,qID,currentSurveyIndex,"Response");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Multiple Responses") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            createBarChart(pID,qID,currentSurveyIndex,"Multiple Responses");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Numeric") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            createBarChart(pID,qID,currentSurveyIndex,"Numeric");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Open-Ended Response") {
            createWordCloud(pID,qID,currentSurveyIndex);
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
    $("#panel"+pID+" .sm-panel").draggable({
        containment: "parent",
        cancel: "text",
        cancel: "svg",
        start: function(event, ui) {
            //console.log($(this));
            $(this).attr("dragged","yes");
            $(this).css("z-index",100);
            $(this).siblings().css("z-index",0);
        },
        // stop: function(event, ui) {
        //     $(this).css("left",$(this).offset().left);
        //     $(this).css("top",$(this).offset().top);
        // }
    });
}

function showAllResponses(pID,qID) {
    var currentSurveyIndex = $("#panel"+pID+"-surveyselector").val();
    var currentSurveyName = surveyDataIndex[$("#panel"+pID+"-surveyselector").val()];
    var currentResponseNum = surveyDataTable[currentSurveyIndex].length;
    var currentQuestionText = $("#panel"+pID+"-sm"+qID+"-heading").text();

    var nextAllResponses = newAllResponsesDOM(currentSurveyIndex,qID);
    nextAllResponses.find(".panel-heading").text("(All responses for) "+currentSurveyName+" "+currentQuestionText);
    nextAllResponses.find(".panel-heading").attr("title",$("#panel"+pID+"-sm"+qID+"-heading").text());
    //nextAllResponses.appendTo("#more-col"+pID);
    nextAllResponses.appendTo("#panels");

    var newText;
    for (var i=2; i<currentResponseNum;i++){
        newText = surveyDataTable[currentSurveyIndex][i][qID];
        if (newText.length > 0){
            nextAllResponses.find(".resp-text").append("<p>"+newText+"</p>");
            nextAllResponses.find(".resp-text").append("<br>");
        }
        //else console.log(i+": "+newText);
    }

    // $("#more-col"+pID).sortable({
    //     items: '.resp-panel',
    //     cancel: '.resp-text',
    //     forcePlaceholderSize: true
    // }).disableSelection();
    nextAllResponses.attr("keepleft",nextAllResponses.position().left);
    nextAllResponses.attr("keeptop",nextAllResponses.position().top);
    nextAllResponses.resizable({
        start: function(event, ui){
            setActivePanel($(this));
            $(this).attr("keepleft",parseInt($(this).offset().left));
            $(this).attr("keeptop",parseInt($(this).offset().top));
        },
        resize: function(event, ui) {
            $(this).css("position","fixed");
            $(this).css("left",$(this).attr("keepleft")+"px");
            $(this).css("top",$(this).attr("keeptop")+"px");
            $(this).attr("keepleft",parseInt($(this).offset().left));
            $(this).attr("keeptop",parseInt($(this).offset().top));
            //$(this).css("position","relative");
            newPanelHeight = parseInt(ui.size["height"]);
            $(this).find(".resp-text").css("height",(newPanelHeight-72)+"px");
        },
        stop: function(event, ui) {
            $(this).css("position","relative");
            $(this).css("left",-$(this).offset().left+parseInt($(this).attr("keepleft"))*2+"px");
            $(this).css("top",-$(this).offset().top+parseInt($(this).attr("keeptop"))*2+"px");
        }
    });
    //nextAllResponses.css("overflow","auto").css("resize","both");
    nextAllResponses.draggable({
        handle: ".panel-heading",
        cancel: "p",
        //handle: 'textarea',
        //handle: '.resp-panel',
        start: function(event, ui) {
            $(this).css("z-index",100);
            $(this).siblings().css("z-index",0);
            setActivePanel($(this));            
        },
        stop: function(event, ui) {
            $(this).attr("keepleft",nextAllResponses.position().left);
            $(this).attr("keeptop",nextAllResponses.position().top);
        }
    });
}

function setActivePanel(panel) {
    var siblingPanels = panel.siblings();
    //console.log(siblingPanels);
    for (var i=0; i < siblingPanels.length; i++) {
        $(siblingPanels[i]).css("z-index",0)
        if (panel.hasClass("sm-panel")) continue;
        if ($(siblingPanels[i]).hasClass("panel-primary")) $(siblingPanels[i]).removeClass("panel-primary").addClass("panel-default");
        $(siblingPanels[i]).find(".panel-primary").removeClass("panel-primary").addClass("panel-default");
        $(siblingPanels[i]).find(".panel-primary-heading").removeClass("panel-primary-heading").addClass("panel-default-heading");
    }
    panel.css("z-index",100);
    if (panel.hasClass("sm-panel")) return;
    if (panel.hasClass("panel-default")) panel.removeClass("panel-default").addClass("panel-primary");
    panel.find(".panel-default").removeClass("panel-default").addClass("panel-primary");
    panel.find(".panel-default-heading").removeClass("panel-default-heading").addClass("panel-primary-heading");
}

function resizePanelAfterToggle(pID) {
       
}