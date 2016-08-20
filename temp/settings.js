//set the settings in sidebar to default.
function clearSettings(){
    $('.selectpicker').selectpicker('deselectAll');
    $('#datetimepicker1').data("DateTimePicker").clear();
    $('#datetimepicker2').data("DateTimePicker").clear();
}

// get filter's value from the sidebar
function getSettings(){
    var chartSettings = {};

    chartSettings.OSSelection = $('#OS').selectpicker('val');
    chartSettings.DeviceSelection = $('#Device').selectpicker('val');
    chartSettings.AssetSelection = $('#Assets').selectpicker('val');
    chartSettings.KPISelection = $('#KPI').selectpicker('val');
    //A moment object
    chartSettings.StartTime = $('#datetimepicker1').data("DateTimePicker").date();
    chartSettings.EndTime = $('#datetimepicker2').data("DateTimePicker").date();
    
    chartSettings.ChartType = $('#ChartType').selectpicker('val');

    return chartSettings;
}
// store chartSettings in settingsArray,update the filter's information in footer
function storeSettings(chartSettings){
    settingsArray[window.currentID] = chartSettings;
    //remove the current footer
    $('#panel'+window.currentID +' .panel-heading').children().remove();
    var newHeading = $('<div>'+chartSettings.ChartType+'</div>');
    newHeading.appendTo($('#panel'+window.currentID +' .panel-heading'));
    //update information and append new footer to the panel
    var newFooter = $('<div class="panel-footer"></div>');
    if(chartSettings.OSSelection){
        var info="OS:" + chartSettings.OSSelection.toString();
        var newLine=$('<p>'+info+'</p>');
        newLine.appendTo(newFooter)
    }
    if(chartSettings.DeviceSelection){
        var info=" Devices:" + chartSettings.DeviceSelection.toString();
        var newLine=$('<p>'+info+'</p>');
        newLine.appendTo(newFooter)
    }
    if(chartSettings.AssetSelection){
        var info=" Assets:" + chartSettings.AssetSelection.toString();
        var newLine=$('<p>'+info+'</p>');
        newLine.appendTo(newFooter)
    }
    if(chartSettings.StartTime && chartSettings.EndTime){
        var info = chartSettings.StartTime.toString() + " to " + chartSettings.EndTime.toString();
        var newLine=$('<p>'+info+'</p>');
        newLine.appendTo(newFooter)
    }
    newFooter.appendTo($('#panel'+window.currentID));
}
//set filters of the sidebar according to chartSettings object
function setSettings(chartSettings){
    clearSettings();

    if(chartSettings.OSSelection){
        $('#OS').selectpicker('val', chartSettings.OSSelection);
    }
    if(chartSettings.DeviceSelection){
        $('#Device').selectpicker('val', chartSettings.DeviceSelection);
    }

    if(chartSettings.AssetSelection){
        $('#Assets').selectpicker('val', chartSettings.AssetSelection);
    }

    if(chartSettings.KPISelection){
        $('#KPI').selectpicker('val', chartSettings.KPISelection);
    }

    if(chartSettings.ChartType){
        $('#ChartType').selectpicker('val', chartSettings.ChartType);
    }

    if (chartSettings.StartTime && chartSettings.EndTime) {
        $('#datetimepicker1').data("DateTimePicker").date(chartSettings.StartTime);
        $('#datetimepicker2').data("DateTimePicker").date(chartSettings.EndTime);
    }
}

//Linked date picker, disable invalid time input
$(function () {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
    
    $("#datetimepicker1").on("dp.change",function (e) {
        if(e.date != null){
            $('#datetimepicker2').data("DateTimePicker").minDate(e.date);
        }
    });
    $("#datetimepicker2").on("dp.change",function (e) {
        if(e.date != null){
            $('#datetimepicker1').data("DateTimePicker").maxDate(e.date);
        }
    });
});


// sticky side bar
$('#side-menu').affix({
      offset: {
        top: 245
      }
});
var $body   = $(document.body);
var navHeight = $('.navbar').outerHeight(true);
$body.scrollspy({
    target: '#leftCol',
    offset: navHeight
});