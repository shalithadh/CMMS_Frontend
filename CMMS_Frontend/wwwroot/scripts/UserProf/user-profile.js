var userImgUrls = [];
var newAddedImgCount = 0;
//validation variables
var firstNameError = true;
var lastNameError = true;
var nicError = true;
var mobileNoError = true;
var address1Error = true;
var address2Error = true;
var address3Error = true;
var districtError = true;
var provinceError = true;
var serviceTypeIDError = true;
var vendorCategoryTypeIDError = true;

$(document).ready(function () {
    //hide divs
    $("#userContractorView").hide();
    $("#userVendorView").hide();
    //select2
    $("#serviceTypeID").select2({
        multiple: true,
        placeholder: 'Please select Services'
    });
    $('#serviceTypeID').val([]).change();
    $("#vendorCategoryTypeID").select2({
        multiple: true,
        placeholder: 'Please select Categories'
    });
    $('#vendorCategoryTypeID').val([]).change();

    LoadAllComboData();   
    LoadAllUserProfileDetails();

    //Image preview in browser
    var imagesPreview = function (input) {

        if (input.files) {
            var filesAmount = input.files.length;
            //Clear already selected images
            userImgUrls = [];
            newAddedImgCount = 0;

            for (i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = function (event) {
                    $('#userUploadedImg')
                    .on('error', function () {
                        $(this).attr("src", '../assets/images/dashboard/avatar-user-profile-icon-.png').width(200);
                    })
                    .attr("src", event.target.result).width(200);
                }

                reader.readAsDataURL(input.files[i]);
            }
        }

    };

    $('#uploadUserImage').on('change', function () {
        imagesPreview(this);
    });

    // #region Validations
    //Validate Firstname
    $("#firstNameCheck").hide();
    $("#firstName").keyup(function () {
        validateFirstname();
    });
    //Validate Lastname
    $("#lastNameCheck").hide();
    $("#lastName").keyup(function () {
        validateLastname();
    });
    //Validate NIC
    $("#nicCheck").hide();
    $("#nic").keyup(function () {
        validateNic();
    });
    //Validate Mobile No
    $("#mobileNoCheck").hide();
    $("#mobileNo").keyup(function () {
        validateMobileNo();
    });
    //Validate Address 1
    $("#address1Check").hide();
    $("#address1").keyup(function () {
        validateAddress1();
    });
    //Validate Address 2
    $("#address2Check").hide();
    $("#address2").keyup(function () {
        validateAddress2();
    });
    //Validate Address 3
    $("#address3Check").hide();
    $("#address3").keyup(function () {
        validateAddress3();
    });
    //Validate District
    $("#districtCheck").hide();
    $("#district").keyup(function () {
        validateDistrict();
    });
    //Validate Province
    $("#provinceCheck").hide();
    $("#province").keyup(function () {
        validateProvince();
    });  
    //Validate Service Types
    $("#serviceTypeIDCheck").hide();
    $("#serviceTypeID").change(function () {
        validateServiceTypeID();
    });
    //Validate Vendor Category Type
    $("#vendorCategoryTypeIDCheck").hide();
    $("#vendorCategoryTypeID").change(function () {
        validateVendorCategoryTypeID();
    });
    // #endregion

});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "User/GetInitialUserRegData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var serviceTypes = data["serviceTypes"];
            var vendorCategoryTypes = data["vendorCategoryTypes"];

            BindAllServiceTypes(serviceTypes);
            BindAllVendorCategoryTypes(vendorCategoryTypes);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllServiceTypes(serviceTypes) {
    $.each(serviceTypes, function () {
        $("#serviceTypeID").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllVendorCategoryTypes(vendorCategoryTypes) {
    $.each(vendorCategoryTypes, function () {
        $("#vendorCategoryTypeID").append($("<option/>").val(this.valueID).text(this.value));
    });
}
// #endregion

//#region Load All User Profile Info
function LoadAllUserProfileDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserProfile/GetUserProfileDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var cusPrimaryDetails = data.cusPrimaryInfo;
            BindUserProfPrimaryInfo(cusPrimaryDetails);
            var cusAddressDetails = data.cusAddressInfo;
            BindUserProfAddressInfo(cusAddressDetails);
            var cusContractorDetails = data.cusContractorDInfo;
            //load image
            setTimeout(function () { LoadSavedImgURlsByUserID() }, 1500);
            setTimeout(function () { BindUserProfContractServiceInfo(cusContractorDetails) }, 1500);
            var cusVendorDetails = data.cusVendorDInfo;
            setTimeout(function () { BindUserProfVendorCategoryInfo(cusVendorDetails) }, 1500);        
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindUserProfPrimaryInfo(data) {
    $('#userID').val(data[0]["userID"]);
    $('#userRoleID').val(data[0]["userRoleID"]);
    $('#username').val(data[0]["username"]);
    $('#email').val(data[0]["email"]);
    $('#roleName').val(data[0]["roleName"]);
    $('#firstName').val(data[0]["firstName"]);
    $('#lastName').val(data[0]["lastName"]);
    $('#mobileNo').val(data[0]["mobileNo"]);
    $('#nic').val(data[0]["nic"]);
    var roleID = parseInt($('#userRoleID').val());
    //when role is Contractor
    if (roleID == 3) {
        $("#userContractorView").show();
        $("#userVendorView").hide();
    }
    //when role is Vendor
    else if (roleID == 4) {
        $("#userContractorView").hide();
        $("#userVendorView").show();
    }
    else {
        $("#userContractorView").hide();
        $("#userVendorView").hide();
    }
}

function BindUserProfAddressInfo(data) {
    $('#address1').val(data[0]["address1"]);
    $('#address2').val(data[0]["address2"]);
    $('#address3').val(data[0]["address3"]);
    $('#district').val(data[0]["district"]);
    $('#province').val(data[0]["province"]);
}

function BindUserProfContractServiceInfo(data) {

    var serviceArrayList = []; 
    $.each(data, function (i, item) { 
        var serviceID = item.serviceTypeID;
        serviceArrayList.push(serviceID);
    });
    //console.log(serviceArrayList);
    $("#serviceTypeID").val(serviceArrayList).change();
}

function BindUserProfVendorCategoryInfo(data) {

    var categoryArrayList = [];
    $.each(data, function (i, item) {
        var categoryID = item.vendorCategoryTypeID;
        categoryArrayList.push(categoryID);
    });
    //console.log(categoryArrayList);
    $("#vendorCategoryTypeID").val(categoryArrayList).change();
}
// #endregion

// #region Image Upload Events
//Load Saved Img Urls
function LoadSavedImgURlsByUserID() {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserProfile/GetUserProfImgUrlsByUserID",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.length > 0) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.imageURL;
                    var imgName = imgURL.imageName;
                    userImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                    //Bind Uploaded Image
                    $('#userUploadedImg')
                        .on('error', function () {
                            $(this).attr("src", '../assets/images/dashboard/avatar-user-profile-icon-.png').width(200);
                        })
                        .attr("src", webUrl + onlyImgURL + '?v="+(new Date()).getTime()').width(200);
                }
                //console.log(userImgUrls);
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}


//Image Upload
function ImageUpload(alreadyUploadImgUrls) {

    var userID = $('#userID').val();
    var input = document.getElementById('uploadUserImage');
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("userID", userID);
        formData.append("files", files[i]);
    }
    //console.log(files);

    $.ajax({
        type: "POST",
        url: "/UserProfMgnt/UploadFile",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            userImgUrls = [];
            userImgUrls = alreadyUploadImgUrls;
            if (data) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.fileURL;
                    var imgName = onlyImgURL.split("/").pop();
                    //console.log(imgName, onlyImgURL);
                    userImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                }
                //console.log(userImgUrls);
                SaveImageURLs(userID, userImgUrls);
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })

}

//Save Images URL in Database Level
function SaveImageURLs(userID, userImgUrls) {
    $.ajax({
        type: "POST",
        url: window.base_url + "UserProfile/SaveUserProfImageURLs",
        data: JSON.stringify({
            "UserID": userID, "UserImgURLs": userImgUrls
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

function ImgError(image) {
    //debugger;
    image.onerror = "";
    image.src = "assets/images/dashboard/avatar-user-profile-icon-.png";
    return true;
}

// #endregion

//Main Button event
function SubmitButtonEvent() {

    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var nic = $('#nic').val();
    var mobileNo = $('#mobileNo').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var address3 = $('#address3').val();
    var district = $('#district').val();
    var province = $('#province').val();
    var contractorServiceList = ($('#serviceTypeID').val()).toString();
    var vendorCategoryList = ($('#vendorCategoryTypeID').val()).toString();

    validateFirstname();
    validateLastname();
    validateNic();
    validateMobileNo();
    validateAddress1();
    validateAddress2();
    validateAddress3();
    validateDistrict();
    validateProvince();
    validateServiceTypeID();
    validateVendorCategoryTypeID();

    if (
        firstNameError == true &&
        lastNameError == true &&
        nicError == true &&
        mobileNoError == true &&
        address1Error == true &&
        address2Error == true &&
        address3Error == true &&
        districtError == true &&
        provinceError == true &&
        serviceTypeIDError == true &&
        vendorCategoryTypeIDError == true
    ) {
        UpdateUserProfile(firstName, lastName, nic, mobileNo, address1, address2, address3,
            district, province, contractorServiceList, vendorCategoryList);

        return true;
    } else {
        return false;
    }  

 
}

// #region Update
//Update User Profile
function UpdateUserProfile(firstName, lastName, nic, mobileNo, address1, address2, address3,
    district, province, contractorServiceList, vendorCategoryList) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "UserProfile/UpdateUserProfDetails",
        data: JSON.stringify({
            "FirstName": firstName, "LastName": lastName, "NIC": nic,
            "MobileNo": mobileNo, "Address1": address1, "Address2": address2, "Address3": address3,
            "District": district, "Province": province,
            "ContractorServiceList": contractorServiceList, "VendorCategoryList": vendorCategoryList
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //debugger;
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('uploadUserImage').files.length;
                var alreadyUploadImgUrls = userImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }
                //clear old data
                ClearData();
                //reload user data
                LoadAllUserProfileDetails();
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
                //Load User Profile Pic in SideBar
                setTimeout(function () { loadCMMSUserProfilePic() }, 3000);  
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

// #region Validations
function validateFirstname() {
    let value = $("#firstName").val();
    if (value.length == "") {
        $("#firstNameCheck").show();
        firstNameError = false;
        return false;
    }
    else {
        $("#firstNameCheck").hide();
        firstNameError = true;
        return true;
    }
}

function validateLastname() {
    let value = $("#lastName").val();
    if (value.length == "") {
        $("#lastNameCheck").show();
        lastNameError = false;
        return false;
    }
    else {
        $("#lastNameCheck").hide();
        lastNameError = true;
        return true;
    }
}
function validateNic() {
    let value = $("#nic").val();
    if (value.length == "") {
        $("#nicCheck").show();
        nicError = false;
        return false;
    }
    else if (value.length > 12) {
        $("#nicCheck").show();
        $("#nicCheck").html("*max length of NIC must be 12");
        nicError = false;
        return false;
    }
    else {
        $("#nicCheck").hide();
        nicError = true;
        return true;
    }
}

function validateMobileNo() {
    let value = $("#mobileNo").val();
    if (value.length == "") {
        $("#mobileNoCheck").show();
        mobileNoError = false;
        return false;
    }
    else if (value.length > 10) {
        $("#mobileNoCheck").show();
        $("#mobileNoCheck").html("*max length of Mobile No must be 10");
        mobileNoError = false;
        return false;
    }
    else {
        $("#mobileNoCheck").hide();
        mobileNoError = true;
        return true;
    }
}

function validateAddress1() {
    let value = $("#address1").val();
    if (value.length == "") {
        $("#address1Check").show();
        address1Error = false;
        return false;
    }
    else {
        $("#address1Check").hide();
        address1Error = true;
        return true;
    }
}

function validateAddress2() {
    let value = $("#address2").val();
    if (value.length == "") {
        $("#address2Check").show();
        address2Error = false;
        return false;
    }
    else {
        $("#address2Check").hide();
        address2Error = true;
        return true;
    }
}

function validateAddress3() {
    let value = $("#address3").val();
    if (value.length == "") {
        $("#address3Check").show();
        address3Error = false;
        return false;
    }
    else {
        $("#address3Check").hide();
        address3Error = true;
        return true;
    }
}

function validateDistrict() {
    let value = $("#district").val();
    if (value.length == "") {
        $("#districtCheck").show();
        districtError = false;
        return false;
    }
    else {
        $("#districtCheck").hide();
        districtError = true;
        return true;
    }
}
function validateProvince() {
    let value = $("#province").val();
    if (value.length == "") {
        $("#provinceCheck").show();
        provinceError = false;
        return false;
    }
    else {
        $("#provinceCheck").hide();
        provinceError = true;
        return true;
    }
}
function validateServiceTypeID() {
    let value = $("#serviceTypeID").val();
    let roleID = parseInt($("#userRoleID").val());
    if (roleID == 3 && value.length == 0) { //For Contractor Role
        $("#serviceTypeIDCheck").show();
        serviceTypeIDError = false;
        return false;
    }
    else {
        $("#serviceTypeIDCheck").hide();
        serviceTypeIDError = true;
        return true;
    }
}

function validateVendorCategoryTypeID() {
    let value = $("#vendorCategoryTypeID").val();
    let roleID = parseInt($("#userRoleID").val());
    if (roleID == 4 && value.length == 0) { //For Vendor Role
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
// #endregion

function ClearData() {
    $('#userID').val('');
    $('#userRoleID').val('');
    $('#firstName').val('');
    $('#lastName').val('');
    $('#mobileNo').val('');
    $('#nic').val('');
    $('#address1').val('');
    $('#address2').val('');
    $('#address3').val('');
    $('#district').val('');
    $('#province').val('');
    $('#serviceTypeID').val([]).change();
    $('#vendorCategoryTypeID').val([]).change();

    //Clear Uploaded Image
    userImgUrls = [];
    newAddedImgCount = 0;
    $('#uploadUserImage').val('');
}

//function to enable buttons
function EnableButtons() {
    $("#btnSaveDetails").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnSaveDetails").prop("disabled", true);
}