var orderID;
$(document).ready(function () {
    //to hover side bar menu
    cmmsSideBarLinkSelector("/EStore/OrderHistory");
    //Page URL & Parameters
    var pageURLString = window.location.href;
    var pageURL = new URL(pageURLString);
    orderID = pageURL.searchParams.get("id");

    if (orderID != null) {
        LoadCustomerOrderStatusDetails(orderID);
    }
    else {
        //Redirect to Product List
        window.location.assign('/EStore/ItemList');
    }

});

function LoadCustomerOrderStatusDetails(orderID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreOrder/GetOrderDetailByOrderID?OrderID=" + orderID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var orderInfo;
            var orderItemInfo;
            var vendorInfo;
            if (data != null || data != "") {
                //Order Info
                orderInfo = data.orderInfo;
                //console.log(orderInfo);
                //Vendor Info
                vendorInfo = data.orderVendorInfo;
                //console.log(vendorInfo);
                //Order Item Info
                orderItemInfo = data.orderItemInfo;
                //console.log(orderItemInfo);
                BindOrderHeaderInfo(orderInfo);
                BindPackageWiseItemInfo(vendorInfo, orderItemInfo);
            }
            else {
                //Redirect to Product List
                window.location.assign('/EStore/ItemList');
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

//Bind Header Info
function BindOrderHeaderInfo(orderInfo) {
    $('#orderNo').text(orderInfo[0].orderNo);
    $('#payMethodName').text(orderInfo[0].payMethodName);
    $('#placedDate').text(orderInfo[0].placedDate);
    $('#estDeliveryDate').text(orderInfo[0].estDeliveryDate);
    $('#deliveryCharge').text("Rs. " + (parseFloat(orderInfo[0].deliveryCharge).toFixed(2)).toString());
    $('#subTotal').text("Rs. " + (parseFloat(orderInfo[0].subTotal).toFixed(2)).toString());
    $('#total').text("Rs. " + (parseFloat(orderInfo[0].total).toFixed(2)).toString());
}

//Bind Package wise Item Info
function BindPackageWiseItemInfo(vendorInfo, orderItemInfo) {
    createOrderWiseTemplate(vendorInfo, orderItemInfo, 'packageDivGrid');
}

function createOrderWiseTemplate(vendorInfo, orderItemInfo, divName) {
    //Clearing and emptying div
    $('#' + divName).empty();

    var orItemInfo = orderItemInfo;
    //1st loop (Vendor Info)
    $.each(vendorInfo, function (i, item) {

        var vendorID = item.vendorID;
        var orderDetailStatus = item.orderDetailStatus;
        var badgeColor = getBadgeColorForOrderStatus(orderDetailStatus);

        var cardHeaderDiv = `<div id="packageDiv_${item.packageID}" class="card-body">
                                        <div class="media">
                                            <div class="media-body">
                                                <h6 class="f-w-600">
                                                    Vendor Name: <span class="f-w-600">${item.vendorName}</span>
                                                    <span class="badge badge-${badgeColor} pull-right">${item.orderStatusName}</span>
                                                </h6>
                                                <p>Package #${(item.packageID).toString()}</p>
                                            </div>
                                        </div>
                                        <br/>
                                        <div class="order-history table-responsive wishlist">
                                            <table class="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>Item Name</th>
                                                        <th>Unit Price (Rs.)</th>
                                                        <th>Quantity</th>
                                                        <th>Total (Rs.)</th>
                                                    </tr>
                                                </thead>
                                                <tbody id="itemBodyDiv_${(item.packageID).toString()}">`;

        //2nd loop (Vendor wise Item Info)
        var itemdetails = orItemInfo.filter(function (row) {
            return row.vendorID === vendorID;
        });
        //console.log(itemdetails);

        var tableRowDiv=``;
        $.each(itemdetails, function (i, item) {
            //console.log(item);
            var itemRow = ` <tr>
                                <td>
                                    <div class="product-name">
                                        <a onClick="openItemView('${item.itemID}');">
                                            <h6>${item.itemName}</h6>
                                        </a>
                                    </div>
                                </td>
                                <td style="text-align:right;">Rs. ${parseFloat(item.unitAmount).toFixed(2)}</td>
                                <td style="text-align:right;">${(item.quantity).toString()}</td>
                                <td style="text-align:right;">Rs. ${parseFloat(item.itemWiseTotal).toFixed(2)}</td>
                            </tr>`;
            tableRowDiv = tableRowDiv + itemRow;
        });

        var templateEndDiv = `</tbody>
                                    </table>
                                </div>
                            </div> `;

        var combinedDiv = cardHeaderDiv + tableRowDiv + templateEndDiv;

        //Append card to main div
        $('#' + divName).append(combinedDiv);

    });
}

function getBadgeColorForOrderStatus(statusID) {
    switch (statusID) {
        case 1:
            return 'info';
            break;
        case 2:
            return 'secondary';
            break;
        case 3:
            return 'success';
            break;
        case 4:
            return 'danger';
            break;
        default:
            return 'info';
            break;
    }
}

//Open Item Page
function openItemView(itemID) {
    window.location.assign('/EStore/ItemPage?itemID=' + itemID);
}
//View Order Invoice
function ViewOrderInvoice() {
    window.location.assign('/EStore/InvoiceView?id=' + orderID);
}
