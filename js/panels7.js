// Global variable declaration
window.focusID = 0;
window.previousID = 0;
window.maxID = 0;
window.maxSelectorID = new Array();
window.brushSettings = new Array();
//panel_col_class="col-lg-12";

function addNewPanel() {
    // Record IDs, focus ID become previous ID, max ID is increased by 1 becomes the focus ID
    // window.previousID = window.focusID;
    // window.maxID += 1;
    // window.focusID = window.maxID;

    // If there is more than one panels, dehighlight the previous focused panel
    /*if (window.previousID!=0){
        dehighlightPanel(window.previousID);       
    }*/

    // Create new panel DOM object
    // var nextColumn = newColumnDOM(focusID);
    // var nextPanel = newPanelDOM(focusID);
    var nextTab = newTabDOM(focusID);
    //var nextTabContent = newTabContentDOM();
    var nextOverview = newOverviewDOM(focusID);

    var nextSurveyArea = newSurveyAreaDOM(focusID);
    var nextQuestionArea = newQuestionAreaDOM(focusID);
    //var nextChartSelect = newChartSelectDOM(focusID);
    var nextChartArea = newChartAreaDOM(focusID);

    // Append the column to panels
    //nextColumn.prependTo("#panels");

    // Append the panel to parent column
    //nextPanel.appendTo(nextColumn);
    nextTab.appendTo("#panels");
    //nextTabContent.appendTo("#panels");
    nextOverview = nextTab.find("#overview-area");

    nextSurveyArea.appendTo(nextOverview);
    nextQuestionArea.appendTo(nextOverview);
    //nextChartSelect.appendTo(nextOverview);
    nextChartArea.appendTo(nextOverview);

    $(".selectpicker").selectpicker();

    updatePanelBySurveyChange(focusID);
    //nextColumn.hide();
    
    addOptionTags($("#panel"+focusID+"-surveyselector"));

    window.sID = $("#overview-area .surveyselector").val();

    //$("#panel"+focusID).css("margin","0");
    //nextColumn.animate({width:'toggle',height:'toggle'});
    $("#query-area").sortable({
        item: ".query-chart",
        cancel: "rect"
    })
}

function addNewQueryChart() {
    // Record IDs, focus ID become previous ID, max ID is increased by 1 becomes the focus ID
    window.previousID = window.focusID;
    window.maxID += 1;
    window.focusID = window.maxID;

    var nextQueryChart = newQueryChartDOM(focusID);
    var nextSurveyArea = newSurveyAreaDOM(focusID);
    nextSurveyArea.find(".surveyselector").val(window.sID);
    var nextQuestionArea = newQuestionAreaDOM(focusID);
    var nextQuestionSelector = newQuestionSelectorDOM(focusID);
    var nextQueryHeader = newQueryHeaderDOM(focusID);

    nextQueryChart.appendTo($("#query-area"));
    nextSurveyArea.prependTo(nextQueryChart.find(".panel"));
    //nextQuestionArea.appendTo(nextQueryChart);
    nextQuestionArea.prependTo(nextQueryChart.find(".panel"));
    nextQuestionSelector.appendTo(nextQuestionArea);
    nextQueryHeader.prependTo(nextQueryChart.find(".panel"));
    nextSurveyArea.hide();

    addOptionTags(nextSurveyArea.find(".surveyselector"));

    $(".selectpicker").selectpicker("refresh");
    var query_width = parseInt($("#query-area").css("width"))

    nextQueryChart.resizable({
        maxWidth: query_width,
        minWidth: 350,
        minHeight: 250,
        alsoResize: $(this).find('.panel'),
        resize: function (event, ui) {
            adjustQCSize($(this).attr("qcID"));
        },
        stop: function (event, ui) {
            adjustQCSize($(this).attr("qcID"));
        }
    });

    //adjustQCSize($(this).attr("qcID"));
    createQueryEmpty(window.focusID);
}

$('#btnAdd').click(function (e) {
    addNewPanel();
});

$('#panels').on('click','.add-btn',function() {
    addNewQueryChart();
})

$('#panels').on('click','[href="#overview-area"]',function() {
    $(".add-btn").hide();
})

$('#panels').on('click','[href="#query-area"]',function() {
    $(".add-btn").show();
})

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


$('#panels').on('click', '.hide-btn', function() {

    // $(".survey-area").slideToggle("slow");
    // $(".question-area").slideToggle("slow");

    if ($(".chart-area").css("border-top-style") == "none") {
        $("#overview-area .survey-area").slideToggle("slow",function(){
            $(".chart-area").css("border-top-style","solid");
            //adjustQueryChart();
            //$(".chart-area").css("border-radius","0 4px 0 0");
        });
        
        // $(".chart-area").css("border-top-style","solid");
        // $(".chart-area").css("border-radius","0 4px 0 0");
    }
    else {
        $(".chart-area").css("border-top-style","none");
        //$(".chart-area").css("border-radius","0 0 0 0");
        $("#overview-area .survey-area").slideToggle("slow",function(){
            //adjustQueryChart();
        });
        // $(".question-area").slideToggle("slow");
        // $("#overview-area .page-header").slideToggle("slow");
        // $("#query-area .query-header").slideToggle("slow");
    }
    $(".question-area").slideToggle("slow");
    $("#overview-area .page-header").slideToggle("slow");
    $("#query-area .query-header").slideToggle("slow");

    function adjustQueryChart(){
    if ($("#query-area").css("display") != "none") {
        var allQueryChart = $("#query-area .query-chart");
        var tempCHeight, tempPHeight;
        if ($("#query-area .question-area").css("display") == "none") {
            for (var i=0; i<allQueryChart.length; i++) {
                tempCHeight = parseInt($(allQueryChart[i]).css("height"));
                tempPHeight = parseInt($(allQueryChart[i]).find(".panel").css("height"));
                $(allQueryChart[i]).css("height",tempCHeight-44);
                $(allQueryChart[i]).find(".panel").css("height",tempPHeight-44);
            }
        }
        else {
            for (var i=0; i<allQueryChart.length; i++) {
                tempCHeight = parseInt($(allQueryChart[i]).css("height"));
                tempPHeight = parseInt($(allQueryChart[i]).find(".panel").css("height"));
                $(allQueryChart[i]).css("height",tempCHeight-44);
                $(allQueryChart[i]).find(".panel").css("height",tempPHeight-44);
            }
        }
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


$('#panels').on('change','#overview-area .surveyselector', function(event) {
    //console.log(event.target)
    var panelID = $(this).parent().parent().parent().attr('pID');
    $(".query-chart").remove();
    $(".selectpicker").selectpicker("refresh");
    window.sID = $(this).val();
    updatePanelBySurveyChange(0);
    addNewQueryChart();
});

$('#panels').on('change','#query-area .surveyselector', function(event) {
    console.log($(this).siblings());
    $(".query-chart").remove();
    window.sID = $(this).val()

    $(".surveyselector").val(window.sID);
    //$(".selectpicker").selectpicker("refresh");

    // $("#overview-area").addClass("active");
    // $("#overview-area").addClass("in");
    // $("#query-area").removeClass("active");
    // $("#query-area").removeClass("in");
    // $("[href='#overview-area']").attr("aria-expanded","true");
    // $("[href='#overview-area']").parent().addClass("active");
    // $("[href='#query-area']").attr("aria-expanded","false");
    // $("[href='#query-area']").parent().removeClass("active");

    //updatePanelBySurveyChange(0);
    addNewQueryChart();
    //$("[href='#overview-area']").attr("needrefresh","true");
    window.needrefresh = "true";
    $("body").children(".btn-group").remove();
    //console.log($(this).siblings());
});

// $('[type="#overview-btn"]').click(function() {
//     if ($(this).attr("needrefresh") == "true") {
//         console.log("refreshing");
//         $(this).find(".surveyselector").val(window.sID);
//         $(".selectpicker").selectpicker("refresh");
//         updatePanelBySurveyChange(0);
//         $(this).attr("needrefresh","false");
//     }
// })
$(window).click(function(event){
    //console.log($(event.target).attr("href"));
    if ($(event.target).attr("href") == "#overview-area" & window.needrefresh == "true") {
        $("#overview-area .surveyselector").val(window.sID);
        $(".selectpicker").selectpicker("refresh");
        $(".sm-panel").remove();
        setTimeout(function() {
            updatePanelBySurveyChange(0);
            window.needrefresh = "false";
        }, 150);
        //window.needrefresh == "false";
    }

    if ($(event.target).attr("href") == "#query-area") setTimeout(function() {resizeQueryElements();},150)
})

$('#panels').on('click','[href="overview-area"]', function(event) {
    updatePanelBySurveyChange(0);
    $("[href='overview-area']").attr("needrefresh","false");
});

$('#panels').on('change','select.question-selector', function() {
    var panelID = $(this).attr('pID');
    updateChartByQuestionChange(panelID);
});

$('#panels').on('change','#query-area select.question-selector', function() {
    createQueryChart(window.sID,$(this).val(),$(this).attr('pID'));
    //createQueryBarchart($(this).attr('pID'));
})

$('#panels').on('click','select.question-selector', function(event) {
    $(this).parent().find(".dropdown-menu").css("overflow:auto");
});

$('#panels').on('click', 'img', function() {
    var panelID = $(this).attr('pID');
    $(this).siblings().css("border-width","0px");
    $(this).css("border-width","2px");
    $("#panel"+panelID+" svg text").text($(this).attr("id"));
});

$('#panels').on('click', '.panel-container', function() {
    setActivePanel($(this));
});

$(window).resize(function () {
    if ($("#query-area").css("display") != "none") resizeQueryElements();
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

function updatePanelBySurveyChange(pID) {
    var newSurveyIndex = $("#overview-area .surveyselector").val();
    window.sID = newSurveyIndex;
    $(".page-header").text(surveyDataIndex[newSurveyIndex]+" ("+(surveyDataTable[newSurveyIndex].length-2)+" respondents)");
    //var allSiblings = $("#col"+pID).siblings();

    if (newSurveyIndex != null) {
        //$("#panel"+panelID+"-addbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-addallbtn").removeAttr("disabled");
        //$("#panel"+panelID+"-chart-select").show();
        //$("#panel"+pID+"-chart-area").show();

        $("#overview-area .question-selector").parent().remove();
        var nextQuestionSelector = newQuestionSelectorDOM(pID);
        nextQuestionSelector.appendTo("#overview-area .question-area");
        var nextOptions = nextQuestionSelector.find("option");
        var nextOptionValues = new Array();
        for (var i=0;i<nextOptions.length;i++) {
            nextOptionValues[i] = nextOptions[i].value;
        }
        nextQuestionSelector.children().val(nextOptionValues);
        $(".selectpicker").selectpicker("refresh");
        addOptionTags(nextQuestionSelector);
        nextQuestionSelector.parent().find(".dropdown-menu").css("overflow:auto");

        //$("#panel"+pID+"-heading").text(surveyDataIndex[$("#panel"+pID+"-surveyselector").val()]+" ("+(surveyDataTable[newSurveyIndex].length-2)+ " respondents)");

        // $("#panel"+pID+" .sm-panel").animate({height:"toggle"},"normal",function(){
        //     $("#panel"+pID+" .sm-panel").remove();
        //     updateDefaultChart(pID);
        //     $("#panel"+pID+" .sm-panel").show("normal");
        // });
        // $("#panel"+pID+" .chart-area").slideUp("normal",function(){
        //     $("#panel"+pID+" .sm-panel").remove();
        //     updateDefaultChart(pID);
        // });
        $(".sm-panel").remove();
        updateDefaultChart(pID);
        $("#overview-area .chart-area").hide().show("fast");
        //reorderQuestions(panelID);

        $(".sm-panel").resizable( {
            //containment: "parent",
            //revert: true,
            //aspectRatio: function() { return parseInt($(this).css("width")) / parseInt($(this).css("height"))},
            //aspectRatio: 1,
            alsoResize: $(this).find('.panel'),
            //helper: "ui-resizable-helper",
            //alsoResize: $(this).parent(),
            //resize: function(event, ui) {$(this).find("svg").css("top","-67px");}
            minHeight: 150,
            minWidth: 200,
            start: function(event, ui) {
                $(this).find(".ui-resizable-se").css("bottom","1px");
                $(this).find(".ui-resizable-se").css("right","5px");
            },
            resize: function(event, ui) {                   
                
                adjustSMPanelSize($(this).attr("qID"));
                //console.log("keeptop:"+$(this).attr("keeptop")+" top:"+$(this).css("top")+" offset-top:"+$(this).offset().top+" csstop:"+$(this).attr("csstop"));
                //$(this).find(".chart-container").css("height","100%");
                //$(this).find(".chart-container").css("width","100%");
                //var old_con_height = parseInt($(this).find(".chart-container").css("height"));
                //var heading_height = parseInt($(this).find(".panel-heading").css("height"));
                //$(this).find(".chart-container").css("height",(old_con_height - heading_height)+"px");
                // if ($(this).find(".sm-panel-more").css("visibility") == "hidden") {
                //     resizeRect($(this).attr("pID"),$(this).attr("qID"));
                // }
                // else {
                //     resizeCloud($(this).attr("pID"),$(this).attr("qID"));
                // }
                //if (!$(this).hasClass("sm-text")) resizeRect($(this).attr("pID"),$(this).attr("qID"));
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
                //if (!$(this).hasClass("sm-text")) resizeRect($(this).attr("pID"),$(this).attr("qID"));
            }
        });
        $("#panels").find(".sm-panel .ui-resizable-e").hide();
        //nextColumn.find(".sm-panel .ui-resizable-s").css("bottom","7px");
        $("#panels").find(".sm-panel .ui-resizable-s").hide();
        $("#panels").find(".sm-panel .ui-resizable-se").css("right","4px");
        //$("#panels").find(".sm-panel .ui-resizable-se").css("bottom","1px");
    }
    else {
        //$("#panel"+panelID+"-addbtn").hide();
        //$("#panel"+pID+"-heading").text("New Panel "+pID);
        $("#overview-area .question-selector").remove();
        //$("#panel"+panelID+"-addbtn").attr("disabled","disabled");
        //$("#panel"+panelID+"-addallbtn").attr("disabled","disabled");
        //$("#overview-area chart-select").hide();
        $("#overview-area .chart-area").hide();
    }

    // for (var i=0; i<allSiblings.length; i++){
    //     // console.log(parseInt($(allSiblings[i]).css("top")));
    //     // console.log(parseInt($(allSiblings[i]).css("left")));
    //     // console.log(parseInt($(allSiblings[i]).attr("tempofftop")));
    //     // console.log(parseInt($(allSiblings[i]).attr("tempoffleft")));
    //     // console.log($(allSiblings[i]).offset().top);
    //     // console.log($(allSiblings[i]).offset().left);
    //     $(allSiblings[i]).css("top",parseInt($(allSiblings[i]).css("top"))+parseInt($(allSiblings[i]).attr("tempofftop"))-$(allSiblings[i]).offset().top);
    //     $(allSiblings[i]).css("left",parseInt($(allSiblings[i]).css("left"))+parseInt($(allSiblings[i]).attr("tempoffleft"))-$(allSiblings[i]).offset().left);
    // }

    // if (window.brushSettings[newSurveyIndex] instanceof Object) {
    //     brushAllCharts(newSurveyIndex,window.brushSettings[newSurveyIndex].qID,window.brushSettings[newSurveyIndex].response,pID);
    // }
}

function updateDefaultChart(pID) {
    var currentSurveyIndex = $(".surveyselector").val();
    //var currentOptions = $("#panel"+pID+"-selector").find("option");
    //var currentOptionValues = new Array();
    //var qID;

    for (qID in surveyResponseAnswer[currentSurveyIndex]){
        //var qID = i+1;
        //qID = currentOptions[i].value;
        var panel_class = sm_panel_class[surveyDataTable[currentSurveyIndex][1][qID]];
        var nextSmallMultiplePanel = newSmallMultiplePanelDOM(pID,qID,panel_class);
        // nextSmallMultiplePanel.find(".panel-heading").text(qID+":"+surveyDataTable[currentSurveyIndex][0][qID]);
        nextSmallMultiplePanel.find(".panel-heading").append($("<div class='text-content'>"+qID+":"+surveyDataTable[currentSurveyIndex][0][qID]+"</div>"));
        nextSmallMultiplePanel.find(".text-content").css("padding","5px 12px 5px 5px");
        nextSmallMultiplePanel.find(".panel-heading").attr("title",qID+":"+surveyDataTable[currentSurveyIndex][0][qID]);
        //$("#panel"+pID+"-sm"+(i+1)+'-heading').text($(currentOptions[i]).text());
        nextSmallMultiplePanel.appendTo(".chart-area");
        nextSmallMultiplePanel.attr("sID",currentSurveyIndex);


        nextSmallMultiplePanel.css("width",parseInt(nextSmallMultiplePanel.css("width"))-2);
        nextSmallMultiplePanel.find(".chart-container").css("height",default_smcon_height);
        
        //nextSmallMultiplePanel.css("height",nextSmallMultiplePanel.css("height"));
        // nextSmallMultiplePanel.find(".ui-resizable-se").css("bottom","1px");
        // nextSmallMultiplePanel.find(".ui-resizable-se").css("right","5px");
        if (surveyDataTable[currentSurveyIndex][1][qID] == "Response") {
            //nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart");
            //nextSmallMultiplePanel.addClass(sm_panel_bar_class);
            createBarChart(pID,qID,currentSurveyIndex,"Response");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Multiple Responses") {
            //nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart");
            //nextSmallMultiplePanel.addClass(sm_panel_bar_class);
            createBarChart(pID,qID,currentSurveyIndex,"Multiple Responses");
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Numeric") {
            //nextSmallMultiplePanel.find(".sm-panel-more").css("visibility","hidden");
            nextSmallMultiplePanel.addClass("sm-barchart-num");
            //nextSmallMultiplePanel.addClass(sm_panel_bar_class);
            //createBarChart(pID,qID,currentSurveyIndex,"Numeric");
            createQueryHistogram(pID,qID);
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Open-Ended Response") {
            nextSmallMultiplePanel.addClass("sm-text");
            //nextSmallMultiplePanel.addClass(sm_panel_text_class);
            //createWordCloud(pID,qID,currentSurveyIndex);
            createFullResponses(pID,qID,currentSurveyIndex);
        }
        else if (surveyDataTable[currentSurveyIndex][1][qID] == "Ranking Response") {
            nextSmallMultiplePanel.addClass("sm-barchart-rank");
            //nextSmallMultiplePanel.addClass(sm_panel_bar_class);
            createBarChart(pID,qID,currentSurveyIndex,"Ranking Response");
        }
        else {

        }
    }

    $(".chart-area").sortable({
        //placeholder: "ui-state-highlight",
        containment: 'parent',
        items: '.sm-panel',
        cancel: 'svg',
        forcePlaceholderSize: true
    });
    //$(".chart-area").disableSelection();

    if (window.brushSettings[currentSurveyIndex] instanceof Object) {
        brushAllCharts(currentSurveyIndex,window.brushSettings[currentSurveyIndex].qID,window.brushSettings[currentSurveyIndex].response,$("#overview-area"),window.brushSettings[currentSurveyIndex].clickedbar);
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
                    // if (currentPanel.find(".sm-panel-more").css("visibility") == "hidden") {
                    //     resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
                    //     console.log("resized");
                    // }
                    // else resizeCloud(currentPanel.attr("pID"),currentPanel.attr("qID"));

                    if (!currentPanel.hasClass("sm-text")) resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
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

function createQueryChart(sID, qID, qcID) {
    //console.log(qID);
    if (qID == null) {
        createQueryEmpty(qcID);
        $("#query-chart"+qcID+" .query-header").text("Selected questions: none");
    }
    else if (qID.length == 1) {
        if (surveyDataTable[sID][1][qID[0]] != "Open-Ended Response") createQueryBarchart(qcID);
        else createFullResponses(qcID,qID[0],sID,"query");
        $("#query-chart"+qcID+" .query-header").text("Selected question: "+qID[0]+" "+surveyDataTable[sID][0][qID[0]]);
        $("#query-chart"+qcID+" .query-header").attr("title","Selected question: "+qID[0]+" "+surveyDataTable[sID][0][qID[0]]);
    }
    else if (qID.length == 2) {
        if (containedInArray(surveyDataTable[sID][1][qID[0]],["Response","Multiple Responses"]) &
            containedInArray(surveyDataTable[sID][1][qID[1]],["Response","Multiple Responses"])) {
            createQueryHeatmap(qcID);
        }
        else if (surveyDataTable[sID][1][qID[0]] == "Numeric" & surveyDataTable[sID][1][qID[1]] == "Numeric") {
            createQueryScatter(qcID);
        }
        else createQueryEmpty(qcID);
        $("#query-chart"+qcID+" .query-header").text(getQueryHeaderText(qID));
        $("#query-chart"+qcID+" .query-header").attr("title",getQueryHeaderText(qID));
    }
    else {
        if (surveyDataTable[sID][1][qID[0]] == "Numeric")
        {
            var allNumeric = true;
            for (var i=0; i<qID.length-1; i++) {
                if ((surveyDataTable[sID][1][qID[i]]) != "Numeric") {
                    allNumeric = false;
                    break;
                }
            }
            if (allNumeric == true) createQueryCorrelation(qcID);
            else createQueryEmpty(qcID);
        }
        else {
            var sameResp = true;
            for (var i=0; i<qID.length-1; i++) {
                if (!equalArrays(surveyResponseAnswer[sID][qID[i]],surveyResponseAnswer[sID][qID[i+1]])) {
                    sameResp = false;
                    break;
                }
                if (surveyResponseAnswer[sID][qID[i]] == "Ranking Response") {
                    sameResp = false;
                    break;
                }
            }

            if (sameResp == true) createQueryStacked(qcID);
            else createQueryEmpty(qcID);
        }
        $("#query-chart"+qcID+" .query-header").text(getQueryHeaderText(qID));
        $("#query-chart"+qcID+" .query-header").attr("title",getQueryHeaderText(qID));
    }

    if (window.brushSettings[sID] instanceof Object) {
        brushAllCharts(sID,window.brushSettings[sID].qID,window.brushSettings[sID].response,$("#query-area"),window.brushSettings[sID].clickedbar);
    }

    function getQueryHeaderText(qID) {
        var headerText = "Selected questions:";
        for (var i=0; i<qID.length; i++) {
            headerText += (" "+qID[i]);
            if (i != qID.length - 1) headerText += ",";
        }
        return headerText;
    }
}