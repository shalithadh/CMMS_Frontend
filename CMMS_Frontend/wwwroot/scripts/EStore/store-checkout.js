//validation variables
var checkFirstNameError = true;
var checkLastNameError = true;
var checkAddress1Error = true;
var checkAddress3Error = true;
var checkDistrictError = true;
var checkProvinceError = true;

$(document).ready(function () {
    //to hover side bar menu
    cmmsSideBarLinkSelector("/EStore/CartView");
    //Clear data
    ClearData();
    //load items to checkout table
    loadCartItems();
    //load customer details
    LoadAllCustomerDetails();
    // #region Validations
    $("#checkFirstNameCheck").hide();
    $("#checkFirstName").keyup(function () {
        validateCheckFirstName();
    });

    $("#checkLastNameCheck").hide();
    $("#checkLastName").keyup(function () {
        validateCheckLastName();
    });

    $("#checkAddress1Check").hide();
    $("#checkAddress1").keyup(function () {
        validateCheckAddress1();
    });

    $("#checkAddress3Check").hide();
    $("#checkAddress3").keyup(function () {
        validateCheckAddress3();
    });

    $("#checkDistrictCheck").hide();
    $("#checkDistrict").keyup(function () {
        validateCheckDistrict();
    });

    $("#checkProvinceCheck").hide();
    $("#checkProvince").keyup(function () {
        validateCheckProvince();
    });
    // #endregion
});

function loadCartItems() {
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));

    if (cartItemList.length > 0) {
        createCartTableRows(cartItemList, 'cartItemList');
        //Enable Buttons
        EnableButtons();
    }
    else {
        //disable buttons
        DisableButtons();
        //Redirect to Cart View Page
        window.location.assign('/EStore/CartView')
    }
  
}

function createCartTableRows(itemList, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(itemList, function (i, item) {

        var itemTableRow = ` <li>${item.itemName} × ${item.userQty.toString()} <span>Rs. ${parseFloat(item.totalAmount).toFixed(2)}</span></li>`;

        var combinedTable = itemTableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

    //Display Sub Total
    var subTotalCartAmount = getCMMSItemCartSubTotal();
    $('#checkSubTotal').text("Rs. " + parseFloat(subTotalCartAmount).toFixed(2));

    //Display Delivery Charge
    var deliveryCharge;
    if (itemList.length > 0) {
        deliveryCharge = parseFloat(localStorage.getItem("cmmsDeliveryCharge"));
    }
    else {
        deliveryCharge = 0;
    }
    $('#checkDeliveryCharge').text("Rs. " + parseFloat(deliveryCharge).toFixed(2));

    //Display Final Total
    var totalCartAmount = updateCMMSTopBarCartInfo();
    $('#checkFinalTotal').text("Rs. " + parseFloat(totalCartAmount).toFixed(2));

}

function LoadAllCustomerDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreOrder/GetEStoreCustomerDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            $('#userID').val(data[0]["userID"]);
            $('#checkFirstName').val(data[0]["firstName"]);
            $('#checkLastName').val(data[0]["lastName"]);
            $('#checkAddress1').val(data[0]["address1"]);
            $('#checkAddress2').val(data[0]["address2"]);
            $('#checkAddress3').val(data[0]["address3"]);
            $('#checkDistrict').val(data[0]["district"]);
            $('#checkProvince').val(data[0]["province"]);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

//Order Submit Event
function SubmitOrderEvent() {

    //For Payment method
    var codM = $('#checkCODPayment').is(":checked");
    var credM = $('#checkOnlinePayment').is(":checked");
    //get item cart details
    var cartItemList = [];
    cartItemList = JSON.parse(localStorage.getItem("cmmsItemCart"));

    var customerID = $('#userID').val();
    var paymentMethod;
    if (codM) {
        paymentMethod = 1;
    }
    else if (credM) {
        paymentMethod = 2;
    }
    var address1 = $('#checkAddress1').val();
    var address2 = $('#checkAddress2').val();
    var address3 = $('#checkAddress3').val();
    var district = $('#checkDistrict').val();
    var province = $('#checkProvince').val();
    var remarks = $('#checkRemarks').val();
    var discount = 0.00;
    var subTotal = parseFloat(getCMMSItemCartSubTotal());
    var deliveryCharge = parseFloat(localStorage.getItem("cmmsDeliveryCharge"));
    var total = parseFloat(updateCMMSTopBarCartInfo());
    var eStoreCartInfo = []; 
    $.each(cartItemList, function (i, item) {

        var item = {
            "ItemID": parseInt(item.itemID), "UnitAmount": parseFloat(item.itemUnitPrice), "Quantity": parseFloat(item.userQty),
            "DiscountAmount": 0.00, "ItemWiseTotal": parseFloat(item.totalAmount),
            "VendorID": parseInt(item.vendorID)
        };

        eStoreCartInfo.push(item);
    });

    var eStoreOrderDetail = {
        "PaymentMethod": paymentMethod,
        "Address1": address1,
        "Address2": address2,
        "Address3": address3,
        "District": district,
        "Province": province,
        "Remarks": remarks,
        "Discount": discount,
        "SubTotal": subTotal,
        "DeliveryCharge": deliveryCharge,
        "Total": total,
        "EStoreCartInfo": eStoreCartInfo
    }
    //console.log(eStoreOrderDetail);

    validateCheckFirstName();
    validateCheckLastName();
    validateCheckAddress1();
    validateCheckAddress3();
    validateCheckDistrict();
    validateCheckProvince();

    if (
        checkFirstNameError == true &&
        checkLastNameError == true &&
        checkAddress1Error == true &&
        checkAddress3Error == true &&
        checkDistrictError == true &&
        checkProvinceError == true 
    ) {
        //When payment method is online
        if (paymentMethod == 2) {
            toastr.warning("Online Payment option will be available soon.", "Warning");
        }
        else {
            SaveOrderDetails(eStoreOrderDetail);
        }
        return true;
    } else {
        return false;
    }
}

function SaveOrderDetails(eStoreOrderDetail) {

    //disable buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "POST",
        url: window.base_url + "EStoreOrder/SaveCusOrderDetails",
        data: JSON.stringify(eStoreOrderDetail),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];
            var savedID = data[0]["savedID"];

            if (msgcode == 1) {

                //Clear data
                ClearData();
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
                //Empty Cart
                localStorage.setItem("cmmsItemCart", JSON.stringify([]));
                updateCMMSTopBarCartInfo();
                //Redirect to Invoice View
                setTimeout(function () { window.location.assign('/EStore/InvoiceView?id=' + savedID) }, 1000);
            }

            else {
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
            //loader
            cmmsSvgLoader();
        }
    })
}

// #region Validations
function validateCheckFirstName() {
    let value = $("#checkFirstName").val();
    if (value.length == "") {
        $("#checkFirstNameCheck").show();
        checkFirstNameError = false;
        return false;
    }
    else {
        $("#checkFirstNameCheck").hide();
        checkFirstNameError = true;
        return true;
    }
}

function validateCheckLastName() {
    let value = $("#checkLastName").val();
    if (value.length == "") {
        $("#checkLastNameCheck").show();
        checkLastNameError = false;
        return false;
    }
    else {
        $("#checkLastNameCheck").hide();
        checkLastNameError = true;
        return true;
    }
}

function validateCheckAddress1() {
    let value = $("#checkAddress1").val();
    if (value.length == "") {
        $("#checkAddress1Check").show();
        checkAddress1Error = false;
        return false;
    }
    else {
        $("#checkAddress1Check").hide();
        checkAddress1Error = true;
        return true;
    }
}

function validateCheckAddress3() {
    let value = $("#checkAddress3").val();
    if (value.length == "") {
        $("#checkAddress3Check").show();
        checkAddress3Error = false;
        return false;
    }
    else {
        $("#checkAddress3Check").hide();
        checkAddress3Error = true;
        return true;
    }
}

function validateCheckDistrict() {
    let value = $("#checkDistrict").val();
    if (value.length == "") {
        $("#checkDistrictCheck").show();
        checkDistrictError = false;
        return false;
    }
    else {
        $("#checkDistrictCheck").hide();
        checkDistrictError = true;
        return true;
    }
}

function validateCheckProvince() {
    let value = $("#checkProvince").val();
    if (value.length == "") {
        $("#checkProvinceCheck").show();
        checkProvinceError = false;
        return false;
    }
    else {
        $("#checkProvinceCheck").hide();
        checkProvinceError = true;
        return true;
    }
}

// #endregion

function ClearData() {
    $('#userID').val('');
    $('#checkFirstName').val('');
    $('#checkLastName').val('');
    $('#checkAddress1').val('');
    $('#checkAddress2').val('');
    $('#checkAddress3').val('');
    $('#checkDistrict').val('');
    $('#checkProvince').val('');
    $('#checkRemarks').val('');

    //hide validation mgs
    $("#checkFirstNameCheck").hide();
    $("#checkLastNameCheck").hide();
    $("#checkAddress1Check").hide();
    $("#checkAddress3Check").hide();
    $("#checkDistrictCheck").hide();
    $("#checkProvinceCheck").hide();
}

//function to enable buttons
function EnableButtons() {
    $("#btnPlaceOrder").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnPlaceOrder").prop("disabled", true);
}