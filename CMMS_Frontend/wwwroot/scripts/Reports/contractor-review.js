//object
var reportDataTable;
var allReportWiseData = [];

$(document).ready(function () {
    //select2
    $('#yearFilter,#monthFilter').select2();
    LoadAllComboData();
    LoadDataTable();
});


//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ContractorReport/GetContractorReviewInitialData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var years = data["years"];
            var months = data["months"];

            BindAllYear(years);
            BindAllMonth(months);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllYear(years) {
    $.each(years, function () {
        $("#yearFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllMonth(months) {
    $.each(months, function () {
        $("#monthFilter").append($("<option/>").val(this.valueID).text(this.value));
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
            { "data": "contractorName" },
            {
                "data": "overallRating",
                "type": "string",
                "render": function (data, type, row) {
                    var formattedString = (parseFloat(data).toFixed(2).toString())+" / 5.00";
                    return formattedString;
                }
            }
        ],
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllReportWiseList(yearID, monthID) {
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "GET",
        url: window.base_url + "ContractorReport/GetContractorReviewDetails?Year=" + yearID + "&Month=" + monthID,
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

    var yearID = $("#yearFilter :selected").text();
    var monthID = $("#monthFilter").val();

    if (yearID == "All") { yearID = -1; }

    LoadAllReportWiseList(parseInt(yearID), parseInt(monthID))

}