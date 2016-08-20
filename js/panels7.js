var panels = function() {
    var currentPID = 0;
    var maxPID = 0;
    var brushSettings = new Array();
    var sID;

    // This function initializes layout of the whole interface and adds small multiples for the default survey
    // [Outside functions]      newTabDOM(pID)      :    defined in panelsDOM7.js
    //                          newSurveyArea(pID)  :    defined in panelsDOM7.js
    //                          newQuestionArea(pID):    defined in panelsDOM7.js
    //                          newChartArea(pID)   :    defined in panelsDOM7.js
    //                          sortable()          :    defined in open source library jQuery UI
    function initializeInterface() {
        // Create DOM "nextTab" containing switchable overview tab and query tab
        // And append "nextTab" to the top container named "panels"
        // Please note that currentPID is 0 here and will be assigned as PID of the whole overview tab
        var nextTab = panelsDOM.newTabDOM(currentPID);
        nextTab.appendTo("#panels");

        // Get the overview tab DOM as jquery object "nextOverview"
        nextOverview = nextTab.find("#overview-area");
        // Create DOM "newSurveyArea" (survey selector), "nextQuestionArea" (question selector) and "nextChartArea" (blank area to put in charts)
        // And then append the three DOM to overview tab
        var nextSurveyArea = panelsDOM.newSurveyAreaDOM(currentPID);
        var nextQuestionArea = panelsDOM.newQuestionAreaDOM(currentPID);
        var nextChartArea = panelsDOM.newChartAreaDOM(currentPID);
        nextSurveyArea.appendTo(nextOverview);
        nextQuestionArea.appendTo(nextOverview);
        nextChartArea.appendTo(nextOverview);

        // Activate Bootstrap selectpicker features
        $(".selectpicker").selectpicker();

        // Create all small multiples for the default selected survey (the first one)
        updateSmallMultiples(currentPID);
        
        // Add tags (tooltips) for options for survey selector in the Bootstrap selectors
        // Note: this function needs to be run every time after a selectpicker() function is executed
        addOptionTags($("#panel"+currentPID+"-surveyselector"));

        // Update the current survey ID (sID)
        sID = $("#overview-area .surveyselector").val();

        // Although no chart is in query tab yet, set query tab as "sortable" (featured by jQuery UI) for future use
        // If charts are added in query tab later, they will be draggable and reorderable
        $("#query-area").sortable({
            item: ".query-chart",   // All chart panels in query tab will have "query-chart" class
            cancel: ".no-drag"      // All elements that shouldn't be dragging handles will have "no-drag" class
        });

        $("#overview-area > .page-header").hide();
        $("#overview-area .another-btn").hide();
    }

    // This function add a new query chart into query tab
    // [Outside functions]      newQueryChartDOM(pID)   :    defined in panelsDOM7.js
    //                          newSurveyArea(pID)      :    defined in panelsDOM7.js
    //                          newQuestionArea(pID)    :    defined in panelsDOM7.js
    //                          newQuestionSelector(pID):    defined in panelsDOM7.js
    //                          resizable()             :    defined in open source library jQuery UI
    //                          createQueryEmpty(pID)   :    defined in empty.js
    function addNewQueryChart() {
        // Record IDs, maximum panel ID is increased by 1 becomes the current panel ID
        maxPID += 1;
        currentPID = maxPID;

        // Create DOMs of new query chart panel and append it to query tab
        var nextQueryChart = panelsDOM.newQueryChartDOM(currentPID);
        nextQueryChart.appendTo($("#query-area"));

        // Create DOM of new survey selector, set value of the new survey selector as the current sID
        // Then hide the survey selector because sID can only be changed from overview tab
        var nextSurveyArea = panelsDOM.newSurveyAreaDOM(currentPID);
        nextSurveyArea.find(".surveyselector").val(sID);
        nextSurveyArea.hide(); 

        // Create DOMs of new question selector and query chart header
        var nextQuestionArea = panelsDOM.newQuestionAreaDOM(currentPID);
        var nextQuestionSelector = panelsDOM.newQuestionSelectorDOM(currentPID); // Note: this DOM adding cannot be omitted in this function!
        var nextQueryHeader = panelsDOM.newQueryHeaderDOM(currentPID);
        
        // Add survey selector, question selector and header into the upper part of chart panel
        nextSurveyArea.prependTo(nextQueryChart.find(".panel"));
        nextQuestionArea.prependTo(nextQueryChart.find(".panel"));
        nextQuestionSelector.appendTo(nextQuestionArea);
        nextQueryHeader.prependTo(nextQueryChart.find(".panel"));
          
        // Activate Bootstrap select features on all new added selectors
        // And add tags (tooltips) to new selectors
        nextQuestionArea.find(".selectpicker").selectpicker("refresh");
        addOptionTags(nextQuestionArea.find(".question-selector"));

        // Get width of query tab
        var query_width = parseInt($("#query-area").css("width"));
        // Activate resizable features on the new query chart
        nextQueryChart.resizable({
            maxWidth: query_width,                  // Please note that the maximum width cannot exceed the width of query tab
            minWidth: 350,
            minHeight: 250,
            alsoResize: $(this).find('.panel'),     // Each chart has an embedded ".panel" container with identical size and should be resized together
            resize: function (event, ui) {
                adjustQCSize($(this).attr("qcID")); // During resizing, all SVG elements will be resized to fit the new size of chart
            },
            stop: function (event, ui) {
                adjustQCSize($(this).attr("qcID")); // Upon finishing resizing, all SVG elements will be resized to fit the new size of chart
            }
        });

        // Create an empty query chart
        createQueryEmpty(currentPID);
        nextQueryChart.find('.another-btn').hide();
    }

    // Function to update small mutiples in overview tab
    // [Outside functions]  resize()            :      defined in open source library jQuery UI
    //                      adjustSMPanelSize   :      defined in panelDOM7.js
    function updateSmallMultiples() {
        // Get new survey ID and update window.sID and header of overview tab
        var newSurveyIndex = $("#overview-area .surveyselector").val();
        sID = newSurveyIndex;
        $(".page-header").text(surveyDataIndex[newSurveyIndex]+" ("+(surveyDataTable[newSurveyIndex].length-2)+" respondents)");

        // Remove exsited question selector and add a new one
        $("#overview-area .question-selector").parent().remove();
        var nextQuestionSelector = panelsDOM.newQuestionSelectorDOM(0);
        nextQuestionSelector.appendTo("#overview-area .question-area");

        // Scan and store values of all options of the new question selector
        // Then "tick" all options by assigning all option values to the selector
        var nextOptions = nextQuestionSelector.find("option");
        var nextOptionValues = new Array();
        for (var i=0;i<nextOptions.length;i++) {
            nextOptionValues[i] = nextOptions[i].value;
        }
        nextQuestionSelector.children().val(nextOptionValues);

        // Refresh all selectpickers and add tags (tooltips)
        $(".selectpicker").selectpicker("refresh");
        addOptionTags(nextQuestionSelector);

        // Remove all existed small multiples, re-create all small multiples in updateDefaultChart function
        $(".sm-panel").remove();
        updateDefaultChart();

        // Make transition effect by hiding the whole chart area (instantly) and show it in fast speed
        $("#overview-area .chart-area").hide().show("fast");

        // Make all small multiples resizable
        $(".sm-panel").resizable( {
            // Each chart has an embedded ".panel" container with identical size and should be resized together
            alsoResize: $(this).find('.panel'),
            minHeight: 150,
            minWidth: 200,
            // Adjust position of se(horizontal and vertical) resize handle when resizing starts
            start: function(event, ui) {
                $(this).find(".ui-resizable-se").css("bottom","1px");
                $(this).find(".ui-resizable-se").css("right","5px");
            },
            // Make extra adjustment when the small multiple panel is being resizing
            resize: function(event, ui) {
                adjustSMPanelSize($(this).attr("qID"));
            }
        });

        // Hide the e (horizontal) resize handle and s (vertical) resize handle (resizing on a single direction is forbidden)
        $("#panels").find(".sm-panel .ui-resizable-e").hide();
        $("#panels").find(".sm-panel .ui-resizable-s").hide();
        // Adjust position of se resize handle
        $("#panels").find(".sm-panel .ui-resizable-se").css("right","4px");
    }

    // Function to add content into all small multiples
    // [Outside functions]      createBarChart(...) :       Defined in barchart.js
    //                          createQueryHistogram(...) : Defined in querybarchart.js
    //                          createFullResponses(...) :  Defined in fullresponses.js
    //                          sortable() :                Defined in open source library jQuery UI
    //                          brushAllCharts(...) :       Defined in brushing.js
    function updateDefaultChart() {
        // Get survey index and panel ID
        var currentSurveyIndex = sID;
        var pID = 0;
        var DOMConstants = panelsDOM.getDOMConstants();

        // Scan all question ID of the current survey
        for (qID in surveyResponseAnswer[currentSurveyIndex]){
            // For each type of question, there is a corresponding Bootstrap class defined in panelsDOM7.js
            // Create a new small multiple panel DOM based on the acquired Bootstrap class
            var panel_class = DOMConstants.sm_panel_class[surveyDataTable[currentSurveyIndex][1][qID]];
            var nextSmallMultiplePanel = panelsDOM.newSmallMultiplePanelDOM(pID,qID,panel_class);

            // Append the new small multiple panel to chart area in ovreview tab and assign sID as its attribute
            nextSmallMultiplePanel.appendTo("#overview-area .chart-area");
            nextSmallMultiplePanel.attr("sID",currentSurveyIndex);

            // Fill in question wording content in heading of the panel, adjust its appearance and add tooltip to the text
            nextSmallMultiplePanel.find(".panel-heading").append($("<div class='text-content'>"+qID+":"+surveyDataTable[currentSurveyIndex][0][qID]+"</div>"));
            nextSmallMultiplePanel.find(".text-content").css("padding","5px 12px 5px 5px");
            nextSmallMultiplePanel.find(".panel-heading").attr("title",qID+":"+surveyDataTable[currentSurveyIndex][0][qID]);

            // Adjust dimension of small multiple panel
            nextSmallMultiplePanel.css("width",parseInt(nextSmallMultiplePanel.css("width"))-2);
            nextSmallMultiplePanel.find(".chart-container").css("height", DOMConstants.default_smcon_height);
            
            // Read question type of each question from survey data table
            // Assign the current small multiple with corresponding class of chart type
            // Then call the corresponding function to draw
            if (surveyDataTable[currentSurveyIndex][1][qID] == "Response") {
                nextSmallMultiplePanel.addClass("sm-barchart");
                barchart.createBarChart(pID,qID,currentSurveyIndex,"Response");
            }
            else if (surveyDataTable[currentSurveyIndex][1][qID] == "Multiple Responses") {
                nextSmallMultiplePanel.addClass("sm-barchart");
                barchart.createBarChart(pID,qID,currentSurveyIndex,"Multiple Responses");
            }
            else if (surveyDataTable[currentSurveyIndex][1][qID] == "Numeric") {
                nextSmallMultiplePanel.addClass("sm-barchart-num");
                barchart.createQueryHistogram(pID,qID); 
            }
            else if (surveyDataTable[currentSurveyIndex][1][qID] == "Open-Ended Response") {
                nextSmallMultiplePanel.addClass("sm-text");
                textResponses.createFullResponses(pID,qID,currentSurveyIndex);
            }
            else if (surveyDataTable[currentSurveyIndex][1][qID] == "Ranking Response") {
                nextSmallMultiplePanel.addClass("sm-barchart-rank");
                barchart.createBarChart(pID,qID,currentSurveyIndex,"Ranking Response");
            }
            else {
                // Reserved for any possible new type
            }
        }

        // Set chart area of overview tab as sortable, i.e., small multiples can be dragged and reordered
        $("#overview-area .chart-area").sortable({
            containment: 'parent',      // Must be dragged within their container
            items: '.sm-panel',
            cancel: 'svg',              // SVG cannot be dragging handle
            forcePlaceholderSize: true
        });

        // If brushing has been performed before, brush all charts to synchronize
        if (brushSettings[currentSurveyIndex] instanceof Object) {
            brushAllCharts(currentSurveyIndex,brushSettings[currentSurveyIndex].qID,brushSettings[currentSurveyIndex].response,$("#overview-area"),brushSettings[currentSurveyIndex].clickedbar);
        }

        $("#overview-area .another-btn").hide();
    }

    // Function to add tags (tooltips) to options of a selector
    // [Parameter] selector :   (DOM of a certain Bootstrap selector)
    function addOptionTags(selector) {
        // Get all "span.text" DOMs, which are the text actually being displayed on the drop-down menu
        var allSpans = selector.parent().find("span.text");
        
        // Get all the options in the selector
        var allOptions = selector.find("option");

        // Assign each "span.text" DOM with a title, whose content is the same as the title of its counterpart of option
        for (var i=0; i<allOptions.length; i++) {
            $(allSpans[i]).attr("title",$(allOptions[i]).attr("title"));
        }

        // Adjust appearance of drop-down menu text ("span.text" DOMs)
        allSpans.css("width","97%")
        allSpans.css("display","block")
        allSpans.css("white-space","pre-wrap")
        allSpans.css("word-wrap","break-word")
        allSpans.css("word-break","normal")
    }

    // Function to hide or show a small multiple panel, depending on the change in a question selector
    // [Outside functions]  containedInArray(element, array)    : defined in general.js
    //                      resizeRect(pID, qID)                : defined in resize.js
    function toggleSMByQuestionChange() {
        // Get all the options in the question selector
        var allOptions = $("#panel0-selector").find("option");

        // Scan all SMs to see whether they are visible by using option values
        var currentPanel;   // Temporary variable of a SM panel
        for (var i=0; i<allOptions.length; i++){
            // Get the SM panel corresponding to the current option value
            currentPanel = $("#panel0-sm"+allOptions[i].value);

            // If the current option value is "ticked", i.e., is in value array of the question selector,
            // check whether this SM panel is visible or not, if not, make it visible by "toggling" it
            // and do resizing on its rect element
            if (utils.containedInArray(allOptions[i].value, $("#panel0-selector").val())) {
                if (currentPanel.css("display") == "none") {
                    currentPanel.animate({
                        width: 'toggle',
                        height: 'toggle',
                    },"normal",function(){
                        if (!currentPanel.hasClass("sm-text")) barchart.resizeRect(currentPanel.attr("pID"),currentPanel.attr("qID"));
                    });
                }
            }
            // If the current option value is not "ticked" and the SM panel is visible, make it invisible by "toggling" it
            else {
                if (currentPanel.css("display") != "none") {
                    currentPanel.animate({
                        width: 'toggle',
                        height: 'toggle'
                    });
                }
            }
        }
    }

    // Function to create a chart in query tab
    // [Parameters]                            sID  : survey ID, one single integer
    //                                         qID  : question ID, an array of string(s)
    //                                         qcID : query chart ID, one single integer
    // [Outside functions]    createQueryEmpty(qcID)        : defined in empty.js
    //                        createQueryBarchart(qcID)     : defined in querybarchart.js
    //                        createFullResponses(...)      : defined in fullresponse.js
    //                        createQueryHeatmap(qcID)      : defined in queryheatmap.js
    //                        createQueryScatter(...)       : defined in scatter.js
    //                        createQueryCorrelation(qcID)  : defined in correlation.js
    //                        createQueryStacked(qcID)      : defined in stacked.js
    function createQueryChart(sID, qID, qcID) {
        // If qID has no content, create empty chart
        if (qID == null) {
            createQueryEmpty(qcID); 
            // Update chart header
            $("#query-chart"+qcID+" .query-header").text("Selected questions: none");
        }
        // If qID has only one string
        else if (qID.length == 1) {
            // If the type of question is NOT open-ended question, create a bar chart designed for query tab
            // Otherwise create a full response panel
            if (surveyDataTable[sID][1][qID[0]] != "Open-Ended Response") barchart.createQueryBarchart(qcID);
            else textResponses.createFullResponses(qcID,qID[0],sID,"query");

            // Update chart header
            $("#query-chart"+qcID+" .query-header").text("Selected question: "+qID[0]+" "+surveyDataTable[sID][0][qID[0]]);
            $("#query-chart"+qcID+" .query-header").attr("title","Selected question: "+qID[0]+" "+surveyDataTable[sID][0][qID[0]]);
        }
        // If qID has two strings
        else if (qID.length == 2) {
            // If both questions are response questions or multi-response questions, create a heat map
            // If both questions are numeric questions, create a scatter plot
            // Otherwise create an empty chart
            if (utils.containedInArray(surveyDataTable[sID][1][qID[0]],["Response","Multiple Responses"]) &&
                utils.containedInArray(surveyDataTable[sID][1][qID[1]],["Response","Multiple Responses"])) {
                heatmap.createQueryHeatmap(qcID);
            }
            else if (surveyDataTable[sID][1][qID[0]] == "Numeric" && surveyDataTable[sID][1][qID[1]] == "Numeric") {
                scatterPlot.createQueryScatter(qcID);
            }
            else createQueryEmpty(qcID);
            // Update chart header (using getQueryHeaderText() which is defined at the end of this function)
            $("#query-chart"+qcID+" .query-header").text(getQueryHeaderText(qID));
            $("#query-chart"+qcID+" .query-header").attr("title",getQueryHeaderText(qID));
        }
        // If qID has three or more strings
        else {
            // If the first question is a numeric question, test whether all questions are numeric questions,
            // if yes, create a correlation matrix, otherwise create an empty chart
            if (surveyDataTable[sID][1][qID[0]] == "Numeric")
            {
                var allNumeric = true;
                for (var i=0; i<qID.length; i++) {
                    if ((surveyDataTable[sID][1][qID[i]]) != "Numeric") {
                        allNumeric = false;
                        break;
                    }
                }
                if (allNumeric == true) correMatrix.createQueryCorrelation(qcID);
                else createQueryEmpty(qcID);
            }
            // If the first question is not a numeric question, check whether all the questions have an identical set of responses,
            // if yes, create a stacked bar chart, otherwise create an empty chart
            else {
                var sameResp = true;
                for (var i=0; i<qID.length-1; i++) {
                    if (!utils.equalArrays(surveyResponseAnswer[sID][qID[i]],surveyResponseAnswer[sID][qID[i+1]])) {
                        sameResp = false;
                        break;
                    }
                    // Please note here ranking question could not be presented in a stacked bar chart
                    if (surveyResponseAnswer[sID][qID[i]] == "Ranking Response") {
                        sameResp = false;
                        break;
                    }
                }
                if (sameResp == true) stackedBarchart.createQueryStacked(qcID);
                else createQueryEmpty(qcID);
            }
            // Update chart header (using getQueryHeaderText() which is defined at the end of this function)
            $("#query-chart"+qcID+" .query-header").text(getQueryHeaderText(qID));
            $("#query-chart"+qcID+" .query-header").attr("title",getQueryHeaderText(qID));
        }

        // If brushing has been perform before (brushing.brushSettings exists as an object),
        // perform this brushing again to synchronize the new chart
        if (brushSettings[sID] instanceof Object) {
            brushAllCharts(sID,brushSettings[sID].qID,brushSettings[sID].response,$("#query-area"),brushSettings[sID].clickedbar,brushSettings[sID].resptype);
        }

        // Function used to get header text from two or more question IDs
        function getQueryHeaderText(qID) {
            var headerText = "Selected questions:";
            for (var i=0; i<qID.length; i++) {
                headerText += (" "+qID[i]);
                if (i != qID.length - 1) headerText += ",";
            }
            return headerText;
        }
    }

    // Response function upon clicking on "+" button (will add a new query chart)
    $('#panels').on('click','.add-btn',function() {
        addNewQueryChart();
    })

    // Hide or show the "+" button (used to add query chart) in the right top corner
    // THis is because the "+" button only shows when query tab is visible
    $('#panels').on('click','[href="#overview-area"]',function() {
        $(".add-btn").hide();
    })
    $('#panels').on('click','[href="#query-area"]',function() {
        $(".add-btn").show();
    })

    // Function to close or delete a chart panel in query tab, called when users click on the 'X' icon
    $('#panels').on('click', '.panel-close', function() {
        $(this).parent().parent().animate({width:'toggle',height:'toggle'},"slow",function(){
            $(this).remove();
        });
    });

    // Function to close a small multiple chart in overview tab
    // [Outside function]   removeElement :     defined in general.js
    $('#panels').on('click', '.sm-panel-close', function() {
        // Get question ID of the small multiple and remove it from value list of the current question selector
        var valueToRemove = $(this).parent().parent().parent().attr("qID");
        var newValue = removeElement(valueToRemove,$("#panel0-selector").val());

        // Update question selector with new values and refresh its selectpicker counterpart
        $("#panel0-selector").val(newValue);
        $("#panel0-selector").selectpicker("refresh");
        addOptionTags($("#panel0-selector"));

        // Hide the small multiple
        $(this).parent().parent().parent().animate({width:'hide',height:'hide'});
    });

    // Function to toggle setting widgets (all selectors) when clicking "gear" button
    $('#panels').on('click', '.hide-btn', function() {
        // Adjust visibility of borders to make sure the whole overview tab has solid top border
        // If top border of chart area was invisible, it means selectors are to be hidden, so make it visible (solid) after hiding survey selector
        // If top border of chart area was visible, it means selectors are to be shown, so make it invisible then show survey selector
        if ($(".chart-area").css("border-top-style") == "none") {
            $("#overview-area .survey-area").slideToggle("slow",function(){
                $(".chart-area").css("border-top-style","solid");
            });
        }
        else {
            $(".chart-area").css("border-top-style","none");
            $("#overview-area .survey-area").slideToggle("slow",function(){
            });
        }

        // Simply toggle question selector, page header (in overview tab) and query chart headers because they are not affected by chart area border
        $(".question-area").slideToggle("slow");
        $("#overview-area .page-header").slideToggle("slow");
        $("#query-area .query-header").slideToggle("slow");
    });

    // Function called when the selected survey changes in overview tab
    $('#panels').on('change','#overview-area .surveyselector', function(event) {
        // Remove all existed query charts
        $(".query-chart").remove();

        // Refresh all Bootstrap selectpickers and get new sID
        $(".selectpicker").selectpicker("refresh");
        sID = $(this).val();

        // Update small multiples and add a new query chart
        updateSmallMultiples(0);
        addNewQueryChart();
    });

    // Function called when value of a question selector is changed in overview tab
    $('#panels').on('change','#overview-area select.question-selector', function() {
        // Update charts in overview tab (small multiples)
        // Will either show or hide a small multiple (see details in toggleSMByQuestionChange function)
        toggleSMByQuestionChange();
    });

    // Function called when value of a question selector is changed in query tab
    $('#panels').on('change','#query-area select.question-selector', function() {
        // Create new query chart according new selection of questions
        createQueryChart(sID,$(this).val(),$(this).attr('pID'));
    })

    // Function to give word-wrap looking to question selectors, called upon clicking on a question selector
    $('#panels').on('click','select.question-selector', function(event) {
        $(this).parent().find(".dropdown-menu").css("overflow:auto");
    });

    // Function called when the browser is resized
    // [Outside function]   resizeQueryElements() :     defined in resize.js
    $(window).resize(function () {
        // If query tab is visible, resize all SVG elements in query tab
        if ($("#query-area").css("display") != "none") resize.resizeQueryElements();
    });

    function getSID() {
        return sID;
    }

    function getBrushSettings() {
        return brushSettings;
    }

    return {
        getSID:                 getSID,
        getBrushSettings:       getBrushSettings,
        initializeInterface:    initializeInterface,
        addNewQueryChart:       addNewQueryChart
    }
}();
