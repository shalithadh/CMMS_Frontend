//object
var userMgntDataTable;
var allUserMgntData = [];

$(document).ready(function () {
    //Initialize datatable
    LoadDataTable();
    LoadAllUserList();
});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    userMgntDataTable = $('#userMgntTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "username", "width": "10%" },
            { "data": "email", "width": "10%" },
            { "data": "firstName", "width": "10%" },
            { "data": "lastName", "width": "10%" },
            { "data": "userRoleID", "width": "10%", visible:false },
            { "data": "roleName", "width": "10%" },
            { "data": "isActiveStatusName", "width": "10%" },
            {
                "data": "userID",
                "render": function (data) {
                    return `
                            <button class="btn btn-info btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="OpenResetUserModel(${data})">
                                Reset
                            </button>                           
                     `;

                }, "width": "10%"
            },
            {
                "data": "userID",
                "render": function (data, type, row) {
                    var buttonName;
                    var buttonColorClass;
                    var statusID;
                    var curentStatus = row.isActive;
                    if (curentStatus){
                        buttonName = "Deactivate";
                        buttonColorClass = "danger";
                        statusID = false;
                    }
                    else {
                        buttonName = "Activate";
                        buttonColorClass = "primary";
                        statusID = true
                    }

                    return `
                            <button class="btn btn-${buttonColorClass} btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="OpenUserStatusChangeModel(${data},${statusID})">
                                ${buttonName}
                            </button>                           
                     `;

                }, "width": "10%"
            }
        ],
        "order": [[4, 'asc']], //descending order 5th column
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllUserList() {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserMgnt/GetAllUserDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allUserMgntData = [];
            allUserMgntData = data;
            //clear datatable
            userMgntDataTable.clear();
            //bind to datatable
            userMgntDataTable.rows.add(allUserMgntData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function OpenResetUserModel(userID) {

    $('#resetUserID').val('');
    $('#resetUserID').val(userID);
    $('#userPasswordResetModal').modal('show');
}

function ResetUserPassword() {

    var userID = parseInt($('#resetUserID').val());

    //Disable Buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "POST",
        url: window.base_url + "UserMgnt/ResetUserPassword",
        data: JSON.stringify({
            "UserID": userID
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //hide modal
                $('#userPasswordResetModal').modal('hide');
                // Display an success toast with title
                toastr.success(msg, "Success");
                //reload table
                LoadAllUserList();
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
            //loader
            cmmsSvgLoader();
        }
    })
}

function OpenUserStatusChangeModel(userID, status) {

    $('#deactiveUserID').val('');
    $('#deactiveUserID').val(userID);
    $('#statusID').val('');
    $('#statusID').val(status);

    var statusIDString = $('#statusID').val();
    if (statusIDString == "true") {
        $('#userStatusChangeLbl').text("Are you sure, you want to activate this user?");
        //button text
        $('#deactModalApproveBtn').text('Activate');
        //show button
        $('#actModalApproveBtn').show();
        //hide button
        $('#deactModalApproveBtn').hide();
    }
    else {
        $('#userStatusChangeLbl').text("Are you sure, you want to deactivate this user?");
        //button text
        $('#deactModalApproveBtn').text('Deactivate');
        //show button
        $('#deactModalApproveBtn').show();
        //hide button
        $('#actModalApproveBtn').hide();
    }

    $('#userDeactivateModal').modal('show');
}

function UserStatusChange() {
    var userID = parseInt($('#deactiveUserID').val());
    var statusIDString = $('#statusID').val();
    var statusID;
    if (statusIDString == "true") { statusID = true; } else { statusID = false; }

    //Disable Buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "POST",
        url: window.base_url + "UserMgnt/UpdateUserStatusDetails",
        data: JSON.stringify({
            "UserID": userID, "Status": statusID
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //hide modal
                $('#userDeactivateModal').modal('hide');
                // Display an success toast with title
                toastr.success(msg, "Success");
                //reload table
                LoadAllUserList();
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
            }

            else {
                // Display an warning toast with title
                toastr.warning(msg, "Warning");
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error ', "Warning");
            //Enable Buttons
            EnableButtons();
            //loader
            cmmsSvgLoader();
        }
    })
}

//function to enable buttons
function EnableButtons() {
    $("#resetModalCloseBtn").prop("disabled", false);
    $("#resetModalApproveBtn").prop("disabled", false);
    $("#deactModalCloseBtn").prop("disabled", false);
    $("#deactModalApproveBtn").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#resetModalCloseBtn").prop("disabled", true);
    $("#resetModalApproveBtn").prop("disabled", true);
    $("#deactModalCloseBtn").prop("disabled", true);
    $("#deactModalApproveBtn").prop("disabled", true);
}