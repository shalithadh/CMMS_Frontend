//object
var reportDataTable;
var allReportWiseData = [];


$(document).ready(function () {
    //select2
    $('#projectFilter').select2();
    LoadAllComboData();
    LoadDataTable();
});


//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ContractorReport/GetProjectProgressInitialData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var projects = data["projectDetails"];

            BindAllProjectTitles(projects);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllProjectTitles(projects) {
    $.each(projects, function () {
        $("#projectFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}
// #endregion

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    reportDataTable = $('#reportTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "projectTitle" },
            { "data": "taskName" },
            { "data": "priorityName" },
            { "data": "taskStatus", "visible": false },
            { "data": "taskStatusName" },
            { "data": "startDate" },
            { "data": "startTime" },
            { "data": "endDate" },
            { "data": "endTime" },
            { "data": "assignToName" }
        ],
        "columnDefs": [
            { "visible": false, "targets": 4 }
        ],
        "order": [[3, 'asc']], // order by taskStatus ID
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(4, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="8" style="background-color:	#E5E4E2; font-weight: bold;">' + group + '</td></tr>'
                    );

                    last = group;
                }
            });
        },
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllReportWiseList(projectID) {
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "GET",
        url: window.base_url + "ContractorReport/GetProjectProgressDetails?ProjectID=" + projectID,
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

    var projectID = $("#projectFilter").val();

    //validations
    if (projectID == 0) {
        toastr.warning("Please select a Project", "Warning");
    }
    else {
        LoadAllReportWiseList(projectID);
    }

}
