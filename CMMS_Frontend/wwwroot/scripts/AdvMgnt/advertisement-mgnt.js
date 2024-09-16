//object
var advertisementDataTable;
var allAdvData = [];
var advImgUrls = [];
var newAddedImgCount = 0;
var today;
//validation variables
var campaignNameError = true;
var startDateError = true;
var endDateError = true;
var advImageGalleryError = true;

$(document).ready(function () {

    //Today's date
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    $('#startDate,#endDate').val(today);

    LoadDataTable();
    LoadAllAdvertisementList(null, null);

    // Multiple images preview in browser
    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;
            //Clear already selected images
            advImgUrls = [];
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

    $('#advImageGallery').on('change', function () {
        imagesPreview(this, 'div.gallery');
    });

    // #region Validations
    $("#campaignNameCheck").hide();
    $("#campaignName").keyup(function () {
        validateCampaignName();
    });

    $("#startDateCheck").hide();
    $("#startDate").keyup(function () {
        validateStartDate();
    });

    $("#endDateCheck").hide();
    $("#endDate").keyup(function () {
        validateEndDate();
    });

    $("#advImageGalleryCheck").hide();
    $("#advImageGallery").change(function () {
        validateAdvImageGallery();
    });

    //Date Selector (focusout)
    $("#startDate").focusout(function () {
        var selectedDate = $("#startDate").val();
        var value = selectedDateValidator(selectedDate);
        $("#startDate").val(value);
        validateStartDate();        
    });

    $("#endDate").focusout(function () {
        var selectedDate = $("#endDate").val();
        var value = selectedDateValidator(selectedDate);
        $("#endDate").val(value);
        validateEndDate();      
    });

    //Date Selector
    $("#startDate").change(function () {
        var selectedDate = $("#startDate").val();
        var value = selectedDateValidator(selectedDate);
        $("#startDate").val(value);
        validateStartDate();
    });
    $("#endDate").change(function () {
        var selectedDate = $("#endDate").val();
        var value = selectedDateValidator(selectedDate);
        $("#endDate").val(value);
        validateEndDate();
    });

    // #endregion

});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    advertisementDataTable = $('#advMgntTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "campaignName", "width": "10%" },
            { "data": "description", "width": "15%" },
            { "data": "startDate", "width": "10%" },
            { "data": "endDate", "width": "10%" },
            //{ "data": "isActive", "width": "10%" },
            {
                "data": "isActive",
                "type": "string",
                "render": function (data, type, row) {
                    var result;
                    if (data) {
                        result = "Active";
                    }
                    else {
                        result = "Inactive";
                    }
                    return result;
                }, "width": "10%"
            },
            {
                "data": "advID",
                "render": function (data) {
                    return `
                            <button class="btn btn-primary btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="LoadAdvToEdit(${data})">
                                Edit
                            </button>                           
                     `;

                }, "width": "5%"
            }
        ],
        "pageLength": 25,
        "order": [[5, 'desc']], //descending order 5th column
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

//Filter Button Event
function LoadFilteredList() {

    var startDate = $("#startDateFilter").val();
    var endDate = $("#endDateFilter").val();

    if (startDate == "") { startDate = null; }
    if (endDate == "") { endDate = null; }

    //validations
    if (startDate == null && endDate != null) {
        toastr.warning("Please select a start date", "Warning");
    }
    else if (endDate == null && startDate != null) {
        toastr.warning("Please select a end date", "Warning");
    }
    else {

        var startDateF = new Date(startDate);
        var endDateF = new Date(endDate);
        if (startDateF > endDateF) {
            toastr.warning("Start date must be less than end date", "Warning");
        }
        else {
            LoadAllAdvertisementList(startDate, endDate);
        }
    }

}

function LoadAllAdvertisementList(startDate, endDate) {

    $.ajax({
        type: "GET",
        url: window.base_url + "AdvMgnt/GetAdvListByUserID?StartDate=" + startDate +
            "&EndDate=" + endDate,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allAdvData = [];
            allAdvData = data;
            //clear datatable
            advertisementDataTable.clear();
            //bind to datatable
            advertisementDataTable.rows.add(allAdvData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Load Add Adv Popup
function AddAdvMgntPopUp() {

    ClearData();

    //title
    $('#advModalTitle').text('Add Advertisement');
    //button text
    $('#btnSaveDetails').text('Add');
    //show reset button
    $('#btnReset').show();

    $('#addAdvModal').modal('show');
}

//Load Adv To Edit
function LoadAdvToEdit(advID) {
    //clear old data
    ClearData();
    //filter required data from json object
    var data_filter = allAdvData.filter(element => element.advID == advID);
    //console.log(data_filter);

    var advID = data_filter[0]["advID"];
    var campaignName = data_filter[0]["campaignName"];
    var description = data_filter[0]["description"];
    var startDate = data_filter[0]["startDate"];
    var endDate = data_filter[0]["endDate"];
    var isActive = data_filter[0]["isActive"];

    //title
    $('#advModalTitle').text('Update Advertisement');
    //button text
    $('#btnSaveDetails').text('Update');
    //hide reset button
    $('#btnReset').hide();

    $('#advID').val(advID);
    $('#campaignName').val(campaignName);
    $('#description').val(description);
    $('#startDate').val(startDate);
    $('#endDate').val(endDate);
    $("#isActive").prop('checked', isActive);
    LoadSavedImgURlsByAdvID(advID);
    //show modal
    $('#addAdvModal').modal('show');
}

//Main Button event
function SubmitButtonEvent() {

    var advID = $('#advID').val();
    var campaignName = $('#campaignName').val();
    var description = $('#description').val();
    var startDate = $('#startDate').val();
    var endDate = $('#endDate').val();
    var isActive = $('#isActive').is(":checked");

    validateCampaignName();
    validateStartDate();
    validateEndDate();
    validateAdvImageGallery();

    if (
        campaignNameError == true &&
        startDateError == true &&
        endDateError == true &&
        advImageGalleryError == true 
    ) {
        if (advID == null || advID == 0) {
            //Save
            SaveNewAdv(advID, campaignName, description, startDate, endDate, isActive);
        }
        else {
            //Update
            UpdateAdv(advID, campaignName, description, startDate, endDate, isActive);
        }
        return true;
    } else {
        return false;
    }  
}

// #region Save and Update
//Save Advertisement
function SaveNewAdv(advID, campaignName, description, startDate, endDate, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "AdvMgnt/SaveAdvDetails",
        data: JSON.stringify({
            "AdvID": 0, "CampaignName": campaignName, "Description": description,
            "StartDate": startDate, "EndDate": endDate,
            "IsActive": isActive
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];
            var savedID = data[0]["savedID"];
            $('#advID').val(savedID);

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('advImageGallery').files.length;
                var alreadyUploadImgUrls = advImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }
                //hide modal
                $('#addAdvModal').modal('hide');
                //Clear data
                ClearData();
                //reload table
                LoadAllAdvertisementList(null, null);
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

//Update Advertisement
function UpdateAdv(advID, campaignName, description, startDate, endDate, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "AdvMgnt/UpdateAdvDetails",
        data: JSON.stringify({
            "AdvID": advID, "CampaignName": campaignName, "Description": description,
            "StartDate": startDate, "EndDate": endDate,
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
                newAddedImgCount = document.getElementById('advImageGallery').files.length;
                var alreadyUploadImgUrls = advImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }
                //hide modal
                $('#addAdvModal').modal('hide');
                //clear old data
                ClearData();
                //reload table
                LoadAllAdvertisementList(null, null);
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
function LoadSavedImgURlsByAdvID(advID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "AdvMgnt/GetAdvImgUrlsByAdvID?AdvID=" + advID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.length > 0) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.imageURL;
                    var imgName = imgURL.imageName;
                    advImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                    //Bind Uploaded Images
                    $($.parseHTML('<img>')).attr('src', webUrl + onlyImgURL).width(150).height(150).css("margin", "2%").appendTo('div.gallery');
                }
                //console.log(advImgUrls);
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Clear Selected Images
function clearAllSelectedImages() {
    advImgUrls = [];
    newAddedImgCount = 0;
    $('#advImageGallery').val('');
    $(".gallery").empty();
}

//Image Upload
function ImageUpload(alreadyUploadImgUrls) {

    var advID = $('#advID').val();
    var input = document.getElementById('advImageGallery');
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("advID", advID);
        formData.append("files", files[i]);
    }
    //console.log(files);

    $.ajax({
        type: "POST",
        url: "/AdvMgnt/UploadFile",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            advImgUrls = [];
            advImgUrls = alreadyUploadImgUrls;
            if (data) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.fileURL;
                    var imgName = onlyImgURL.split("/").pop();
                    //console.log(imgName, onlyImgURL);
                    advImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                }
                //console.log(advImgUrls);
                SaveImageURLs(advID, advImgUrls);
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })

}

//Save Images URL in Database Level
function SaveImageURLs(advID, advImgUrls) {
    $.ajax({
        type: "POST",
        url: window.base_url + "AdvMgnt/SaveAdvImageURLs",
        data: JSON.stringify({
            "AdvID": advID, "AdvImgURLs": advImgUrls
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
function validateCampaignName() {
    let value = $("#campaignName").val();
    if (value.length == "") {
        $("#campaignNameCheck").show();
        campaignNameError = false;
        return false;
    }
    else {
        $("#campaignNameCheck").hide();
        campaignNameError = true;
        return true;
    }
}

function validateStartDate() {
    let value = $("#startDate").val();
    let valueED = $("#endDate").val();
    let startDateF = new Date(value);
    let endDateF = new Date(valueED);
    if (value.length == "") {
        $("#startDateCheck").show();
        $("#startDateCheck").html("*Start Date is required");
        startDateError = false;
        return false;
    }
    else if (startDateF > endDateF) {
        $("#startDateCheck").show();
        $("#startDateCheck").html("*Start date must be less than end date");
        startDateError = false;
        return false;
    }
    else {
        $("#startDateCheck").hide();
        startDateError = true;
        return true;
    }
}

function validateEndDate() {
    let valueSD = $("#startDate").val();
    let value = $("#endDate").val();
    let startDateF = new Date(valueSD);
    let endDateF = new Date(value);
    if (value.length == "") {
        $("#endDateCheck").show();
        endDateError = false;
        return false;
    }
    else if (startDateF > endDateF) {
        $("#startDateCheck").show();
        $("#startDateCheck").html("*Start date must be less than end date");
        endDateError = false;
        return false;
    }
    else {
        if (startDateF <= endDateF) {
            $("#startDateCheck").hide();
        }        
        $("#endDateCheck").hide();
        endDateError = true;
        return true;
    }
}

function validateAdvImageGallery() {
    let advImageCount = document.getElementById('advImageGallery').files.length;
    let alreadyUploadImageCount = advImgUrls.length;
    if (advImageCount == 0 && alreadyUploadImageCount == 0) { 
        $("#advImageGalleryCheck").show();
        advImageGalleryError = false;
        return false;
    }
    else {
        $("#advImageGalleryCheck").hide();
        advImageGalleryError = true;
        return true;
    }
}

// #endregion

function selectedDateValidator(dateValue) {
    var dateMMDDYYYRegex = "^[0-9]{2}/[0-9]{2}/[0-9]{4}$";
    if (dateValue.match(dateMMDDYYYRegex) && isValidDate(dateValue)) {
        return dateValue;
    } else {
        return today;
    }
}

function isValidDate(s) {
    var bits = s.split('/');
    var d = new Date(bits[2], bits[0] - 1, bits[1]);
    return d && (d.getMonth() + 1) == bits[0] && d.getDate() == Number(bits[1]);
}

function ClearData() {
    //button text
    $('#btnSaveDetails').text('Add');
    //show buttons
    $('#btnSaveDetails').show();
    $('#btnReset').show();
    $('#btnClearSelectedImg').show();

    $('#advID').val('');
    $('#campaignName').val('');
    $('#description').val('');
    $('#startDate').val('');
    $('#endDate').val('');
    $("#isActive").prop('checked', true);

    //Clear Uploaded Images
    advImgUrls = [];
    newAddedImgCount = 0;
    $('#advImageGallery').val('');
    $(".gallery").empty();

    $('#startDate,#endDate').val(today);

    //hide divs
    $("#campaignNameCheck").hide();
    $("#advImageGalleryCheck").hide();
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