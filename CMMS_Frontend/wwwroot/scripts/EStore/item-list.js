$(document).ready(function () {

    //select2
    $('#productFilter').select2();

    //autocomplete search
    $("#itemSearch").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.base_url + "EStoreItem/GetEStoreItemSearch?searchKeyword=" + $("#itemSearch").val(),
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $("#itemSearch").val('');
            $("#itemID").val('');
            $("#itemSearch").val(ui.item.label);
            $("#itemID").val(ui.item.value);
            //to focus out forcely
            $("#itemSearch").blur();
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.label + " - " + item.desc + "</div>")
            .appendTo(ul);
    };

    //load combo data
    LoadAllComboData();

    var vendorCategoryStatus = 0;
    //initial item loading
    loadAllTypeItemList(vendorCategoryStatus, "itemListGrid");

    //Vendor Category Filter Onchange Event
    $("#productFilter").change(function () {
        var vendorCategoryType = $("#productFilter").val();
        loadAllTypeItemList(vendorCategoryType, "itemListGrid");
    });

    //Search Bar OnChange Event
    $("#itemSearch").change(function () {
        var itemID = $("#itemID").val();
        if (parseInt(itemID) > 0) {
            openItemView(itemID);
        }
    });

});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreItem/GetInitialEStoreItemData",
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
        $("#productFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}

// #endregion


function loadAllTypeItemList(vendorCategoryStatus, divName) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreItem/GetEStoreItemList?VendorCategoryTypeID=" + vendorCategoryStatus,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            createProductTiles(data, divName);

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });


}

function createProductTiles(itemList, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(itemList, function (i, item) {

        var itemTileTemplate = `<div class="col-xl-4 col-sm-4">
                                    <div class="card">
                                        <div class="product-box">
                                            <div class="product-img">
                                                <img class="img-fluid img-500" src="${webUrl + item.itemImageURL}" alt="">
                                                <div class="product-hover">
                                                    <ul>
                                                        <li onClick="openItemView('${item.itemID}');"><i class="icon-eye"></i></li>
                                                        <li onClick="openItemModal('itemModal_${item.itemID}','${item.itemID}');"><i class="icon-shopping-cart"></i></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="modal fade" id="itemModal_${item.itemID}">
                                                <div class="modal-dialog modal-lg modal-dialog-centered">
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                            <div class="product-box row">
                                                                <div class="product-img col-lg-6"><img class="img-fluid img-500" src="${webUrl + item.itemImageURL}" alt=""></div>
                                                                <div class="product-details col-lg-6 text-start">
                                                                    <a href="javascript:void(0)">
                                                                        <h4>${item.itemName}</h4>
                                                                    </a>
                                                                    <div class="product-price">
                                                                        Rs. ${item.unitAmount.toString()}
                                                                    </div>
                                                                    <div class="product-view">
                                                                        <h6 class="f-w-600">Product Details</h6>                                                                     
                                                                        <p class="mb-0">${item.itemDescription}</p>
                                                                        <br/>
                                                                        <p style="color: black;"><b>Sold In</b></p>
                                                                        <p class="mb-0">${item.uomName}</p>
                                                                        <br/>
                                                                    </div>                                                                
                                                                    <div class="product-qnty">                                                                  
                                                                        <div class="addcart-btn">
                                                                            <br/>
                                                                            <center>
                                                                                <fieldset id="itemQtyDiv_${item.itemID}" style="display: none;">
                                                                                    <div class="input-group">
                                                                                        <input id="itemModalQtyInput_${item.itemID}" class="touchspin text-center" type="text" value="1" onchange="addCartBtnEvent(this.id, ${item.itemID});" readonly>
                                                                                    </div>
                                                                                </fieldset>                                                                       
                                                                                <button id="addToCartModalBtn_${item.itemID}" class="btn btn-primary me-3"  onclick="addCartBtnEvent(this.id, ${item.itemID});">
                                                                                    <i class="fa fa-shopping-basket me-2"></i> Add to Cart
                                                                                </button> 
                                                                            </center>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            <input id="itemModalID_${item.itemID}" type="hidden" value="${item.itemID}">
                                                            <input id="itemModalItemName_${item.itemID}" type="hidden" value="${item.itemName}">
                                                            <input id="itemModalDescriptionV_${item.itemID}" type="hidden" value="${item.itemDescription}">
                                                            <input id="itemModalImageURLV_${item.itemID}" type="hidden" value="${webUrl + item.itemImageURL}">
                                                            <input id="itemModalUnitAmount_${item.itemID}" type="hidden" value="${item.unitAmount}">
                                                            <input id="itemModalMinQty_${item.itemID}" type="hidden" value="${item.minQty}">
                                                            <input id="itemModalMaxQty_${item.itemID}" type="hidden" value="${item.maxQty}">
                                                            <input id="itemModalTotalQty_${item.itemID}" type="hidden" value="${item.totalQty}">
                                                            <input id="itemModalUom_${item.itemID}" type="hidden" value="${item.uom}">
                                                            <input id="itemModalVendorID_${item.itemID}" type="hidden" value="${item.vendorID}">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product-details">
                                                <a href="javascript:void(0)">
                                                    <h4>${item.itemName}</h4>
                                                </a>
                                                <p>${item.itemDescription}</p>
                                                <div class="product-price">
                                                     Rs. ${item.unitAmount.toString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> `;

        var combinedTemplate = itemTileTemplate;

        //Append tile to main div
        $('#' + divName).append(combinedTemplate);

        //Apply Touch spin
        !function (t, n, s) { "use strict"; s("html"); s(".touchspin").TouchSpin({ buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square", buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }), s(".touchspin-vertical").TouchSpin({ verticalbuttons: !0, verticalupclass: "fa fa-angle-up", verticaldownclass: "fa fa-angle-down", buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square" }), s(".touchspin-stop-mousewheel").TouchSpin({ mousewheel: !1, buttondown_class: "btn btn-primary btn-square", buttonup_class: "btn btn-primary btn-square", buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }), s(".touchspin-color").each(function (t) { var n = "btn btn-primary btn-square", u = "btn btn-primary btn-square", a = s(this); a.data("bts-button-down-class") && (n = a.data("bts-button-down-class")), a.data("bts-button-up-class") && (u = a.data("bts-button-up-class")), a.TouchSpin({ mousewheel: !1, buttondown_class: n, buttonup_class: u, buttondown_txt: '<i class="fa fa-minus"></i>', buttonup_txt: '<i class="fa fa-plus"></i>' }) }) }(window, document, jQuery);
       
    });

}

function addCartBtnEvent(id, itemID) {
    //console.log(id, itemID);
    //when user clicks Add to cart
    if (id == "addToCartModalBtn_" + itemID) {
        $('#itemQtyDiv_' + itemID).show();
        $('#addToCartModalBtn_' + itemID).hide();
        $('#itemModalQtyInput_' + itemID).val(1);

        var qtyVal = $('#itemModalQtyInput_' + itemID).val();

        var totAmount = parseFloat(qtyVal) * parseFloat($('#itemModalUnitAmount_'+ itemID).val());

        var itemDetails = {
            "itemID": $('#itemModalID_' + itemID).val(), "itemName": $('#itemModalItemName_' + itemID).val(), "itemDescription": $('#itemModalDescriptionV_' + itemID).val(),
            "itemImageURL": $('#itemModalImageURLV_' + itemID).val(), "itemUnitPrice": $('#itemModalUnitAmount_' + itemID).val(),
            "minQty": $('#itemModalMinQty_' + itemID).val(), "maxQty": $('#itemModalMaxQty_' + itemID).val(), "totalQty": $('#itemModalTotalQty_' + itemID).val(),
            "uom": $('#itemModalUom_' + itemID).val(), "vendorID": $('#itemModalVendorID_' + itemID).val(),
            "userQty": qtyVal, "totalAmount": totAmount
        };

        cmmsAddUpdateItemToCart(itemDetails);
    }
    //when user increase or decrease item quantity
    else if (id == "itemModalQtyInput_" + itemID) {
        var qtyVal = $('#itemModalQtyInput_' + itemID).val();
        if (qtyVal < 1) {
            $('#itemQtyDiv_' + itemID).hide();
            $('#addToCartModalBtn_' + itemID).show();
            cmmsRemoveItemToCart(itemID.toString());
        }
        else {
            var qtyVal = $('#itemModalQtyInput_' + itemID).val();

            var totAmount = parseFloat(qtyVal) * parseFloat($('#itemModalUnitAmount_' + itemID).val());

            var itemDetails = {
                "itemID": $('#itemModalID_' + itemID).val(), "itemName": $('#itemModalItemName_' + itemID).val(), "itemDescription": $('#itemModalDescriptionV_' + itemID).val(),
                "itemImageURL": $('#itemModalImageURLV_' + itemID).val(), "itemUnitPrice": $('#itemModalUnitAmount_' + itemID).val(),
                "minQty": $('#itemModalMinQty_' + itemID).val(), "maxQty": $('#itemModalMaxQty_' + itemID).val(), "totalQty": $('#itemModalTotalQty_' + itemID).val(),
                "uom": $('#itemModalUom_' + itemID).val(), "vendorID": $('#itemModalVendorID_' + itemID).val(),
                "userQty": qtyVal, "totalAmount": totAmount
            };

            cmmsAddUpdateItemToCart(itemDetails);
        }
    }

}

function checkUserAlreadyAddedItem(itemID) {

    var itemObjA = cmmsGetCartItemDetails(itemID.toString());
    //console.log(itemID, itemObjA);
    if (itemObjA.length > 0) {
        $('#itemModalQtyInput_' + itemID).val(itemObjA[0].userQty);
        $('#itemQtyDiv_' + itemID).show();
        $('#addToCartModalBtn_' + itemID).hide();
    }

}

function checkItemStockAvailablity(itemID) {
    var aQty = $('#itemModalTotalQty_' + itemID).val();
    if (aQty > 0) {
        $("#addToCartModalBtn_" + itemID).html(`<i class="fa fa-shopping-basket me-2"></i> Add To Cart`).addClass("btn-primary");
        $("#addToCartModalBtn_" + itemID).prop('disabled', false);
    }
    else {
        $("#addToCartModalBtn_" + itemID).html(`<i class="fa fa-shopping-basket me-2"></i> Out of Stock`).addClass("btn-warning");
        $("#addToCartModalBtn_" + itemID).prop('disabled', true);
    }
}

function openItemModal(modalID, itemID) {
    //Check Stock Availability
    checkItemStockAvailablity(itemID);
    //Check whether user already added this item to cart
    checkUserAlreadyAddedItem(itemID);
    $('#' + modalID).modal('show');
}

function openItemView(itemID) {
    window.location.assign('/EStore/ItemPage?itemID=' + itemID);
}