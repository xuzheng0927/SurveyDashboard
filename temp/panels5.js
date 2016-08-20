// Global variable declaration
window.focusID = 0;
window.previousID = 0;
window.maxID = 0;
window.maxSelectorID = new Array();
window.brushSettings = new Array();
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
    //console.log($("#panel"+focusID+"-surveyselector").parent().find("span.text"));
    //addOptionTags($("#panel"+focusID+"-surveyselector"));
    
    //$(".panel-container").resizable();
    updatePanelBySurveyChange(focusID);
    nextColumn.hide();

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
        start: function(event, ui) {
            $(this).attr("resized","true");
        },
        resize: function(event, ui) {
            var allSMPanels = $(this).find(".sm-panel");
            for (var i=0;i<allSMPanels.length;i++){
                if ($(allSMPanels[i]).find(".sm-panel-more").css("visibility") == "hidden") {
                    resizeRect($(allSMPanels[i]).attr("pID"),$(allSMPanels[i]).attr("qID"));
                }
                else resizeCloud($(allSMPanels[i]).attr("pID"),$(allSMPanels[i]).attr("qID"));
            }
        },
    });
    
    /*nextColumn.draggable({
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
    nextChartArea.attr("origTop",nextChartArea.position().top);*/

    $("#panels").sortable({
        items: '.panel-container',
        cancel: ".no-drag",
        forcePlaceholderSize: true
    });
    addOptionTags($("#panel"+focusID+"-surveyselector"));

    //$("#panel"+focusID).css("margin","0");
    nextColumn.animate({width:'toggle',height:'toggle'});
}

$('#btnAdd').click(function (e) {
    addNewPanel();
});

// close or delete a panel, called when users click on the 'X' icon
$('#panels').on('click', '.panel-close', function() {
    $(this).parent().parent().animate({width:'toggle',height:'toggle'},"slow",function(){
        $(this).remove();
    });
    //$(this).parent().parent().remove();
    //highlightPanel(topID);
    if ($("panels").children('panel-container').length > 0) {
        window.focusID = $("#panels").children().first().attr("pID");
        highlightPanel(window.focusID);
    }
    //$(this).parent().parent().remove();
});

$('#panels').on('click', '.sm-panel-close', function() {
    var panelID = $(this).parent().parent().parent().attr("pID");
    //var questionID = $(this).parent().parent().parent().attr("qID");
    var valueToRemove = $(this).parent().parent().parent().attr("qID");
    //console.log("#panel"+panelID+"-selector-Q"+questionID);
    var newValue = removeElement(valueToRemove,$("#panel"+panelID+"-selector").val());
    $("#panel"+panelID+"-selector").val(newValue);
    $("#panel"+panelID+"-selector").selectpicker("refresh");
    // var panelWidth = $(this).parent().parent().parent().css("width");
    // var panelPadding = $(this).parent().parent().parent().css("padding");
    // $(this).parent().parent().parent().attr("oldWidth",panelWidth);
    // $(this).parent().parent().parent().attr("oldPadding",panelWidth);
    $(this).parent().parent().parent().animate({width:'toggle',height:'toggle'});
    //$(this).parent().parent().parent().animate({padding:0});
    //$(this).parent().parent().parent().animate({width:0});
});


$('#panels').on('click', 'div div .hide-btn', function() {
    var panelID = $(this).parent().parent().attr('pID');

    //$("#panel"+panelID+"-survey-area").toggle();
    //$("#panel"+panelID+'-question-area').toggle();

    if ($("#col"+panelID).attr("resized") == "true") {
        //var surveyAreaHeight = parseInt($("#panel"+panelID+"-survey-area").css("height"));
        //var questionAreaHeight = parseInt($("#panel"+panelID+"-question-area").css("height"));
        var currentColHeight = parseInt($("#col"+panelID).css("height"));
        if ($("#panel"+panelID+"-survey-area").css("display") == "none") {
            var surveyAreaHeight = parseInt($("#col"+panelID).attr("surveyAreaHeight"));
            var questionAreaHeight = parseInt($("#col"+panelID).attr("questionAreaHeight"));
            $("#col"+panelID).css("height",(currentColHeight+surveyAreaHeight+questionAreaHeight)+"px");
            $("#panel"+panelID).css("height",(currentColHeight+surveyAreaHeight+questionAreaHeight)+"px");
        }
        else{
            $("#col"+panelID).attr("surveyAreaHeight",parseInt($("#panel"+panelID+"-survey-area").css("height")));
            $("#col"+panelID).attr("questionAreaHeight",parseInt($("#panel"+panelID+"-question-area").css("height")));
            var surveyAreaHeight = parseInt($("#col"+panelID).attr("surveyAreaHeight"));
            var questionAreaHeight = parseInt($("#col"+panelID).attr("questionAreaHeight"));
            $("#col"+panelID).css("height",(currentColHeight-surveyAreaHeight-questionAreaHeight)+"px");
            $("#panel"+panelID).css("height",(currentColHeight-surveyAreaHeight-questionAreaHeight)+"px");
        }
    }

    $("#panel"+panelID+"-survey-area").toggle();
    $("#panel"+panelID+'-question-area').toggle();
});

$('#panels').on('click', 'div div .hide-chart-btn', function() {
    var panelID = $(this).parent().parent().attr('pID');
    // $("#panel"+panelID+"-chart-area").attr("oldHeight",parseInt($("#panel"+panelID+"-chart-area").css("height")));
    // $("#panel"+panelID+"-chart-area").attr("oldTop",$("#panel"+panelID+"-chart-area").position().top);    

    if ($("#col"+panelID).attr("resized") == "true") {
        //var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").css("height"));
        //var chartTop = $("#panel"+panelID+"-chart-area").position().top;
        var currentColHeight = parseInt($("#col"+panelID).css("height"));
        //var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").attr("oldHeight"));
        //var chartTop = parseInt($("#panel"+panelID+"-chart-area").attr("origTop"));
        
        if ($("#panel"+panelID+"-chart-area").css("display") == "none") {
            $("#panel"+panelID+"-chart-area").toggle();
            var chartAreaHeight = $("#panel"+panelID+"-chart-area").css("height");
            $("#col"+panelID).css("height",(currentColHeight+chartAreaHeight)+"px");
            $("#panel"+panelID).css("height",(currentColHeight+chartAreaHeight)+"px");
        }
        else{
            var chartAreaHeight = parseInt($("#panel"+panelID+"-chart-area").css("height"));
            $("#panel"+panelID+"-chart-area").toggle();
            $("#col"+panelID).attr("chartHeight",chartAreaHeight);
            //console.log(chartAreaHeight+" "+chartTop+" "+currentColHeight);

            $("#col"+panelID).css("height",(currentColHeight-chartAreaHeight)+"px");
            $("#panel"+panelID).css("height",(currentColHeight-chartAreaHeight)+"px");
        }
    }

    // $("#panel"+panelID+"-chart-area").toggle();
});

$('#panels').on('click','.add-all', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    var allOptions = $("#panel"+panelID+"-selector option");
    var allValues = new Array();
    for (var i=0; i<allOptions.length; i++) allValues = allValues.concat(allOptions[i].value);
    $("#panel"+panelID+"-selector").val(allValues);
    $(".selectpicker").selectpicker("refresh");
    updateChartByQuestionChange(panelID);
});

$('#panels').on('click','.rmv-all', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    $("#panel"+panelID+"-selector").val(null);
    $(".selectpicker").selectpicker("refresh");
    updateChartByQuestionChange(panelID);
});

$('#panels').on('change','.surveyselector', function() {
    var panelID = $(this).parent().parent().parent().parent().attr('pID');
    updatePanelBySurveyChange(panelID);
});

$('#panels').on('change','select.question-selector', function() {
    var panelID = $(this).attr('pID');
    updateChartByQuestionChange(panelID);
    // var allOptions = $(this).find("option");
    // var currentPanel;
    // for (var i=0; i<allOptions.length; i++){
    //     currentPanel = $("#panel"+panelID+"-sm"+allOptions[i].value);
    //     if (containedInArray(allOptions[i].value, $(this).val())) {    
    //         //currentPanel.show();
    //         if (currentPanel.css("display") == "none") {
    //             currentPanel.animate({
    //                 width: 'toggle',
    //                 height: 'toggle',
    //             },"normal",function(){
    //                 if (currentPanel.find(".sm-panel-more").css("visibility") == "hidden") {
    //                     resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
    //                     console.log("resized");
    //                 }
    //                 else resizeCloud(currentPanel.attr("pID"),currentPanel.attr("qID"));
    //             });
    //         }
    //         //$(currentPanel).prependTo($("#panel"+panelID+"-chart-area"));
    //         // if (currentPanel.find(".sm-panel-more").css("visibility") == "hidden") {
    //         //     resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
    //         //     console.log("resized");
    //         // }
    //         // else resizeCloud(currentPanel.attr("pID"),currentPanel.attr("qID"));
    //     }
    //     else {
    //         //currentPanel.hide();
    //         //currentPanel.attr("oldWidth",currentPanel.css("width"));
    //         //currentPanel.attr("oldPadding",currentPanel.css("padding"));
    //         if (currentPanel.css("display") != "none") {
    //             currentPanel.animate({
    //                 width: 'toggle',
    //                 height: 'toggle'
    //             });
    //         }
    //     }
    // }
});

$('#panels').on('click','select.question-selector', function() {
    $(this).parent().find(".dropdown-menu").css("overflow:auto");
});

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
    $(this).parent().parent().animate({width:'toggle',height:'toggle'},"slow",function(){
        $(this).remove();
    });
    //$(this).parent().parent().hide();
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
        //console.log($(allSiblings[i]).attr("tempofftop"));
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
        addOptionTags(nextQuestionSelector);
        nextQuestionSelector.parent().find(".dropdown-menu").css("overflow:auto");

        $("#panel"+pID+"-heading").text(surveyDataIndex[$("#panel"+pID+"-surveyselector").val()]);

        // $("#panel"+pID+" .sm-panel").animate({height:"toggle"},"normal",function(){
        //     $("#panel"+pID+" .sm-panel").remove();
        //     updateDefaultChart(pID);
        //     $("#panel"+pID+" .sm-panel").show("normal");
        // });
        // $("#panel"+pID+" .chart-area").slideUp("normal",function(){
        //     $("#panel"+pID+" .sm-panel").remove();
        //     updateDefaultChart(pID);
        // });
        $("#panel"+pID+" .sm-panel").remove();
        updateDefaultChart(pID);
        $("#panel"+pID+" .chart-area").hide().slideDown("slow");
        //reorderQuestions(panelID);

        $("#panel"+pID).find(".sm-panel").resizable( {
            //containment: "parent",
            //revert: true,
            //aspectRatio: function() { return parseInt($(this).css("width")) / parseInt($(this).css("height"))},
            //aspectRatio: 1,
            alsoResize: $(this).find('.panel'),
            //helper: "ui-resizable-helper",
            //alsoResize: $(this).parent(),
            //resize: function(event, ui) {$(this).find("svg").css("top","-67px");}
            start: function(event, ui) {
                $(this).find(".ui-resizable-se").css("bottom","1px");
                $(this).find(".ui-resizable-se").css("right","5px");
            },
            resize: function(event, ui) {                   
                setActivePanel($(this));
                
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
        $("#panel"+pID).find(".sm-panel .ui-resizable-se").css("right","4px");
        $("#panel"+pID).find(".sm-panel .ui-resizable-se").css("bottom","10px");
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
        // console.log(parseInt($(allSiblings[i]).css("top")));
        // console.log(parseInt($(allSiblings[i]).css("left")));
        // console.log(parseInt($(allSiblings[i]).attr("tempofftop")));
        // console.log(parseInt($(allSiblings[i]).attr("tempoffleft")));
        // console.log($(allSiblings[i]).offset().top);
        // console.log($(allSiblings[i]).offset().left);
        $(allSiblings[i]).css("top",parseInt($(allSiblings[i]).css("top"))+parseInt($(allSiblings[i]).attr("tempofftop"))-$(allSiblings[i]).offset().top);
        $(allSiblings[i]).css("left",parseInt($(allSiblings[i]).css("left"))+parseInt($(allSiblings[i]).attr("tempoffleft"))-$(allSiblings[i]).offset().left);
    }

    // if (window.brushSettings[newSurveyIndex] instanceof Object) {
    //     brushAllCharts(newSurveyIndex,window.brushSettings[newSurveyIndex].qID,window.brushSettings[newSurveyIndex].response,pID);
    // }
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
        nextSmallMultiplePanel.find(".panel-heading").text(qID+":"+$(currentOptions[i]).attr("title"));
        nextSmallMultiplePanel.find(".panel-heading").attr("title",qID+":"+$(currentOptions[i]).attr("title"));
        //$("#panel"+pID+"-sm"+(i+1)+'-heading').text($(currentOptions[i]).text());
        nextSmallMultiplePanel.appendTo("#panel"+pID+"-chart-area");
        nextSmallMultiplePanel.attr("sID",currentSurveyIndex);
        nextSmallMultiplePanel.css("width",nextSmallMultiplePanel.css("width"));
        //nextSmallMultiplePanel.css("height",nextSmallMultiplePanel.css("height"));
        // nextSmallMultiplePanel.find(".ui-resizable-se").css("bottom","1px");
        // nextSmallMultiplePanel.find(".ui-resizable-se").css("right","5px");
        if (surveyDataTable[currentSurveyIndex][1][qID] == "Response") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart");
            createBarChart(pID,qID,currentSurveyIndex,"Response");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Multiple Responses") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart");
            createBarChart(pID,qID,currentSurveyIndex,"Multiple Responses");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Numeric") {
            nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart-num");
            createBarChart(pID,qID,currentSurveyIndex,"Numeric");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Open-Ended Response") {
            nextSmallMultiplePanel.addClass("sm-cloud");
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
    });

    if (window.brushSettings[currentSurveyIndex] instanceof Object) {
        brushAllCharts(currentSurveyIndex,window.brushSettings[currentSurveyIndex].qID,window.brushSettings[currentSurveyIndex].response,$("#panel"+pID));
    }
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
    //nextAllResponses.prependTo("#panels");
    $("#col"+pID).after(nextAllResponses);

    var newText;
    for (var i=2; i<currentResponseNum;i++){
        newText = surveyDataTable[currentSurveyIndex][i][qID];
        if (newText.length > 0){
            nextAllResponses.find(".resp-text").append("<div class='response' rID="+i+"><p>"+newText+"</p><br></div>");
            //nextAllResponses.find(".resp-text").append("<br>");
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
        resize: function(event, ui) {
            var heading_height = $(this).find('.panel-heading').css("height");
            var self_height = $(this).css("height");
            $(this).find(".resp-text").css("height",parseInt(self_height)-parseInt(heading_height));
        }
    });

    var scrollY = nextAllResponses.offset().top;
    nextAllResponses.hide();
    $("body,html").animate({scrollTop:scrollY},"normal",function(){
        //nextAllResponses.animate({width:"toggle",height:"toggle"});
        nextAllResponses.show("normal");
    });
    if (window.brushSettings[currentSurveyIndex] instanceof Object) {
        brushAllCharts(currentSurveyIndex,window.brushSettings[currentSurveyIndex].qID,window.brushSettings[currentSurveyIndex].response,nextAllResponses);
    }
    //nextAllResponses.siblings().animate({position:"relative"});
    // nextAllResponses.hide();
    // nextAllResponses.animate({width:"toggle",height:"toggle"});
    //nextAllResponses.css("overflow","auto").css("resize","both");
    $("#panels").sortable({
        items: '.panel-container',
        cancel: ".no-drag",
        forcePlaceholderSize: true
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
        $(siblingPanels[i]).find(".add-all").removeClass("btn-primary").addClass("btn-default");
        $(siblingPanels[i]).find(".rmv-all").removeClass("btn-primary").addClass("btn-default");
    }
    panel.css("z-index",100);
    if (panel.hasClass("sm-panel")) return;
    if (panel.hasClass("panel-default")) panel.removeClass("panel-default").addClass("panel-primary");
    panel.find(".panel-default").removeClass("panel-default").addClass("panel-primary");
    panel.find(".panel-default-heading").removeClass("panel-default-heading").addClass("panel-primary-heading");
    panel.find(".add-all").removeClass("btn-default").addClass("btn-primary");
    panel.find(".rmv-all").removeClass("btn-default").addClass("btn-primary");
}

function resizePanelAfterToggle(pID) {
       
}

function addOptionTags(selector) {
    var allSpans = selector.parent().find("span.text");
    var allOptions = selector.find("option");
    for (var i=0; i<allOptions.length; i++) {
        $(allSpans[i]).attr("title",$(allOptions[i]).attr("title"));
    }
}

function adjustParentSize(panel) {
    parentElement = panel.parent();
    parentWidth = parseInt(parentElement.css("width"));
    parentHeight = parseInt(parentElement.css("height"));
    parentOffset = parentElement.offset();
    childrenElement = parentElement.children();

    if (childrenElement.length > 0){
        var maxRight = 0;
        var maxBottom = 0;
        for (var i = 0; i < childrenElement.length; i++) {
            if (parseInt($(childrenElement[i]).css("width"))+$(childrenElement[i]).offset().left > maxRight) {
                maxRight = parseInt($(childrenElement[i]).css("width"))+$(childrenElement[i]).offset().left;
            }
            if (parseInt($(childrenElement[i]).css("height"))+$(childrenElement[i]).offset().top > maxBottom) {
                maxBottom = parseInt($(childrenElement[i]).css("height"))+$(childrenElement[i]).offset().top;
            }
        }
    

        parentWidth = maxRight - parentOffset.left;
        parentHeight = maxBottom - parentOffset.top;

        parentElement.css("width",parentWidth);
        parentElement.css("height",parentHeight);
    }
}

function updateChartByQuestionChange(pID) {
    var allOptions = $("#panel"+pID+"-selector").find("option");
    var currentPanel;
    for (var i=0; i<allOptions.length; i++){
        currentPanel = $("#panel"+pID+"-sm"+allOptions[i].value);
        if (containedInArray(allOptions[i].value, $("#panel"+pID+"-selector").val())) {    
            //currentPanel.show();
            if (currentPanel.css("display") == "none") {
                currentPanel.animate({
                    width: 'toggle',
                    height: 'toggle',
                },"normal",function(){
                    if (currentPanel.find(".sm-panel-more").css("visibility") == "hidden") {
                        resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
                        console.log("resized");
                    }
                    else resizeCloud(currentPanel.attr("pID"),currentPanel.attr("qID"));
                });
            }
            //$(currentPanel).prependTo($("#panel"+panelID+"-chart-area"));
            // if (currentPanel.find(".sm-panel-more").css("visibility") == "hidden") {
            //     resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
            //     console.log("resized");
            // }
            // else resizeCloud(currentPanel.attr("pID"),currentPanel.attr("qID"));
        }
        else {
            //currentPanel.hide();
            //currentPanel.attr("oldWidth",currentPanel.css("width"));
            //currentPanel.attr("oldPadding",currentPanel.css("padding"));
            if (currentPanel.css("display") != "none") {
                currentPanel.animate({
                    width: 'toggle',
                    height: 'toggle'
                });
            }
        }
    }
}