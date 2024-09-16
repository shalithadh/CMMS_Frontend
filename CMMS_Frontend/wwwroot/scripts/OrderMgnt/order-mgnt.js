//object
var orderMgntDataTable;
var allOrderMgntData = [];
var orderMgntDetailDataTable;
var allOrderMgntDetailData = [];
var today;

$(document).ready(function () {
    //Today's date
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    //select2
    $('#orderStatusFilter,#orderStatus').select2();
    LoadAllComboData();
    //Initialize datatable
    LoadDataTable();
    LoadDetailDataTable();
    LoadAllOrderMgntList(0, null, null);
});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "OrderMgnt/GetInitialOrderMgntData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var orderStatusTypes = data["orderStatusTypes"];

            BindAllOrderStatusTypes(orderStatusTypes);
            BindAllOrderStatusTypesFilter(orderStatusTypes);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllOrderStatusTypes(orderStatusTypes) {
    $.each(orderStatusTypes, function () {
        $("#orderStatus").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllOrderStatusTypesFilter(orderStatusTypes) {
    $.each(orderStatusTypes, function () {
        $("#orderStatusFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}
// #endregion

//Initialize Header DataTable
function LoadDataTable() {
    //debugger;
    orderMgntDataTable = $('#orderMgntTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "orderNo", "width": "10%" },
            { "data": "placedDate", "width": "8%" },
            { "data": "estDeliveryDate", "width": "8%" },
            { "data": "payMethodName", "width": "10%" },
            { "data": "packageID", "width": "5%" },
            { "data": "orderStatusName", "width": "10%" },
            { "data": "customerName", "width": "10%" },
            {
                "data": "orderID",
                "render": function (data, type, row, meta) {
                    return `
                            <button class="btn btn-primary btn-xs" type="button" onclick="LoadOrderDetailInfo(${data},${row.packageID})">
                                <i class="fa fa-pencil-square-o"></i>&nbsp;Update
                            </button>                           
                     `;

                }, "width": "10%"
            }
        ],
        "columnDefs": [
            { "visible": false, "targets": 5 }
        ],
        "order": [[5, 'asc'], [0, 'desc']], //ascending 6th column and descending order 1st column  
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(5, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="7" style="background-color:	#E5E4E2; font-weight: bold;">' + group + '</td></tr>'
                    );

                    last = group;
                }
            });
        },
        "pageLength": 25,
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllOrderMgntList(orderStatusID, startDate, endDate) {

    $.ajax({
        type: "GET",
        url: window.base_url + "OrderMgnt/GetOrderMgntOrderList?OrderStatusID=" + orderStatusID
            + "&StartDate=" + startDate + "&EndDate=" + endDate,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allOrderMgntData = [];
            allOrderMgntData = data;
            //clear datatable
            orderMgntDataTable.clear();
            //bind to datatable
            orderMgntDataTable.rows.add(allOrderMgntData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Initialize Detail DataTable
function LoadDetailDataTable() {
    //debugger;
    orderMgntDetailDataTable = $('#orderMgntDetailTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "itemName", "width": "25%" },
            {
                "data": "unitAmount",
                "type": "string",
                "render": function (data, type, row) {
                    return 'Rs. ' + (parseFloat(data).toFixed(2)).toString();
                }, "width": "25%"
            },
            { "data": "quantity", "type": "string", "width": "20%" },
            {
                "data": "itemWiseTotal",
                "type": "string",
                "render": function (data, type, row) {
                    return 'Rs. ' + (parseFloat(data).toFixed(2)).toString();
                }, "width": "30%"
            },
        ],
        "order": [[0, 'desc']], //descending order 1st column
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadOrderDetailInfo(orderID, packageID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "OrderMgnt/GetOrderDetailByOrderID?OrderID=" + orderID
            + "&PackageID=" + packageID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var header = data.orderHeaderInfo;
            var detail = data.orderDetailInfo;

            //Bind Header Info
            ClearData();
            $('#orderID').val(header[0].orderID);
            $('#orderNo').val(header[0].orderNo);
            $('#packageID').val(header[0].packageID);
            $('#orderStatus').val(header[0].orderDetailStatus).change();
            $('#orderStatusName').val(header[0].orderStatusName);
            $('#customerName').val(header[0].customerName);
            var netTotal = 'Rs. ' + (parseFloat(header[0].total).toFixed(2)).toString();
            $('#total').val(netTotal);

            var orderStatusType = header[0].orderDetailStatus;
            if (orderStatusType == 4) {//When order is cancelled
                $("#orderStatus").prop("disabled", true);
                $("#btnUpdateDetails").prop("disabled", true);
            }
            else {
                $("#orderStatus").prop("disabled", false);
                $("#btnUpdateDetails").prop("disabled", false);
            }

            //Bind Detail Info to DataTable
            allOrderMgntDetailData = [];
            allOrderMgntDetailData = detail;
            //clear datatable
            orderMgntDetailDataTable.clear();
            //bind to datatable
            orderMgntDetailDataTable.rows.add(allOrderMgntDetailData).draw();

            //show modal
            $('#orderDetailModal').modal('show');
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Filter Button Event
function LoadFilteredOrderList() {

    var orderStatusID = $("#orderStatusFilter").val();
    var startDate = $("#startDateFilter").val();
    var endDate = $("#endDateFilter").val();

    if (startDate == "") { startDate = null; }
    if (endDate == "") { endDate = null; }

    //validations
    if (startDate == null && endDate != null) {
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
            LoadAllOrderMgntList(orderStatusID, startDate, endDate);
        }
    }

}

function UpdateOrderStatus() {

    var orderID = $('#orderID').val();
    var packageID = $('#packageID').val();
    var orderStatus = $('#orderStatus').val();

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "OrderMgnt/UpdateOrderStatusDetails",
        data: JSON.stringify({
            "OrderID": orderID, "PackageID": packageID, "OrderStatus": orderStatus
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {          
                //hide modal
                $('#orderDetailModal').modal('hide');
                //Clear data
                ClearData();
                //reload order list table
                LoadAllOrderMgntList(0, null, null);
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
        }
    })

}

function ClearData() {

    $('#orderStatusFilter').val('0').change();
    $('#orderStatus').val('1').change();
    $('#orderID').val('');
    $('#orderNo').val('');
    $('#packageID').val('');
    $('#orderStatusName').val('');
    $('#customerName').val('');
    $('#total').val('');
    
}

//function to enable buttons
function EnableButtons() {
    $("#btnUpdateDetails").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnUpdateDetails").prop("disabled", true);
}