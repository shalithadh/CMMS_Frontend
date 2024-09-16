$(document).ready(function () {
    LoadAllAdminDashboardDetails();
});

function LoadAllAdminDashboardDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "Dashboard/GetAdminDashboardDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            //1st row
            var totSales;
            if (data.adminTotalSales.length == 0) {
                totSales = "Rs 0.00";
            }
            else {
                totSales = "Rs " + (parseFloat(data.adminTotalSales[0].totalSales).toFixed(2)).toString();
            }           
            $('#adminTotSales').text(totSales);
            var totItems = data.adminTotalItems[0].totalItems;
            $('#adminTotItems').text(totItems.toString());
            var totOrders = data.adminTotalOrders[0].totalOrders;
            $('#adminTotOrders').text(totOrders.toString());
            var totUsers = data.adminTotalUsers[0].totalUsers;
            $('#adminTotUsers').text(totUsers.toString());
            //2nd row
            var bestContractor;
            if (data.adminBestContractors.length == 0) {
                bestContractor = " - ";
            }
            else {
                bestContractor = data.adminBestContractors[0].bestContractor;
            }
            $('#adminBestContractor').text(bestContractor.toString());

            var bestCustomer;
            if (data.adminBestCustomers.length == 0) {
                bestCustomer = " - ";
            }
            else {
                bestCustomer = data.adminBestCustomers[0].bestCustomer;
            }
            $('#adminBestCustomer').text(bestCustomer.toString());

            var bestVendor;
            if (data.adminBestVendors.length == 0) {
                bestVendor = " - ";
            }
            else {
                bestVendor = data.adminBestVendors[0].bestVendor;
            }           
            $('#adminBestVendor').text(bestVendor.toString());
            //tables
            var recentProjects = data.adminRecentProjects;
            CreateRecentProjectTableRows(recentProjects, 'recentProjectBody');
            var recentOrders = data.adminRecentOrders;
            CreateRecentOrderTableRows(recentOrders, 'recentOrdersBody');
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function CreateRecentProjectTableRows(recentProjects, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentProjects, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.projectTitle}</td>
                            <td>${item.contractorName}</td>
                            <td>${item.clientName}</td>
                            <td>
                                <div class="progress-showcase">
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${item.projectProgress}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}

function CreateRecentOrderTableRows(recentOrders, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentOrders, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.orderNo}</td>
                            <td>${item.vendorName}</td>
                            <td>${item.customerName}</td>
                            <td>${item.placedDate}</td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}