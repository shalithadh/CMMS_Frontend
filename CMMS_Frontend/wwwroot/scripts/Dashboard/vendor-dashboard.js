$(document).ready(function () {
    LoadAllVendorDashboardDetails();
});

function LoadAllVendorDashboardDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "Dashboard/GetVendorDashboardDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            //1st row
            var totOrders = data.vendorTotalOrders[0].totalOrders;
            $('#venTotOrders').text(totOrders.toString());
            var bestCustomer;
            if (data.vendorBestCustomer.length == 0) {
                bestCustomer = " - ";
            }
            else {
                bestCustomer = data.vendorBestCustomer[0].bestCustomer;
            }          
            $('#venBestCustomer').text(bestCustomer.toString());
            var totItems = data.vendorTotalItems[0].totalItems;
            $('#venTotItems').text(totItems.toString());
            //tables
            var recentOrders = data.vendorRecentOrders;
            CreateRecentOrderTableRows(recentOrders, 'venRecentOrdersBody');
            var recentItems = data.vendorRecentItems;
            CreateRecentItemsTableRows(recentItems, 'venRecentItemsBody');
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function CreateRecentOrderTableRows(recentOrders, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentOrders, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.orderNo}</td>
                            <td>${item.customerName}</td>
                            <td>${item.placedDate}</td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}

function CreateRecentItemsTableRows(recentItems, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentItems, function (i, item) {

        var textClass; 
        if (item.stockAvailability == "Available") {
            textClass = "text-success f-w-600";
        }
        else {
            textClass = "text-danger f-w-600";
        }

        var tableRow = `<tr>
                            <td class="f-w-600">${item.itemName}</td>
                            <td>${item.category}</td>
                            <td>${item.addedDate}</td>
                            <td>
                                <div class="${textClass}">${item.stockAvailability}</div>
                            </td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}