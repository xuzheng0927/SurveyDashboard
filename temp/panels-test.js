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
    //updatePanelBySurveyChange(focusID);
    //updateDefaultChart(focusID);

    //console.log(parseInt(nextColumn.css("width")));
    //console.log(parseInt(nextColumn.css("height")));
    /*nextColumn.resizable({
        //aspectRatio: parseInt(nextColumn.css("width")) / parseInt(nextColumn.css("height")),
        //stop: function(event, ui) {console.log($(this));},
        //aspectRatio: 1 / 1,
        alsoResize: nextPanel
    });*/
    nextColumn.draggable({
        //containment: "parent",
        start: function(event, ui) {
            //$(this).css("z-index",100);
            //$(this).siblings().css("z-index",0);
            //setActivePanel($(this));
        }
    });

    /*nextColumn.find(".sm-panel").resizable( {
        containment: "parent",
        alsoResize: $(this).find('.panel'),
        //alsoResize: $(this).parent(),
        //resize: function(event, ui) {$(this).find("svg").css("top","-67px");}
        start: function(event, ui) {
            $(this).find(".ui-resizable-se").css("bottom","1px");
            $(this).find(".ui-resizable-s").css("bottom","-3px");
            $(this).find(".ui-resizable-e").show();
        },
        resize: function(event, ui) {       
            $(this).find(".chart-container").css("height","100%");
            //$(this).find(".chart-container").css("width","100%");
            oldSVGH = parseInt($(this).find(".chart-container").css("height"));
            $(this).find(".chart-container").css("height",(oldSVGH-67)+"px");
        }
    });
    nextColumn.find(".sm-panel .ui-resizable-e").css("right","12px");
    nextColumn.find(".sm-panel .ui-resizable-e").hide();
    nextColumn.find(".sm-panel .ui-resizable-s").css("bottom","7px");
    nextColumn.find(".sm-panel .ui-resizable-se").css("right","14px");
    nextColumn.find(".sm-panel .ui-resizable-se").css("bottom","11px");*/
    //setActivePanel(nextColumn);
    //var defaultSVGH = parseInt(nextColumn.find("svg").css("height"));
    //nextColumn.find("svg").css("height",(defaultSVGH+67)+"px");
    //nextColumn.find("svg").css("height","100%");
    //nextColumn.find("svg").css("top","-67px");
}

$('#btnAdd').click(function (e) {
    addNewPanel();
});