//object
var permissionDataTable;
var allPermiData = [];
//validation variables
var screenNameError = true;
var permissionNameError = true;

$(document).ready(function () {
    LoadDataTable();
    LoadAllPermissionList();

    // #region Validations
    $("#screenNameCheck").hide();
    $("#screenName").keyup(function () {
        validateScreenName();
    });

    $("#permissionNameCheck").hide();
    $("#permissionName").keyup(function () {
        validatePermissionName();
    });
    // #endregion
});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    permissionDataTable = $('#permiTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "screenName", "width": "10%" },
            { "data": "permissionName", "width": "15%" },
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
                "data": "permissionID",
                "render": function (data) {
                    return `
                            <button class="btn btn-primary btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="LoadPermiToEdit(${data})">
                                Edit
                            </button>                           
                     `;

                }, "width": "5%"
            }
        ],
        "pageLength": 25,
        "order": [[0, 'asc'], [1, 'asc']], //ascending order 1st column and 2nd column
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllPermissionList() {

    $.ajax({
        type: "GET",
        url: window.base_url + "Permission/GetAllPermissionDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allPermiData = [];
            allPermiData = data;
            //clear datatable
            permissionDataTable.clear();
            //bind to datatable
            permissionDataTable.rows.add(allPermiData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Load Add Permission Popup
function AddPermiPopUp() {

    ClearData();

    //title
    $('#permiModalTitle').text('Add Permission');
    //button text
    $('#btnSaveDetails').text('Add');
    //show reset button
    $('#btnReset').show();

    $('#addPermiModal').modal('show');
}

//Load Permission To Edit
function LoadPermiToEdit(permissionID) {
    //clear old data
    ClearData();
    //filter required data from json object
    var data_filter = allPermiData.filter(element => element.permissionID == permissionID);
    //console.log(data_filter);

    var permissionID = data_filter[0]["permissionID"];
    var screenName = data_filter[0]["screenName"];
    var permissionName = data_filter[0]["permissionName"];
    var isActive = data_filter[0]["isActive"];

    //title
    $('#permiModalTitle').text('Update Permission');
    //button text
    $('#btnSaveDetails').text('Update');
    //hide reset button
    $('#btnReset').hide();

    $('#permissionID').val(permissionID);
    $('#screenName').val(screenName);
    $('#permissionName').val(permissionName);
    $("#isActive").prop('checked', isActive);
    //show modal
    $('#addPermiModal').modal('show');
}

//Main Button event
function SubmitButtonEvent() {

    var permissionID = $('#permissionID').val();
    var screenName = $('#screenName').val();
    var permissionName = $('#permissionName').val();
    var isActive = $('#isActive').is(":checked");

    validateScreenName();
    validatePermissionName();

    if (
        screenNameError == true &&
        permissionNameError == true
    ) {
        if (permissionID == null || permissionID == 0) {
            //Save
            SaveNewPermi(permissionID, screenName, permissionName, isActive);
        }
        else {
            //Update
            UpdatePermi(permissionID, screenName, permissionName, isActive);
        }
        return true;
    } else {
        return false;
    }   
}

// #region Save and Update
//Save Permission
function SaveNewPermi(permissionID, screenName, permissionName, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "Permission/AddPermissionDetails",
        data: JSON.stringify({
            "PermissionID": 0, "ScreenName": screenName, "PermissionName": permissionName,
            "IsActive": isActive
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {              
                //hide modal
                $('#addPermiModal').modal('hide');
                //Clear data
                ClearData();
                //reload table
                LoadAllPermissionList();
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

//Update Permission
function UpdatePermi(permissionID, screenName, permissionName, isActive) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "Permission/UpdatePermissionDetails",
        data: JSON.stringify({
            "PermissionID": permissionID, "ScreenName": screenName, "PermissionName": permissionName,
            "IsActive": isActive
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //hide modal
                $('#addPermiModal').modal('hide');
                //Clear data
                ClearData();
                //reload table
                LoadAllPermissionList();
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


// #region Validations
function validateScreenName() {
    let value = $("#screenName").val();
    if (value.length == "") {
        $("#screenNameCheck").show();
        screenNameError = false;
        return false;
    }
    else {
        $("#screenNameCheck").hide();
        screenNameError = true;
        return true;
    }
}

function validatePermissionName() {
    let value = $("#permissionName").val();
    if (value.length == "") {
        $("#permissionNameCheck").show();
        permissionNameError = false;
        return false;
    }
    else {
        $("#permissionNameCheck").hide();
        permissionNameError = true;
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

    $('#permissionID').val('');
    $('#screenName').val('');
    $('#permissionName').val('');
    $("#isActive").prop('checked', true);
    $("#screenNameCheck").hide();
    $("#permissionNameCheck").hide();
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