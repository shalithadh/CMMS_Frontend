$(document).ready(function () {
    //to hover side bar menu
    cmmsSideBarLinkSelector("/EStore/ItemList");
    $('#itemQtyDiv').hide();
    //Page URL & Parameters
    var pageURLString = window.location.href;
    var pageURL = new URL(pageURLString);
    var itemID = pageURL.searchParams.get("itemID");

    if (itemID != null) {
        LoadItemDetailsByID(itemID);
    }
    else {
        //Redirect to Product List
        window.location.assign('/EStore/ItemList');   
    }

});

//Load Item Details By ItemID
function LoadItemDetailsByID(itemID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreItem/GetEStoreItemListByItemID?ItemID=" + itemID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            $('#itemID').val(data[0]["itemID"]);
            $('#itemName').val(data[0]["itemName"]);
            $('#itemDescriptionV').val(data[0]["itemDescription"]);
            $('#unitAmount').val(data[0]["unitAmount"]);
            $('#minQty').val(data[0]["minQty"]);
            $('#maxQty').val(data[0]["maxQty"]);
            $('#totalQty').val(data[0]["totalQty"]);
            $('#uom').val(data[0]["uom"]);
            $('#vendorID').val(data[0]["vendorID"]);

            var itemImgURL = data[0]["itemImageURL"];
            $('#itemImageURLV').val(webUrl + itemImgURL);
            $('#itemImageURL')
            .on('error', function () {
                $(this).attr("src", '../assets/images/ecommerce/01.jpg');
            })
            .attr("src", webUrl + itemImgURL + '?v="+(new Date()).getTime()');
            $('#itemName').text(data[0]["itemName"]);
            var unitPrice = data[0]["unitAmount"].toString();
            $('#unitAmountDisplay').text("Rs. " + unitPrice);
            $('#itemDescription').text(data[0]["itemDescription"]);
            var availableQty = data[0]["availableQty"];
            if (availableQty > 0) {
                $('#itemAvalability').text("In Stock").addClass("text-success f-w-600");
                $('#itemAddToCartBtn').html(`<i class="fa fa-shopping-basket me-2"></i> Add To Cart`).addClass("btn-primary");
                $("#itemAddToCartBtn").prop('disabled', false);
            }
            else {
                $('#itemAvalability').text("Out of Stock").addClass("text-danger f-w-600");
                $('#itemAddToCartBtn').html(`<i class="fa fa-shopping-basket me-2"></i> Out of Stock`).addClass("btn-warning");
                $("#itemAddToCartBtn").prop('disabled', true);
            }          
            $('#vendorCategoryName').text(data[0]["vendorCategoryName"]);
            $('#vendorName').text(data[0]["vendorName"]);
            $('#uomName').text(data[0]["uomName"]);

            //Check whether user already added this item to cart
            checkUserAlreadyAddedItem(itemID);
          
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function checkUserAlreadyAddedItem(itemID) {

    var itemObjA = cmmsGetCartItemDetails(itemID.toString());
    //console.log(itemObjA);
    if (itemObjA.length > 0) { 
        $('#itemInputQty').val(itemObjA[0].userQty); 
        $('#itemQtyDiv').show();
        $('#addToCartBtnDiv').hide();
    }

}

function addCartBtnEvent(id) {

    //when user clicks Add to cart
    if (id == "itemAddToCartBtn") {
        $('#itemQtyDiv').show();
        $('#addToCartBtnDiv').hide();
        $('#itemInputQty').val(1);
        var qtyVal = $('#itemInputQty').val();

        var totAmount = parseFloat(qtyVal) * parseFloat($('#unitAmount').val());

        var itemDetails = {
            "itemID": $('#itemID').val(), "itemName": $('#itemName').val(), "itemDescription": $('#itemDescriptionV').val(),
            "itemImageURL": $('#itemImageURLV').val(), "itemUnitPrice": $('#unitAmount').val(),
            "minQty": $('#minQty').val(), "maxQty": $('#maxQty').val(), "totalQty": $('#totalQty').val(),
            "uom": $('#uom').val(), "vendorID": $('#vendorID').val(), 
            "userQty": qtyVal, "totalAmount": totAmount
        };

        cmmsAddUpdateItemToCart(itemDetails);

    }
    //when user increase or decrease item quantity
    else if (id == "itemInputQty") {
        var itemIDVal = $('#itemID').val();
        var qtyVal = $('#itemInputQty').val();
        if (qtyVal < 1) {
            $('#itemQtyDiv').hide();
            $('#addToCartBtnDiv').show();

            cmmsRemoveItemToCart(itemIDVal);
        }
        else {
            var qtyVal = $('#itemInputQty').val();

            var totAmount = parseFloat(qtyVal) * parseFloat($('#unitAmount').val());

            var itemDetails = {
                "itemID": $('#itemID').val(), "itemName": $('#itemName').val(), "itemDescription": $('#itemDescriptionV').val(),
                "itemImageURL": $('#itemImageURLV').val(), "itemUnitPrice": $('#unitAmount').val(),
                "minQty": $('#minQty').val(), "maxQty": $('#maxQty').val(), "totalQty": $('#totalQty').val(),
                "uom": $('#uom').val(), "vendorID": $('#vendorID').val(),
                "userQty": qtyVal, "totalAmount": totAmount
            };

            cmmsAddUpdateItemToCart(itemDetails);
        }
    }

}