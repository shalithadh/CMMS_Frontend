//object
var itemInventoryDataTable;
var allItemInvData = [];
var itemImgUrls = [];
var newAddedImgCount = 0;
//validation variables
var vendorCategoryTypeIDError = true;
var itemNameError = true;
var itemWeightError = true;
var weightUnitError = true;
var uomError = true;
var unitAmountError = true;
var minQtyError = true;
var maxQtyError = true;
var qtyError = true;
var itemImageGalleryError = true;

$(document).ready(function () {
    //select2
    $('#vendorCategoryTypeFilter,#vendorCategoryTypeID,#weightUnit,#uom').select2();

    ClearData();
    LoadAllComboData();
    LoadDataTable();
    LoadAllItemInvList(0);

    // Multiple images preview in browser
    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;
            //Clear already selected images
            itemImgUrls = [];
            newAddedImgCount = 0;
            $(".gallery").empty();

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function (event) {
                    $($.parseHTML('<img>')).attr('src', event.target.result).width(150).height(150).css("margin", "2%").appendTo(placeToInsertImagePreview);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $('#itemImageGallery').on('change', function () {
        imagesPreview(this, 'div.gallery');
    });

    // #region Validations
    $("#vendorCategoryTypeIDCheck").hide();
    $("#vendorCategoryTypeID").change(function () {
        validateVendorCategoryTypeID();
    });

    $("#itemNameCheck").hide();
    $("#itemName").keyup(function () {
        validateItemName();
    });

    $("#itemWeightCheck").hide();
    $("#itemWeight").keyup(function () {
        validateItemWeight();
    });

    $("#weightUnitCheck").hide();
    $("#weightUnit").change(function () {
        validateWeightUnit();
    });

    $("#uomCheck").hide();
    $("#uom").change(function () {
        validateUom();
    });

    $("#unitAmountCheck").hide();
    $("#unitAmount").keyup(function () {
        validateUnitAmount();
    });

    $("#minQtyCheck").hide();
    $("#minQty").keyup(function () {
        validateMinQty();
    });

    $("#maxQtyCheck").hide();
    $("#maxQty").keyup(function () {
        validateMaxQty();
    });

    $("#qtyCheck").hide();
    $("#qty").keyup(function () {
        validateQty();
    });

    $("#itemImageGalleryCheck").hide();
    $("#itemImageGallery").change(function () {
        validateItemImageGallery();
    });
    // #endregion

});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ItemInventory/GetInitialItemInventoryData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var vendorCategoryTypes = data["vendorCategoryTypes"];
            var weightUnits = data["weightUnits"];
            var itemUOMs = data["itemUOMs"];
         
            BindAllVendorCategoryTypes(vendorCategoryTypes);
            BindAllVendorCategoryTypesFilter(vendorCategoryTypes);
            BindAllWeightTypes(weightUnits);
            BindAllItemUOM(itemUOMs);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllVendorCategoryTypes(vendorCategoryTypes) {
    $.each(vendorCategoryTypes, function () {
        $("#vendorCategoryTypeID").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllVendorCategoryTypesFilter(vendorCategoryTypes) {
    $.each(vendorCategoryTypes, function () {
        $("#vendorCategoryTypeFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllWeightTypes(weightUnits) {
    $.each(weightUnits, function () {
        $("#weightUnit").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllItemUOM(itemUOMs) {
    $.each(itemUOMs, function () {
        $("#uom").append($("<option/>").val(this.valueID).text(this.value));
    });
}
// #endregion

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    itemInventoryDataTable = $('#inventoryMgntTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "itemName", "width": "10%" },
            { "data": "vendorCategoryName", "width": "15%" },
            { "data": "uomName", "width": "10%" },
            { "data": "totalQty", "width": "5%" },
            { "data": "soldQty", "width": "5%" },
            { "data": "availableQty", "width": "5%" },
            { "data": "isActiveStatusName", "width": "5%" },
            {
                "data": "itemID",
                "render": function (data) {
                    return `
                            <button class="btn btn-primary btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="LoadItemToEdit(${data})">
                                Edit
                            </button>                           
                     `;

                }, "width": "5%"
            }
        ],     
        "pageLength": 25,
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

//Filter Button Event
function LoadFilteredList() {

    var vendorCategoryTypeID = $("#vendorCategoryTypeFilter").val();

    //validations
    if (vendorCategoryTypeID == 0) {
        toastr.warning("Please select a Vendor Category Type", "Warning");
    }
    else {
        LoadAllItemInvList(vendorCategoryTypeID);
    }

}

function LoadAllItemInvList(vendorCategoryTypeID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ItemInventory/GetItemInvListByUserID?VendorCategoryTypeID=" + vendorCategoryTypeID, 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allItemInvData = [];
            allItemInvData = data;
            //clear datatable
            itemInventoryDataTable.clear();
            //bind to datatable
            itemInventoryDataTable.rows.add(allItemInvData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Load Add Item Popup
function AddItemMgntPopUp() {

    ClearData();

    //title
    $('#itemModalTitle').text('Add Item');
    //button text
    $('#btnSaveDetails').text('Add');
    //show reset button
    $('#btnReset').show();

    $('#addItemModal').modal('show');
}

//Load Item To Edit
function LoadItemToEdit(itemID) {
    //clear old data
    ClearData();
    //filter required data from json object
    var data_filter = allItemInvData.filter(element => element.itemID == itemID);
    //console.log(data_filter);

    var itemID = data_filter[0]["itemID"];
    var vendorCategoryTypeID = data_filter[0]["vendorCategoryTypeID"];
    var vendorCategoryName = data_filter[0]["vendorCategoryName"];
    var itemName = data_filter[0]["itemName"];
    var itemDescription = data_filter[0]["itemDescription"];
    var itemWeight = data_filter[0]["itemWeight"];
    var weightUnit = data_filter[0]["weightUnit"];
    var weightUnitName = data_filter[0]["weightUnitName"];
    var uom = data_filter[0]["uom"];
    var uomName = data_filter[0]["uomName"];
    var unitAmount = data_filter[0]["unitAmount"];
    var minQty = data_filter[0]["minQty"];
    var maxQty = data_filter[0]["maxQty"];
    var totalQty = data_filter[0]["totalQty"];
    var soldQty = data_filter[0]["soldQty"];
    var availableQty = data_filter[0]["availableQty"];
    var isSoldUnitWise = data_filter[0]["isSoldUnitWise"];
    var isActive = data_filter[0]["isActive"];
    var isActiveStatusName = data_filter[0]["isActiveStatusName"];

    //title
    $('#itemModalTitle').text('Update Item');
    //button text
    $('#btnSaveDetails').text('Update');
    //hide reset button
    $('#btnReset').hide();

    $('#itemID').val(itemID);
    $('#vendorCategoryTypeID').val(vendorCategoryTypeID).change();
    $('#itemName').val(itemName);
    $('#itemDescription').val(itemDescription);
    $('#itemWeight').val(itemWeight);
    $('#weightUnit').val(weightUnit).change();
    $('#uom').val(uom).change();
    $('#unitAmount').val(unitAmount);
    $('#minQty').val(minQty);
    $('#maxQty').val(maxQty);
    $('#qty').val(totalQty);
    $("#isSoldUnitWise").prop('checked', isSoldUnitWise);
    $("#isActive").prop('checked', isActive);
    LoadSavedImgURlsByItemID(itemID);
    //show modal
    $('#addItemModal').modal('show');
}

//Main Button event
function SubmitButtonEvent() {

    var itemID = $('#itemID').val();
    var vendorCategoryTypeID = $('#vendorCategoryTypeID').val();
    var itemName = $('#itemName').val();
    var itemDescription = $('#itemDescription').val();
    var itemWeight = $('#itemWeight').val();
    var weightUnit = $('#weightUnit').val();
    var uom = $('#uom').val();
    var unitAmount = $('#unitAmount').val();
    var minQty = $('#minQty').val();
    var maxQty = $('#maxQty').val();
    var qty = $('#qty').val();
    var isSoldUnitWise = $('#isSoldUnitWise').is(":checked");
    var isActive = $('#isActive').is(":checked");

    validateVendorCategoryTypeID();
    validateItemName();
    validateItemWeight();
    validateWeightUnit();
    validateUom();
    validateUnitAmount();
    validateMinQty();
    validateMaxQty();
    validateQty();
    validateItemImageGallery();

    if (
        vendorCategoryTypeIDError == true &&
        itemNameError == true &&
        itemWeightError == true &&
        weightUnitError == true &&
        uomError == true &&
        unitAmountError == true &&
        minQtyError == true &&
        maxQtyError == true &&
        qtyError == true &&
        itemImageGalleryError == true
    ) {
        if (itemID == null || itemID == 0) {
            //Save
            SaveNewItem(itemID, vendorCategoryTypeID, itemName, itemDescription, itemWeight, weightUnit, uom,
                unitAmount, minQty, maxQty, qty, isSoldUnitWise, isActive);
        }
        else {
            //Update
            UpdateItem(itemID, vendorCategoryTypeID, itemName, itemDescription, itemWeight, weightUnit, uom,
                unitAmount, minQty, maxQty, qty, isSoldUnitWise, isActive);
        }
        return true;
    } else {
        return false;
    }  
}

// #region Save and Update
//Save Item
function SaveNewItem(itemID, vendorCategoryTypeID, itemName, itemDescription, itemWeight, weightUnit, uom,
    unitAmount, minQty, maxQty, qty, isSoldUnitWise, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "ItemInventory/SaveItemInvDetails",
        data: JSON.stringify({
            "ItemID": 0, "VendorCategoryTypeID": vendorCategoryTypeID, "ItemName": itemName,
            "ItemDescription": itemDescription, "ItemWeight": itemWeight,
            "WeightUnit": weightUnit, "UOM": uom, "UnitAmount": unitAmount,
            "MinQty": minQty, "MaxQty": maxQty, "Qty": qty, "IsSoldUnitWise": isSoldUnitWise,
            "IsActive": isActive
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];
            var savedID = data[0]["savedID"];
            $('#itemID').val(savedID);

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('itemImageGallery').files.length;
                var alreadyUploadImgUrls = itemImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }            
                //hide modal
                $('#addItemModal').modal('hide');
                //Clear data
                ClearData();
                //reload table
                var vendorCategoryTypeID = $("#vendorCategoryTypeFilter").val();
                LoadAllItemInvList(vendorCategoryTypeID);
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
        }
    })
}

//Update Item
function UpdateItem(itemID, vendorCategoryTypeID, itemName, itemDescription, itemWeight, weightUnit, uom,
    unitAmount, minQty, maxQty, qty, isSoldUnitWise, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "ItemInventory/UpdateItemInvDetails",
        data: JSON.stringify({
            "ItemID": itemID, "VendorCategoryTypeID": vendorCategoryTypeID, "ItemName": itemName,
            "ItemDescription": itemDescription, "ItemWeight": itemWeight,
            "WeightUnit": weightUnit, "UOM": uom, "UnitAmount": unitAmount,
            "MinQty": minQty, "MaxQty": maxQty, "Qty": qty, "IsSoldUnitWise": isSoldUnitWise,
            "IsActive": isActive
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //debugger;
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('itemImageGallery').files.length;
                var alreadyUploadImgUrls = itemImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }           
                //hide modal
                $('#addItemModal').modal('hide');
                //clear old data
                ClearData();
                //reload table
                var vendorCategoryTypeID = $("#vendorCategoryTypeFilter").val();
                LoadAllItemInvList(vendorCategoryTypeID);
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
        }
    })

}
// #endregion

// #region Image Upload Events
//Load Saved Img Urls
function LoadSavedImgURlsByItemID(itemID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ItemInventory/GetItemInvImgUrlsByItemID?ItemID=" + itemID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.length > 0) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.imageURL;
                    var imgName = imgURL.imageName;
                    itemImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                    //Bind Uploaded Images
                    $($.parseHTML('<img>')).attr('src', webUrl + onlyImgURL).width(150).height(150).css("margin", "2%").appendTo('div.gallery');
                }
                //console.log(itemImgUrls);
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Clear Selected Images
function clearAllSelectedImages() {
    itemImgUrls = [];
    newAddedImgCount = 0;
    $('#itemImageGallery').val('');
    $(".gallery").empty();
}

//Image Upload
function ImageUpload(alreadyUploadImgUrls) {

    var itemID = $('#itemID').val();
    var input = document.getElementById('itemImageGallery');
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("itemID", itemID);
        formData.append("files", files[i]);
    }
    //console.log(files);

    $.ajax({
        type: "POST",
        url: "/ItemInventory/UploadFile",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            itemImgUrls = [];
            itemImgUrls = alreadyUploadImgUrls;
            if (data) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.fileURL;
                    var imgName = onlyImgURL.split("/").pop();
                    //console.log(imgName, onlyImgURL);
                    itemImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                }
                //console.log(itemImgUrls);
                SaveImageURLs(itemID, itemImgUrls);
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })

}

//Save Images URL in Database Level
function SaveImageURLs(itemID, itemImgUrls) {
    $.ajax({
        type: "POST",
        url: window.base_url + "ItemInventory/SaveItemImageURLs",
        data: JSON.stringify({
            "ItemID": itemID, "ItemImgURLs": itemImgUrls
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //debugger;
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];
            if (msgcode == 1) {
                console.log(msg);
            }
            else {
                console.log(msg);
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
        }
    })
}
// #endregion

// #region Validations
function validateVendorCategoryTypeID() {
    let value = $("#vendorCategoryTypeID").val();
    if (value == 0) {
        $("#vendorCategoryTypeIDCheck").show();
        vendorCategoryTypeIDError = false;
        return false;
    }
    else {
        $("#vendorCategoryTypeIDCheck").hide();
        vendorCategoryTypeIDError = true;
        return true;
    }
}

function validateItemName() {
    let value = $("#itemName").val();
    if (value.length == "") {
        $("#itemNameCheck").show();
        itemNameError = false;
        return false;
    }
    else {
        $("#itemNameCheck").hide();
        itemNameError = true;
        return true;
    }
}

function validateItemWeight() {
    let value = $("#itemWeight").val();
    if (value.length == "") {
        $("#itemWeightCheck").show();
        itemWeightError = false;
        return false;
    }
    else if ($.isNumeric(value) != true) {
        $("#itemWeightCheck").show();
        $("#itemWeightCheck").html("*Enter numeric values for Item Weight");
        itemWeightError = false;
        return false;
    }
    else {
        $("#itemWeightCheck").hide();
        itemWeightError = true;
        return true;
    }
}

function validateWeightUnit() {
    let value = $("#weightUnit").val();
    if (value == 0) {
        $("#weightUnitCheck").show();
        weightUnitError = false;
        return false;
    }
    else {
        $("#weightUnitCheck").hide();
        weightUnitError = true;
        return true;
    }
}

function validateUom() {
    let value = $("#uom").val();
    if (value == 0) {
        $("#uomCheck").show();
        uomError = false;
        return false;
    }
    else {
        $("#uomCheck").hide();
        uomError = true;
        return true;
    }
}

function validateUnitAmount() {
    let value = $("#unitAmount").val();
    if (value.length == "") {
        $("#unitAmountCheck").show();
        unitAmountError = false;
        return false;
    }
    else if ($.isNumeric(value) != true) {
        $("#unitAmountCheck").show();
        $("#unitAmountCheck").html("*Enter numeric values for Unit Amount");
        unitAmountError = false;
        return false;
    }
    else {
        $("#unitAmountCheck").hide();
        unitAmountError = true;
        return true;
    }
}

function validateMinQty() {
    let value = $("#minQty").val();
    if (value.length == "") {
        $("#minQtyCheck").show();
        minQtyError = false;
        return false;
    }
    else if ($.isNumeric(value) != true) {
        $("#minQtyCheck").show();
        $("#minQtyCheck").html("*Enter numeric values for Min Qty");
        minQtyError = false;
        return false;
    }
    else {
        $("#minQtyCheck").hide();
        minQtyError = true;
        return true;
    }
}

function validateMaxQty() {
    let value = $("#maxQty").val();
    if (value == "") {
        $("#maxQtyCheck").show();
        maxQtyError = false;
        return false;
    }
    else if ($.isNumeric(value) != true) {
        $("#maxQtyCheck").show();
        $("#maxQtyCheck").html("*Enter numeric values for Max Qty");
        maxQtyError = false;
        return false;
    }
    else {
        $("#maxQtyCheck").hide();
        maxQtyError = true;
        return true;
    }
}

function validateQty() {
    let value = $("#qty").val();
    if (value == "") {
        $("#qtyCheck").show();
        qtyError = false;
        return false;
    }
    else if ($.isNumeric(value) != true) {
        $("#qtyCheck").show();
        $("#qtyCheck").html("*Enter numeric values for Qty");
        qtyError = false;
        return false;
    }
    else {
        $("#qtyCheck").hide();
        qtyError = true;
        return true;
    }
}

function validateItemImageGallery() {

    let itemImageCount = document.getElementById('itemImageGallery').files.length;
    let alreadyUploadedImageCount = itemImgUrls.length;
    if (itemImageCount == 0 && alreadyUploadedImageCount == 0) { //In order to save item user need to upload images
        $("#itemImageGalleryCheck").show();
        itemImageGalleryError = false;
        return false;
    }
    else {
        $("#itemImageGalleryCheck").hide();
        itemImageGalleryError = true;
        return true;
    }
}

// #endregion

function ClearData() {
    //button text
    $('#btnSaveDetails').text('Add');
    //show buttons
    $('#btnSaveDetails').show();
    $('#btnReset').show();
    $('#btnClearSelectedImg').show();

    $('#itemID').val('');
    $('#vendorCategoryTypeID').val(0).change();
    $('#itemName').val('');
    $('#itemDescription').val('');
    $('#itemWeight').val('');
    $('#weightUnit').val(0).change();
    $('#uom').val(0).change();
    $('#unitAmount').val('');
    $('#minQty').val('');
    $('#maxQty').val('');
    $('#qty').val('');
    $("#isSoldUnitWise").prop('checked', false);
    $("#isActive").prop('checked', true);
    
    //Clear Uploaded Images
    itemImgUrls = [];
    newAddedImgCount = 0;
    $('#itemImageGallery').val('');
    $(".gallery").empty();

    //hide validation mgs
    $("#vendorCategoryTypeIDCheck").hide();
    $("#itemNameCheck").hide();
    $("#itemWeightCheck").hide();
    $("#weightUnitCheck").hide();
    $("#uomCheck").hide();
    $("#unitAmountCheck").hide();
    $("#minQtyCheck").hide();
    $("#maxQtyCheck").hide();
    $("#qtyCheck").hide();
    $("#itemImageGalleryCheck").hide();
}

//function to enable buttons
function EnableButtons() {
    $("#btnReset").prop("disabled", false);
    $("#btnSaveDetails").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnReset").prop("disabled", true);
    $("#btnSaveDetails").prop("disabled", true);
}