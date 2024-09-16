//object
var reportDataTable;
var allReportWiseData = [];

$(document).ready(function () {
    //Initialize datatable
    LoadDataTable();
});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    reportDataTable = $('#reportTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "projectID", "visible": false},
            { "data": "projectTitle" },
            { "data": "clientName"},
            { "data": "priorityName"},
            { "data": "startDate", "type": "date"},
            { "data": "endDate", "type": "date" },
            { "data": "newTaskCount"},
            { "data": "inProgressTaskCount"},
            { "data": "completeTaskCount"},
            { "data": "projectProgress"}
        ],
        "order": [[4, 'desc']], // order by startDate
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllReportWiseList(startDate, endDate) {
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "GET",
        url: window.base_url + "ContractorReport/GetProjectOverviewReportDetails?StartDate=" + startDate + "&EndDate=" + endDate,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allReportWiseData = [];
            allReportWiseData = data;
            //clear datatable
            reportDataTable.clear();
            //bind to datatable
            reportDataTable.rows.add(allReportWiseData).draw();

            //loader
            cmmsSvgLoader();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
            //loader
            cmmsSvgLoader();
        }
    })
}

//Filter Button Event
function LoadFilteredList() {

    var startDate = $("#startDateFilter").val();
    var endDate = $("#endDateFilter").val();

    if (startDate == "") { startDate = null; }
    if (endDate == "") { endDate = null; }

    //validations
    if (startDate == null && endDate == null) {
        toastr.warning("Please select a date range", "Warning");
    }
    else if (startDate == null && endDate != null) {
        toastr.warning("Please select a start date", "Warning");
    }
    else if (endDate == null && startDate != null) {
        toastr.warning("Please select a end date", "Warning");
    }

    else {

        var startDateF = new Date(startDate); 
        var endDateF = new Date(endDate);
        if (startDateF > endDateF) {
            toastr.warning("Start date must be less than end date", "Warning");
        }
        else {
            LoadAllReportWiseList(startDate, endDate);
        }   
    }
}