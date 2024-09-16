$(document).ready(function () {
    //Hide Customization Panel
    $('.customizer-links').hide();
    loadLoggedUserDetails();
    loadCMMSUserProfilePic();
});

//AJAX Request Setup
$(document).ajaxSend(function (event, request, settings) {
    if (localStorage.getItem("cmmsToken") != null) {
        request.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('cmmsToken'));
    } else {
        request.setRequestHeader('Content-Type', 'application/json');
    }
});

$(document).ajaxError(function (event, request, settings) {

    if (request.status === 404) { //NotFound
        toastr.warning('Element not found', "Warning");
    }

    if (request.status === 401) { //UnAuthorized
        toastr.warning('User Session Expired. Redirecting to Login Page', "Warning");
        setTimeout(function () { LogOutUser(false) }, 1000);
    }

});

function loadLoggedUserDetails() {
    var userName = localStorage.getItem("name");
    //console.log(userName);
    //Bind User Name
    document.getElementById("cmms_username").innerHTML = userName;
    var roleName = localStorage.getItem("roleName");
    //Bind User Role
    document.getElementById("cmms_rolename").innerHTML = roleName;
}

//Load User Profile Picture
function loadCMMSUserProfilePic() {

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
                    //Bind Uploaded Image
                    $('#cmmsProPic')
                        .on('error', function () {
                            $(this).attr("src", '../assets/images/dashboard/1.png');
                        })
                        .attr("src", webUrl + onlyImgURL + '?v="+(new Date()).getTime()');
                }
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function cMMSProfImgError(image) {
    //debugger;
    image.onerror = "";
    image.src = "../assets/images/dashboard/1.png";
    return true;
}

function goToCMMSCartView() {
    window.location.assign('/EStore/CartView');
}

function cmmsSvgLoader() {
    $('#loading-bar').toggleClass('invisible');
    $('#pageWrapperHeader').toggleClass('blur-background');
    $('#pageCMMSSideBarDiv').toggleClass('blur-background');
    $('#pageContentBodyDiv').toggleClass('blur-background');
}

function LogOutUser(isManualLogout) {

    $.ajax({
        type: "POST",
        url: "/UserAccount/LogOut",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data)//when returns true
            {
                localStorage.removeItem("userID");
                localStorage.removeItem("userName");
                localStorage.removeItem("name");
                localStorage.removeItem("roleID");
                localStorage.removeItem("roleName");
                localStorage.removeItem("cmmsToken");
                localStorage.removeItem("permissions");
                //Common Parameters
                localStorage.removeItem("cmmsDeliveryCharge");
                //For Cart
                localStorage.removeItem("cmmsItemCart");

                if (isManualLogout) {
                    //Redirect to Login
                    location.replace('/UserAccount/Login');
                }
                else {
                    //Redirect to Login
                    location.replace('/UserAccount/Login?ReturnUrl=' + window.location.pathname + window.location.search);
                }             
            }
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
        }
    })

}