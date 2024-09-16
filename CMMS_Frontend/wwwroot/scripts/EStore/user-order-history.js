//object
var orderHistoryDataTable;
var allOrderHistoryData = [];

$(document).ready(function () {
    //Initialize datatable
    LoadDataTable();
    LoadAllOrderHistoryList();
});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    orderHistoryDataTable = $('#orderHistoryTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "orderNo", "width": "10%" },
            { "data": "placedDate", "width": "10%" },
            { "data": "estDeliveryDate", "width": "10%" },
            { "data": "payMethodName", "width": "10%" },
            {
                "data": "total", 
                "type": "string",
                "render": function (data, type, row) {
                    return 'Rs. ' + (parseFloat(data).toFixed(2)).toString();
                },"width": "10%"},
            {
                "data": "orderID",
                "render": function (data) {
                    return `
                            <button class="btn btn-info btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="GoToOrderMoreInfo(${data})">
                                <i class="fa fa-eye me-2"></i>&nbsp;More Info&nbsp;
                            </button>                           
                     `;

                }, "width": "10%"
            }
        ],
        "order": [[0, 'desc']], //descending order 1st column
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllOrderHistoryList() {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreOrder/GetOrderCustomerHistory",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allOrderHistoryData = [];
            allOrderHistoryData = data;
            //clear datatable
            orderHistoryDataTable.clear();
            //bind to datatable
            orderHistoryDataTable.rows.add(allOrderHistoryData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function GoToOrderMoreInfo(orderID) {
    window.location.assign('/EStore/OrderView?id=' + orderID);
}