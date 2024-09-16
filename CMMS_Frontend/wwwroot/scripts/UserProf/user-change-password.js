//validation variables
var currentPasswordError = true;
var newPasswordError = true;
var confirmPasswordError = true;

$(document).ready(function () {
    //load username
    LoadUserDetails();

    // #region Validations
    //Validate Current Password
    $("#currentPasswordCheck").hide();
    $("#currentPassword").keyup(function () {
        validateCurrentPassword();
    });
    //Validate New Password
    $("#newPasswordCheck").hide();
    $("#newPassword").keyup(function () {
        validateNewPassword();
    });
    //Validate Confirm Password
    $("#confirmPasswordCheck").hide();
    $("#confirmPassword").keyup(function () {
        validateConfirmPassword();
    });
    // #endregion
});

function LoadUserDetails() {
    var username = localStorage.getItem("userName");
    $('#username').val(username);
}

//Main Button event
function SubmitButtonEvent() {

    var currentPassword = $('#currentPassword').val();
    var newPassword = $('#newPassword').val();
    var confirmPassword = $('#confirmPassword').val();

    validateCurrentPassword();
    validateNewPassword();
    validateConfirmPassword();

    if (
        currentPasswordError == true &&
        newPasswordError == true &&
        confirmPasswordError == true
    ) {
        UpdateUserPassword(currentPassword, newPassword);

        return true;
    } else {
        return false;
    }  

}

// #region Update
//Update User Password
function UpdateUserPassword(currentPassword, newPassword) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "UserProfile/UpdateUserProfPassword",
        data: JSON.stringify({
            "CurrentPassword": currentPassword, "NewPassword": newPassword
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //debugger;
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {            
                //clear old data
                ClearData();
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();

                //Logout current session
                setTimeout(function () { LogOutUser(false) }, 1000);
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
function validateCurrentPassword() {
    let value = $("#currentPassword").val();
    if (value.length == "") {
        $("#currentPasswordCheck").show();
        currentPasswordError = false;
        return false;
    }
    else {
        $("#currentPasswordCheck").hide();
        currentPasswordError = true;
        return true;
    }
}

function validateNewPassword() {
    let value = $("#newPassword").val();
    if (value.length == "") {
        $("#newPasswordCheck").show();
        newPasswordError = false;
        return false;
    }
    else if (value.length < 8) {
        $("#newPasswordCheck").show();
        $("#newPasswordCheck").html("*Password should be at least 8 characters long");
        newPasswordError = false;
        return false;
    }
    else {
        $("#newPasswordCheck").hide();
        newPasswordError = true;
        return true;
    }
}

function validateConfirmPassword() {
    let value = $("#confirmPassword").val();
    let passwordValue = $("#newPassword").val();
    if (value.length == "") {
        $("#confirmPasswordCheck").show();
        confirmPasswordError = false;
        return false;
    }
    else if (passwordValue != value) {
        $("#confirmPasswordCheck").show();
        $("#confirmPasswordCheck").html("*Password didn't Match");
        confirmPasswordError = false;
        return false;
    }
    else {
        $("#confirmPasswordCheck").hide();
        confirmPasswordError = true;
        return true;
    }
}
// #endregion

function ClearData() {
    $('#currentPassword').val('');
    $('#newPassword').val('');
    $('#confirmPassword').val('');
}

//function to enable buttons
function EnableButtons() {
    $("#btnSaveDetails").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnSaveDetails").prop("disabled", true);
}