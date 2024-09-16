//validation variables
var usernameError = true;
var passwordError = true;
var userPasswordResetError = true;
var userConfirmPasswordResetError = true;

$(document).ready(function () {
    //show div
    $('#userLoginDiv').show();
    //hide div
    $('#userResetPasswordDiv').hide();

    // #region Validations
    //Validate Username
    $("#usernameCheck").hide();
    $("#username").keyup(function () {
        validateUsername();
    });
    //Validate Password
    $("#passwordCheck").hide();
    $("#password").keyup(function () {
        validatePassword();
    });
    //Validate New Password
    $("#userPasswordResetCheck").hide();
    $("#userPasswordReset").keyup(function () {
        validateUserPasswordReset();
    });
    //Validate Confirm Password
    $("#userConfirmPasswordResetCheck").hide();
    $("#userConfirmPasswordReset").keyup(function () {
        validateUserConfirmPasswordReset();
    });
    // #endregion

});

function SignInButtonEvent() {

    var username = $('#username').val();
    var password = $('#password').val();

    validateUsername();
    validatePassword();

    if (
        usernameError == true &&
        passwordError == true
    ) {
        UserSignIn(username, password);

        return true;
    } else {
        return false;
    }   

}

function UserSignIn(username, password) {

    DisableButtons();

    $.ajax({
        type: "POST",
        url: "/UserAccount/Login",
        data: JSON.stringify({
            "UserName": username, "Password": password
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var outputMsg = data.outputMessage;
            var userDetails = data.userDetail;
            if (outputMsg.rsltType == 1) {
                //when user has a temp password
                if (userDetails.isTempPassword) {
                    $('#usernameReset').val('');
                    $('#userPasswordReset').val('');
                    $('#userConfirmPasswordReset').val('');
                    $('#usernameReset').val(username);
                    //show div
                    $('#userResetPasswordDiv').show();
                    //hide div
                    $('#userLoginDiv').hide();

                    EnableButtons();
                }
                else {
                    toastr.success(outputMsg.outputInfo, "Success");
                    localStorage.setItem("userID", userDetails.userId);
                    localStorage.setItem("userName", userDetails.userName);
                    localStorage.setItem("name", userDetails.name);
                    localStorage.setItem("roleID", userDetails.roleID);
                    localStorage.setItem("roleName", userDetails.roleName);
                    localStorage.setItem("cmmsToken", userDetails.token);
                    localStorage.setItem("permissions", userDetails.permissions);
                    //Common Parameters
                    localStorage.setItem("cmmsDeliveryCharge", userDetails.deliveryCharge);
                    //For Cart
                    localStorage.setItem("cmmsItemCart", JSON.stringify([]));

                    EnableButtons();
                    //Redirect to Home Page
                    setTimeout(function () { location.replace('/Home/Index') }, 1000);
                }
            }
            else {
                toastr.warning(outputMsg.outputInfo, "Warning");
                EnableButtons();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
            EnableButtons();
        }
    })
}

function ResetPassInButtonEvent() {

    var usernameReset = $('#usernameReset').val();
    var userPasswordReset = $('#userPasswordReset').val();
    var userConfirmPasswordReset = $('#userConfirmPasswordReset').val();

    validateUserPasswordReset();
    validateUserConfirmPasswordReset();

    if (
        userPasswordResetError == true &&
        userConfirmPasswordResetError == true
    ) {
        ResetUserLoginPassword(usernameReset, userPasswordReset);

        return true;
    } else {
        return false;
    }   

}

function ResetUserLoginPassword(usernameReset, userPasswordReset) {

    DisableButtons();

    $.ajax({
        type: "POST",
        url: "/UserAccount/ResetUserLoginPassword",
        data: JSON.stringify({
            "Username": usernameReset, "NewPassword": userPasswordReset
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                EnableButtons();
                toastr.success(msg, "Success");
                //show div
                $('#userLoginDiv').show();
                //hide div
                $('#userResetPasswordDiv').hide();
                //clear data
                $('#username').val('');
                $('#password').val('');
                $('#usernameReset').val('');
                $('#userPasswordReset').val('');
                $('#userConfirmPasswordReset').val('');
            }

            else {
                toastr.warning(msg, "Warning");
                EnableButtons();
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
            EnableButtons();
        }
    })
}

// #region Validations
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

function validatePassword() {
    let value = $("#password").val();
    if (value.length == "") {
        $("#passwordCheck").show();
        passwordError = false;
        return false;
    }
    else {
        $("#passwordCheck").hide();
        passwordError = true;
        return true;
    }
}

function validateUserPasswordReset() {
    let value = $("#userPasswordReset").val();
    if (value.length == "") {
        $("#userPasswordResetCheck").show();
        userPasswordResetError = false;
        return false;
    }
    else if (value.length < 8) {
        $("#userPasswordResetCheck").show();
        $("#userPasswordResetCheck").html("*Password should be at least 8 characters long");
        userPasswordResetError = false;
        return false;
    }
    else {
        $("#userPasswordResetCheck").hide();
        userPasswordResetError = true;
        return true;
    }
}

function validateUserConfirmPasswordReset() {
    let value = $("#userConfirmPasswordReset").val();
    let passwordValue = $("#userPasswordReset").val();
    if (value.length == "") {
        $("#userConfirmPasswordResetCheck").show();
        userConfirmPasswordResetError = false;
        return false;
    }
    else if (passwordValue != value) {
        $("#userConfirmPasswordResetCheck").show();
        $("#userConfirmPasswordResetCheck").html("*Password didn't Match");
        userConfirmPasswordResetError = false;
        return false;
    }
    else {
        $("#userConfirmPasswordResetCheck").hide();
        userConfirmPasswordResetError = true;
        return true;
    }
}
// #endregion

//function to enable buttons
function EnableButtons() {
    $("#btnSignIn").prop("disabled", false);
    $("#btnResetPassword").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnSignIn").prop("disabled", true);
    $("#btnResetPassword").prop("disabled", true);
}