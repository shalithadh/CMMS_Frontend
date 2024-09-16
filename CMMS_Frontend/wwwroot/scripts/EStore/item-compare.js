$(document).ready(function () {

    ClearResult();
    // #region Item 1
    //autocomplete search
    $("#itemSearch_1").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.base_url + "EStoreItem/GetEStoreItemSearch?searchKeyword=" + $("#itemSearch_1").val(),
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
            $("#itemSearch_1").val('');
            $("#itemID_1").val('');
            $("#itemSearch_1").val(ui.item.label);
            $("#itemID_1").val(ui.item.value);
            //to focus out forcely
            $("#itemSearch_1").blur();
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.label + " - " + item.desc + "</div>")
            .appendTo(ul);
    };

    //Search Bar OnChange Event
    $("#itemSearch_1").change(function () {
        var itemID = $("#itemID_1").val();
        if (parseInt(itemID) > 0) {
            LoadItemDetailsByIDFilter1(itemID);
        }
    });
    // #endregion

    // #region Item 2
    //autocomplete search
    $("#itemSearch_2").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.base_url + "EStoreItem/GetEStoreItemSearch?searchKeyword=" + $("#itemSearch_2").val(),
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
            $("#itemSearch_2").val('');
            $("#itemID_2").val('');
            $("#itemSearch_2").val(ui.item.label);
            $("#itemID_2").val(ui.item.value);
            //to focus out forcely
            $("#itemSearch_2").blur();
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            return $("<li>")
                .append("<div>" + item.label + " - " + item.desc + "</div>")
                .appendTo(ul);
        };

    //Search Bar OnChange Event
    $("#itemSearch_2").change(function () {
        var itemID = $("#itemID_2").val();
        if (parseInt(itemID) > 0) {
            LoadItemDetailsByIDFilter2(itemID);
        }
    });
    // #endregion
});

 // #region Item 1
function LoadItemDetailsByIDFilter1(itemID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreItem/GetEStoreItemListByItemID?ItemID=" + itemID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            var itemImgURL = data[0]["itemImageURL"];
            $('#itemImageURL_1')
                .on('error', function () {
                    $(this).attr("src", '../assets/images/ecommerce/01.jpg');
                })
                .attr("src", webUrl + itemImgURL +'?v="+(new Date()).getTime()');
            $('#itemName_1').text(data[0]["itemName"]);
            $('#itemDescription_1').text(data[0]["itemDescription"]);
            var unitPrice = data[0]["unitAmount"].toString();
            $('#unitAmountDisplay_1').text("Rs. " + unitPrice);
            var availableQty = data[0]["availableQty"];
            if (availableQty > 0) {
                $('#itemAvalability_1').text("In Stock").addClass("text-success f-w-600");
            }
            else {
                $('#itemAvalability_1').text("Out of Stock").addClass("text-danger f-w-600");
            }          
            $('#vendorCategoryName_1').text(data[0]["vendorCategoryName"]);
            $('#vendorName_1').text(data[0]["vendorName"]);
            $('#uomName_1').text(data[0]["weightUnitName"]);

            LoadItemComparisorDetails();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}
// #endregion

// #region Item 2
function LoadItemDetailsByIDFilter2(itemID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "EStoreItem/GetEStoreItemListByItemID?ItemID=" + itemID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(data);
            var itemImgURL = data[0]["itemImageURL"];
            $('#itemImageURL_2')
                .on('error', function () {
                    $(this).attr("src", '../assets/images/ecommerce/01.jpg');
                })
                .attr("src", webUrl + itemImgURL + '?v="+(new Date()).getTime()');
            $('#itemName_2').text(data[0]["itemName"]);
            $('#itemDescription_2').text(data[0]["itemDescription"]);
            var unitPrice = data[0]["unitAmount"].toString();
            $('#unitAmountDisplay_2').text("Rs. " + unitPrice);
            var availableQty = data[0]["availableQty"];
            if (availableQty > 0) {
                $('#itemAvalability_2').text("In Stock").addClass("text-success f-w-600");
            }
            else {
                $('#itemAvalability_2').text("Out of Stock").addClass("text-danger f-w-600");
            }
            $('#vendorCategoryName_2').text(data[0]["vendorCategoryName"]);
            $('#vendorName_2').text(data[0]["vendorName"]);
            $('#uomName_2').text(data[0]["weightUnitName"]);

            LoadItemComparisorDetails();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}
// #endregion

// #region Item Comparisor
function LoadItemComparisorDetails() {
    var itemID_1 = $("#itemID_1").val();
    var itemID_2 = $("#itemID_2").val();

    if (parseInt(itemID_1) > 0 && parseInt(itemID_2) > 0) {
        //Amount Difference
        var itemUnitAmount_1 = $("#unitAmountDisplay_1").text();
        var itemUnitAmount_2 = $("#unitAmountDisplay_2").text();
        var itemUnitAmountF_1 = parseFloat(itemUnitAmount_1.replace('Rs. ', ''));
        var itemUnitAmountF_2 = parseFloat(itemUnitAmount_2.replace('Rs. ', ''));
        var itemUnitAmountDiff = itemUnitAmountF_1 - itemUnitAmountF_2;
        if (itemUnitAmountDiff > 0) {
            $('#unitAmountDiff').text((parseFloat(itemUnitAmountDiff).toFixed(2)).toString()).addClass("text-success f-w-600");
        }
        else {
            $('#unitAmountDiff').text((parseFloat(itemUnitAmountDiff).toFixed(2)).toString()).addClass("text-danger f-w-600");
        }

        //Category
        var vendorCategoryName_1 = $("#vendorCategoryName_1").text();
        var vendorCategoryName_2 = $("#vendorCategoryName_2").text();
        if (vendorCategoryName_1 == vendorCategoryName_2) {
            $('#vendorCategoryDiff').text("Same").addClass("text-success f-w-600");
        }
        else {
            $('#vendorCategoryDiff').text("Different").addClass("text-danger f-w-600");
        }
        //Vendor
        var vendorName_1 = $("#vendorName_1").text();
        var vendorName_2 = $("#vendorName_2").text();
        if (vendorName_1 == vendorName_2) {
            $('#vendorNameDiff').text("Same").addClass("text-success f-w-600");
        }
        else {
            $('#vendorNameDiff').text("Different").addClass("text-danger f-w-600");
        }
        //Sold In
        var uomName_1 = $("#uomName_1").text();
        var uomName_2 = $("#uomName_2").text();
        if (uomName_1 == uomName_2) {
            $('#uomNameDiff').text("Same").addClass("text-success f-w-600");
        }
        else {
            $('#uomNameDiff').text("Different").addClass("text-danger f-w-600");
        }
    }
} 
// #endregion

// #region Clear Methods
function ClearResult() {

    //clear result 1
    ClearResult1();

    //clear result 2
    ClearResult2();

    //clear comparison
    ClearResultComparisonResult();
}

function ClearResult1() {
    $("#itemSearch_1").val('');
    $("#itemID_1").val('');
    $('#itemImageURL_1')
        .on('error', function () {
            $(this).attr("src", '../assets/images/ecommerce/01.jpg');
        })
        .attr("src", webUrl + '../assets/images/ecommerce/01.jpg' + '?v="+(new Date()).getTime()');
    $('#itemName_1').text("{Search Item 1...}");
    $('#itemDescription_1').text("{Item Description}");
    $('#unitAmountDisplay_1').text("{Rs. XXXXX.XX}");
    $('#itemAvalability_1').text("{Item Availability}").removeClass("text-success f-w-600");
    $('#itemAvalability_1').text("{Item Availability}").removeClass("text-danger f-w-600");
    $('#vendorCategoryName_1').text("{Item Category}");
    $('#vendorName_1').text("{Vendor}");
    $('#uomName_1').text("{Item UOM}");
}

function ClearResult2() {
    $("#itemSearch_2").val('');
    $("#itemID_2").val('');
    $('#itemImageURL_2')
        .on('error', function () {
            $(this).attr("src", '../assets/images/ecommerce/01.jpg');
        })
        .attr("src", webUrl + '../assets/images/ecommerce/01.jpg' + '?v="+(new Date()).getTime()');
    $('#itemName_2').text("{Search Item 1...}");
    $('#itemDescription_2').text("{Item Description}");
    $('#unitAmountDisplay_2').text("{Rs. XXXXX.XX}");
    $('#itemAvalability_2').text("{Item Availability}").removeClass("text-success f-w-600");
    $('#itemAvalability_2').text("{Item Availability}").removeClass("text-danger f-w-600");
    $('#vendorCategoryName_2').text("{Item Category}");
    $('#vendorName_2').text("{Vendor}");
    $('#uomName_2').text("{Item UOM}");
}

function ClearResultComparisonResult() {
    $('#unitAmountDiff').text("{XXXXX.XX}").removeClass("text-success f-w-600");
    $('#unitAmountDiff').text("{XXXXX.XX}").removeClass("text-danger f-w-600");
    $('#vendorCategoryDiff').text("{XXXXX}").removeClass("text-success f-w-600");
    $('#vendorCategoryDiff').text("{XXXXX}").removeClass("text-danger f-w-600");
    $('#vendorNameDiff').text("{XXXXX}").removeClass("text-success f-w-600");
    $('#vendorNameDiff').text("{XXXXX}").removeClass("text-danger f-w-600");
    $('#uomNameDiff').text("{XXXXX}").removeClass("text-success f-w-600");
    $('#uomNameDiff').text("{XXXXX}").removeClass("text-danger f-w-600");
}

// #endregion