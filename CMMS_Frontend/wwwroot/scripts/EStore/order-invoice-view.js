$(document).ready(function () {
    //to hover side bar menu
    cmmsSideBarLinkSelector("/EStore/OrderHistory");

    //Page URL & Parameters
    var pageURLString = window.location.href;
    var pageURL = new URL(pageURLString);
    var orderID = pageURL.searchParams.get("id");

    if (orderID != null) {
        LoadCustomerInvoiceDetails(orderID);
    }
    else {
        //Redirect to Product List
        window.location.assign('/EStore/ItemList');             
    }
});


function LoadCustomerInvoiceDetails(orderID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreOrder/GetOrderDetailByOrderID?OrderID=" + orderID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var orderInfo;
            var orderItemInfo;
            if (data != null || data != "") {
                //Order Info
                orderInfo = data.orderInfo;
                //console.log(orderInfo);
                //Order Item Info
                orderItemInfo = data.orderItemInfo;
                //console.log(orderItemInfo);
                BindInvoiceHeaderInfo(orderInfo, orderItemInfo);
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

function BindInvoiceHeaderInfo(orderInfo, orderItemInfo) {

    $('#orderNo').text(orderInfo[0].orderNo);
    $('#placedDate').text(orderInfo[0].placedDate);
    $('#estDeliveryDate').text(orderInfo[0].estDeliveryDate);
    $('#clientName').text(orderInfo[0].clientName);
    $('#mobileNo').text(orderInfo[0].mobileNo);

    var addressLine1 = orderInfo[0].address1 + ', ' + orderInfo[0].address2 + ', ' + orderInfo[0].address3 + ', ';
    var addressLine2 = orderInfo[0].district + ', ' + orderInfo[0].province + '.';
    $('#addressLine1').text(addressLine1);
    $('#addressLine2').text(addressLine2);
    $('#payMethodName').text(orderInfo[0].payMethodName);

    var subTotal = orderInfo[0].subTotal;
    var deliveryCharge = orderInfo[0].deliveryCharge;
    var total = orderInfo[0].total;
    createInvoiceTableRows(orderItemInfo, "invoiceTableDiv", subTotal, deliveryCharge, total)

}

function createInvoiceTableRows(orderItemInfo, divName, subTotal, deliveryCharge, total) {

    //Clearing and emptying div
    $('#' + divName).empty();

    var invTableStart = `<tr>
                            <td class="item">
                                <h6 class="p-2 mb-0">Item Name</h6>
                            </td>
                            <td class="item">
                                <h6 class="p-2 mb-0">Package</h6>
                            </td>
                            <td class="item">
                                <h6 class="p-2 mb-0">Vendor Name</h6>
                            </td>                     
                            <td class="Hours" style="text-align:right;">
                                <h6 class="p-2 mb-0">Unit Price</h6>
                            </td>
                            <td class="Rate" style="text-align:right;">
                                <h6 class="p-2 mb-0">Quantity</h6>
                            </td>
                            <td class="subtotal" style="text-align:right;">
                                <h6 class="p-2 mb-0">Total</h6>
                            </td>
                        </tr>`;
    $('#' + divName).append(invTableStart);

    $.each(orderItemInfo, function (i, item) {

        var itemTableRow = `<tr>
                                <td>
                                    <label>${item.itemName}</label>
                                </td>
                                <td>
                                    <label>Package - ${(item.packageID).toString()}</label>
                                </td>
                                 <td>
                                    <label>${item.vendorName}</label>
                                </td>
                                <td style="text-align:right;font-weight: bold;">
                                    <p class="itemtext digits">Rs. ${parseFloat(item.unitAmount).toFixed(2)} </p>
                                </td>
                                <td style="text-align:right;font-weight: bold;">
                                    <p class="itemtext digits">${item.quantity.toString()}</p>
                                </td>
                                <td style="text-align:right;font-weight: bold;">
                                    <p class="itemtext digits">Rs. ${parseFloat(item.itemWiseTotal).toFixed(2)} </p>
                                </td>
                            </tr>`;

        var combinedTable = itemTableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

    var invTableEnd = ` <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="Rate">
                                <h6 class="mb-0 p-1">Sub Total</h6>
                            </td>
                            <td class="payment digits" style="text-align:right;">
                                <h6 class="mb-0 p-1">Rs. ${parseFloat(subTotal).toFixed(2)}</h6>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="Rate">
                                <h6 class="mb-0 p-1">Delivery Charges</h6>
                            </td>
                            <td class="payment digits" style="text-align:right;">
                                <h6 class="mb-0 p-1">Rs. ${parseFloat(deliveryCharge).toFixed(2)}</h6>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td class="Rate">
                                <h6 class="mb-0 p-1">Total</h6>
                            </td>
                            <td class="payment digits" style="text-align:right;">
                                <h6 class="mb-0 p-1">Rs. ${parseFloat(total).toFixed(2)}</h6>
                            </td>
                        </tr>`;
    $('#' + divName).append(invTableEnd);

}

function GoToItemList() {
    window.location.assign('/EStore/ItemList');
}

function GoToOrderHistory() {
    window.location.assign('/EStore/OrderHistory');
}