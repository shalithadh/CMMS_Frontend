$(document).ready(function () {

    updateCMMSTopBarCartInfo();

});

//#region Item Cart Common Functions
function cmmsAddUpdateItemToCart(itemObj) {
    //console.log(itemObj);

    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));

    var itemIDn = (itemObj.itemID).toString();
    var userQtyn = parseFloat(itemObj.userQty);

    //console.log(cartItemList.length, userQtyn);

    //When cart is empty
    if (cartItemList.length == 0 && userQtyn > 0) {
        cartItemList.push(itemObj);
        localStorage.setItem("cmmsItemCart", JSON.stringify([]));
        localStorage.setItem("cmmsItemCart", JSON.stringify(cartItemList));
        //console.log(JSON.parse(localStorage.getItem("cmmsItemCart")));
    }
    else if (cartItemList.length > 0 && userQtyn > 0) {

        //check whether item already available in cart
        var isItemAvailable = cmmsGetCartItemDetails(itemIDn);

        if (isItemAvailable.length > 0) {
            //console.log(itemIDn);
            var newCartItems = cmmsRemoveItemToCart(itemIDn);
            newCartItems.push(itemObj);
            localStorage.setItem("cmmsItemCart", JSON.stringify([]));
            localStorage.setItem("cmmsItemCart", JSON.stringify(newCartItems));
            //console.log(JSON.parse(localStorage.getItem("cmmsItemCart")));
        }
        else {
            cartItemList.push(itemObj);
            localStorage.setItem("cmmsItemCart", JSON.stringify([]));
            localStorage.setItem("cmmsItemCart", JSON.stringify(cartItemList));
            //console.log(JSON.parse(localStorage.getItem("cmmsItemCart")));
        }

    }

    updateCMMSTopBarCartInfo();
}

function cmmsRemoveItemToCart(itemID) {
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));
    filteredResult = cartItemList.filter(val => val.itemID !== itemID);

    localStorage.setItem("cmmsItemCart", JSON.stringify([]));
    localStorage.setItem("cmmsItemCart", JSON.stringify(filteredResult));

    updateCMMSTopBarCartInfo();

    return filteredResult;
}

function cmmsGetCartItemDetails(itemIDu) {

    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));

    var itemdetails = cartItemList.filter(function (entry) {
        return entry.itemID === itemIDu;
    });

    return itemdetails;
}

function updateCMMSTopBarCartInfo() {
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));
    var cartItemTotal = cartItemList.length;
    var cartItemTotalAmount = 0;

    if (cartItemTotal > 0) {
        $('#cmms_cartItemCount').text(cartItemTotal.toString());
        $.each(cartItemList, function (i, item) {
            cartItemTotalAmount = cartItemTotalAmount + parseFloat(item.totalAmount);
        });

        //add delivery charge
        var deliveryCharge = parseFloat(localStorage.getItem("cmmsDeliveryCharge"));
        var finalCartTotal = cartItemTotalAmount + deliveryCharge;

        $('#cmms_cartItemTotalAmount').text("Rs " + (parseFloat(finalCartTotal).toFixed(2)).toString());
    }
    else {
        $('#cmms_cartItemCount').text("0");
        $('#cmms_cartItemTotalAmount').text("Rs 0.00");
        finalCartTotal = 0;
    }

    return (finalCartTotal);
}

function getCMMSItemCartSubTotal() {
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));
    var cartItemTotal = cartItemList.length;
    var cartItemSubTotalAmount = 0;

    if (cartItemTotal > 0) {
        $.each(cartItemList, function (i, item) {
            cartItemSubTotalAmount = cartItemSubTotalAmount + parseFloat(item.totalAmount);
        });
    }
    else {
        cartItemSubTotalAmount = 0;
    }

    return cartItemSubTotalAmount;
}

// #endregion