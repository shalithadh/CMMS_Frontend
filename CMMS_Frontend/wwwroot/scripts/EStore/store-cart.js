$(document).ready(function () {

    //load items to cart table
    loadCartItems();

});

function loadCartItems() {
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));
    createCartTableRows(cartItemList, 'cmmsItemCartBodyDiv');
}

function createCartTableRows(itemList, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(itemList, function (i, item) {

        var itemTableRow = `<tr>
                                <td><img class="img-fluid img-40" src="${item.itemImageURL}" alt="${item.itemName}"></td>
                                <td>
                                    <div class="product-name">
                                        <a onClick="openItemView('${item.itemID}');">
                                            <h6>${item.itemName}</h6>
                                        </a>
                                    </div>
                                </td>
                                <td style="text-align:right;">Rs. ${parseFloat(item.itemUnitPrice).toFixed(2)}</td>
                                <td>
                                    <fieldset class="qty-box">
                                        <div class="input-group">
                                            <input id="itemQtyInput_${item.itemID}" class="touchspin text-center" type="text" 
                                            value="${item.userQty.toString()}" onchange="addCartBtnEvent(this.id, ${item.itemID});" readonly>
                                        </div>
                                    </fieldset>
                                </td>
                                <td><i class="fa fa-trash" onClick="removeItemFromCart('${item.itemID}');" style="font-size:22px; color:red; cursor: pointer;"></i></td>
                                <td style="text-align:right;">Rs. ${parseFloat(item.totalAmount).toFixed(2)}</td>
                            </tr> `; 

        var combinedTable = itemTableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

        //Apply Touch spin
        !function (t, n, s) { "use strict"; s("html"); s(".touchspin").TouchSpin({ buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square", buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }), s(".touchspin-vertical").TouchSpin({ verticalbuttons: !0, verticalupclass: "fa fa-angle-up", verticaldownclass: "fa fa-angle-down", buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square" }), s(".touchspin-stop-mousewheel").TouchSpin({ mousewheel: !1, buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square", buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }), s(".touchspin-color").each(function (t) { var n = "btn btn-primary btn-square", u = "btn btn-primary btn-square", a = s(this); a.data("bts-button-down-class") && (n = a.data("bts-button-down-class")), a.data("bts-button-up-class") && (u = a.data("bts-button-up-class")), a.TouchSpin({ mousewheel: !1, buttondown_class: n, buttonup_class: u, buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }) }) }(window, document, jQuery);
        //set minimum is 1
        $(".touchspin").trigger("touchspin.updatesettings", { min: 1 });

    });

    //Display Delivery Charge
    var deliveryCharge;
    if (itemList.length > 0) {
        deliveryCharge = parseFloat(localStorage.getItem("cmmsDeliveryCharge"));
    }
    else {
        deliveryCharge = 0;
    }

    var subTotalCartAmount = getCMMSItemCartSubTotal(); 

    var totalCartAmount = updateCMMSTopBarCartInfo();

    var tableEnd = `<tr>
                        <td colspan="4">
                                          
                        </td>
                        <td class="total-amount">
                            <h6 class="m-0 text-end"><span class="f-w-400">Sub Total:</span></h6>
                        </td>
                        <td style="text-align:right;"><span>Rs. ${parseFloat(subTotalCartAmount).toFixed(2)}</span></td>
                    </tr>
                    <tr>
                        <td colspan="4">

                        </td>
                        <td class="total-amount">
                            <h6 class="m-0 text-end"><span class="f-w-400">Delivery Charge:</span></h6>
                        </td>
                        <td style="text-align:right;"><span>Rs. ${parseFloat(deliveryCharge).toFixed(2)}</span></td>
                    </tr>
                    <tr>
                        <td colspan="4">
                                          
                        </td>
                        <td class="total-amount">
                            <h6 class="m-0 text-end"><span class="f-w-600">Total Amount:</span></h6>
                        </td>
                        <td style="text-align:right;"><span class="f-w-800">Rs. ${parseFloat(totalCartAmount).toFixed(2)}</span></td>
                    </tr>
                    <tr>
                        <td class="text-end" colspan="5"><a class="btn btn-secondary cart-btn-transform" href="/EStore/ItemList">Continue Shopping</a></td>
                        <td><a class="btn btn-success cart-btn-transform" href="/EStore/CheckoutPage">Check Out</a></td>
                    </tr>`;

    //Append last row to main table
    $('#' + divName).append(tableEnd);

}

function addCartBtnEvent(id, itemID) {
    //console.log(id, itemID);

    var itemDetail = cmmsGetCartItemDetails(itemID.toString());
    //console.log(itemDetail);

    if (itemDetail.length > 0) {
        var qtyVal = $('#itemQtyInput_' + itemID).val();
        var totAmount = parseFloat(qtyVal) * parseFloat(itemDetail[0].itemUnitPrice);

        var itemDetails = {
            "itemID": itemDetail[0].itemID, "itemName": itemDetail[0].itemName, "itemDescription": itemDetail[0].itemDescription,
            "itemImageURL": itemDetail[0].itemImageURL, "itemUnitPrice": itemDetail[0].itemUnitPrice,
            "minQty": itemDetail[0].minQty, "maxQty": itemDetail[0].maxQty, "totalQty": itemDetail[0].totalQty,
            "uom": itemDetail[0].uom, "vendorID": itemDetail[0].vendorID,
            "userQty": qtyVal, "totalAmount": totAmount
        };
        //console.log(itemDetails);

        cmmsAddUpdateItemToCart(itemDetails);
        //reload table   
        setTimeout(function () { loadCartItems() }, 600);
        //loadCartItems();
    }
}
function removeItemFromCart(itemID) {

    //remove item from cart view
    cmmsRemoveItemToCart(itemID);
    //reload table
    setTimeout(function () { loadCartItems() }, 600);
    //loadCartItems();
}

function openItemView(itemID) {
    window.location.assign('/EStore/ItemPage?itemID=' + itemID);
}