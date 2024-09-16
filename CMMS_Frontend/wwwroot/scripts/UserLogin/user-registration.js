//step 1
var firstNameError = true;
var lastNameError = true;
//step 2
var usernameError = true;
var userEmailError = true;
var userPasswordError = true;
var userConfirmPasswordError = true;
//step 3
var nicError = true;
var mobileNoError = true;
var address1Error = true;
var address2Error = true;
var address3Error = true;
var districtError = true;
var provinceError = true;
//Final step
var roleIDError = true;
var serviceTypeIDError = true;
var vendorCategoryTypeIDError = true;

$(document).ready(function () {
    //hide divs
    $("#userContractorView").hide();
    $("#userVendorView").hide();
    //select2
    $('#roleID').select2();
    $("#serviceTypeID").select2({
        multiple: true,
        placeholder: 'Please select services'
    });
    $('#serviceTypeID').val([]).change();
    $("#vendorCategoryTypeID").select2({
        multiple: true,
        placeholder: 'Please select categories'
    });
    $('#vendorCategoryTypeID').val([]).change();
    //Load all combo data
    LoadAllComboData();

    // #region Step 1
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
    // #endregion

    // #region Step 2
    //Validate Username
    $("#usernameCheck").hide();
    $("#username").keyup(function () {
        validateUsername();
    });
    //Validate Email
    $("#userEmailCheck").hide();
    $("#userEmail").keyup(function () {
        validateUserEmail();
    });
    //Validate Password
    $("#userPasswordCheck").hide();
    $("#userPassword").keyup(function () {
        validateUserPassword();
    });
    //Validate Confirm Password
    $("#userConfirmPasswordCheck").hide();
    $("#userConfirmPassword").keyup(function () {
        validateUserConfirmPassword();
    });
    // #endregion

    // #region Step 3
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
    // #endregion

    // #region Final Step
    //Validate Role 
    $("#roleIDCheck").hide();
    $("#roleID").change(function () {
        validateRoleID();
        //Clear selected values
        $('#serviceTypeID').val([]).change();
        $('#vendorCategoryTypeID').val([]).change();
        var roleID = $('#roleID').val();
        if (roleID == 3) { //Contractor
            $("#userContractorView").show();
            $("#userVendorView").hide();
        }
        else if (roleID == 4) { //Vendor
            $("#userContractorView").hide();
            $("#userVendorView").show();
        }
        else {
            $("#userContractorView").hide();
            $("#userVendorView").hide();
        }
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
            var userRoleTypes = data["userRoleTypes"];
            var serviceTypes = data["serviceTypes"];
            var vendorCategoryTypes = data["vendorCategoryTypes"];

            BindAllUserRoleTypes(userRoleTypes);
            BindAllServiceTypes(serviceTypes);
            BindAllVendorCategoryTypes(vendorCategoryTypes);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllUserRoleTypes(userRoleTypes) {
    $.each(userRoleTypes, function () {
        $("#roleID").append($("<option/>").val(this.valueID).text(this.value));
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

//Button Events
// #region Step 1 Button Event
function validateFirstStep() {

    validateFirstname();
    validateLastname();
    if (
        firstNameError == true &&
        lastNameError == true
    ) {
        return true;
    } else {
        return false;
    }

}
// #endregion

// #region Step 2 Button Event
function validateSecondStep() {

    validateUsername();
    validateUserEmail();
    validateUserPassword();
    validateUserConfirmPassword();
    if (
        usernameError == true &&
        userEmailError == true &&
        userPasswordError == true &&
        userConfirmPasswordError == true
    ) {
        return true;
    } else {
        return false;
    }

}
// #endregion

// #region Step 3 Button Event
function validateThirdStep() {

    validateNic();
    validateMobileNo();
    validateAddress1();
    validateAddress2();
    validateAddress3();
    validateDistrict();
    validateProvince();
    if (
        nicError == true &&
        mobileNoError == true &&
        address1Error == true &&
        address2Error == true &&
        address3Error == true &&
        districtError == true &&
        provinceError == true
    ) {
        return true;
    } else {
        return false;
    }

}
// #endregion

// #region Final Step Button Event
function validateFinalStep() {
    //step 1
    validateFirstname();
    validateLastname();
    //step 2
    validateUsername();
    validateUserEmail();
    validateUserPassword();
    validateUserConfirmPassword();
    //step 3
    validateNic();
    validateMobileNo();
    validateAddress1();
    validateAddress2();
    validateAddress3();
    validateDistrict();
    validateProvince();
    //final step
    validateRoleID();
    validateServiceTypeID();
    validateVendorCategoryTypeID();
    if (
        //step 1
        firstNameError == true &&
        lastNameError == true &&
        //step 2
        usernameError == true &&
        userEmailError == true &&
        userPasswordError == true &&
        userConfirmPasswordError == true &&
        //step 3
        nicError == true &&
        mobileNoError == true &&
        address1Error == true &&
        address2Error == true &&
        address3Error == true &&
        districtError == true &&
        provinceError == true &&
        //final step
        roleIDError == true &&
        serviceTypeIDError == true &&
        vendorCategoryTypeIDError == true
    ) {
        //Ajax call here
        SaveUserDetails();
        //return true;
    } else {

        if (
            firstNameError == false ||
            lastNameError == false
        ) {
            //Triggers auto click event 
            var link = $("#step1");
            link.click();
        }
        else if (
            usernameError == false ||
            userEmailError == false ||
            userPasswordError == false ||
            userConfirmPasswordError == false
        ) {
            //Triggers auto click event 
            var link = $("#step2");
            link.click();
        }
        else if (
            nicError == false ||
            mobileNoError == false ||
            address1Error == false ||
            address2Error == false ||
            address3Error == false ||
            districtError == false ||
            provinceError == false
        ) {
            //Triggers auto click event 
            var link = $("#step3");
            link.click();
        }

        //return false;
    }
}
// #endregion

//Save User Details
function SaveUserDetails() {

    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var username = $('#username').val();
    var email = $('#userEmail').val();
    var password = $('#userPassword').val();
    var nic = $('#nic').val();
    var mobileNo = $('#mobileNo').val();
    var address1 = $('#address1').val();
    var address2 = $('#address2').val();
    var address3 = $('#address3').val();
    var district = $('#district').val();
    var province = $('#province').val();
    var userRoleID = $('#roleID').val();
    var contractorServiceList = ($('#serviceTypeID').val()).toString();
    var vendorCategoryList = ($('#vendorCategoryTypeID').val()).toString();

    $.ajax({
        type: "POST",
        url: window.base_url + "User/SaveUserDetails",
        data: JSON.stringify({
            "FirstName": firstName, "LastName": lastName, "Username": username,
            "Email": email, "Password": password, "NIC": nic,
            "MobileNo": mobileNo, "Address1": address1, "Address2": address2, "Address3": address3,
            "District": district, "Province": province, "UserRoleID": userRoleID,
            "ContractorServiceList": contractorServiceList, "VendorCategoryList": vendorCategoryList
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Redirect to Login Page
                setTimeout(function () { location.replace('/UserAccount/Login') }, 1000);  
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
        }
    })
}

// #region Validations (Step 1)
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
// #endregion

// #region Validations (Step 2)
function validateUsername() {
    let value = $("#username").val();
    if (value.length == "") {
        $("#usernameCheck").show();
        usernameError = false;
        return false;
    }
    else {
        $("#usernameCheck").hide();
        usernameError = true;
        return true;
    }
}

function validateUserEmail() {
    let value = $("#userEmail").val();
    if (value.length == "") {
        $("#userEmailCheck").show();
        userEmailError = false;
        return false;
    }
    else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) == false) { //Email format validation
        $("#userEmailCheck").show();
        $("#userEmailCheck").html("*Email address is invalid");
        userEmailError = false;
        return false;
    }
    else {
        $("#userEmailCheck").hide();
        userEmailError = true;
        return true;
    }
}

function validateUserPassword() {
    let value = $("#userPassword").val();
    if (value.length == "") {
        $("#userPasswordCheck").show();
        userPasswordError = false;
        return false;
    }
    else if (value.length < 8) {
        $("#userPasswordCheck").show();
        $("#userPasswordCheck").html("*Password should be at least 8 characters long");
        newPasswordError = false;
        return false;
    }
    else {
        $("#userPasswordCheck").hide();
        userPasswordError = true;
        return true;
    }
}

function validateUserConfirmPassword() {
    let value = $("#userConfirmPassword").val();
    let passwordValue = $("#userPassword").val();
    if (value.length == "") {
        $("#userConfirmPasswordCheck").show();
        userConfirmPasswordError = false;
        return false;
    }
    else if (passwordValue != value) {
        $("#userConfirmPasswordCheck").show();
        $("#userConfirmPasswordCheck").html("*Password didn't Match");
        userConfirmPasswordError = false;
        return false;
    }
    else {
        $("#userConfirmPasswordCheck").hide();
        userConfirmPasswordError = true;
        return true;
    }
}
// #endregion

// #region Validations (Step 3)
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
// #endregion

// #region Validations (Final Step)
function validateRoleID() {
    let value = $("#roleID").val();
    if (value == 0) {
        $("#roleIDCheck").show();
        roleIDError = false;
        return false;
    }
    else {
        $("#roleIDCheck").hide();
        roleIDError = true;
        return true;
    }
}

function validateServiceTypeID() {
    let value = $("#serviceTypeID").val();
    let roleID = $("#roleID").val();
    if (roleID == 3 && value == "") { //For Contractor Role
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
    let roleID = $("#roleID").val();
    if (roleID == 4 && value == "") { //For Vendor Role
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