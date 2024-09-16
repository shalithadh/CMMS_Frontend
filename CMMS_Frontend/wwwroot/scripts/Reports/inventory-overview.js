//object
var reportDataTable;
var allReportWiseData = [];

$(document).ready(function () {
    //select2
    $('#vendorCategoryTypeFilter').select2();
    LoadAllComboData();
    LoadDataTable();
});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ItemInventory/GetInitialItemInventoryData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var vendorCategoryTypes = data["vendorCategoryTypes"];

            BindAllVendorCategoryTypes(vendorCategoryTypes);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllVendorCategoryTypes(vendorCategoryTypes) {
    $.each(vendorCategoryTypes, function () {
        $("#vendorCategoryTypeFilter").append($("<option/>").val(this.valueID).text(this.value));
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
            { "data": "vendorCategoryName" },
            { "data": "itemName" },
            { "data": "unitAmount" },
            { "data": "totalQty" },
            { "data": "soldQty" },
            { "data": "availableQty" },
            { "data": "isActiveStatusName" },
        ],
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllReportWiseList(vendorCategoryType) {
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "GET",
        url: window.base_url + "VendorReport/GetInventorySummaryDetails?VendorCategoryTypeID=" + vendorCategoryType,
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

    var vendorCategoryType = $("#vendorCategoryTypeFilter").val();

    LoadAllReportWiseList(parseInt(vendorCategoryType));

}