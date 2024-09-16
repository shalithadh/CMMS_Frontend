//object
var permissionDataTable;
var allPermiData = [];
$(document).ready(function () {
    //select2
    $('#userRoleFilter').select2();

    LoadAllComboData();
    LoadDataTable();
    LoadAllPermissionList();

});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserRole/GetInitialUserRolePermiData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var userRoles = data["userRoles"];
            if (userRoles == 0) {
                toastr.warning('Please select a user role', "Warning");
            }
            else{
                BindAllUserRoles(userRoles);
            }
            
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllUserRoles(userRoles) {
    $.each(userRoles, function () {
        $("#userRoleFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}

// #endregion

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    permissionDataTable = $('#permiTable').DataTable({
        "data": [],
        "autoWidth": false,
        "columns": [
            { "data": "createUser", "width": "5%" },
            { "data": "screenName", "width": "45%" },
            { "data": "permissionName", "width": "50%" }
        ],
        "buttons": [
            {
                text: 'Select All',
                action: function () {
                    permissionDataTable.rows().select();
                }
            },
            {
                text: 'Select None',
                action: function () {
                    permissionDataTable.rows().deselect();
                }
            }
        ],
        "dom": 'Bfrtip',
        "columnDefs": [
            {
                orderable: false,
                className: 'select-checkbox',
                targets: 0 // apply checkbox for 1st row
            }
        ],
        "select": {
            //style: 'os',
            style: 'multi',
            selector: 'td:first-child'
        },
        "order": [[1, 'asc'], [2, 'asc']], //ascending order 2nd column and 3rd column
        "pageLength": 25,
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllPermissionList() {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserRole/GetUserRoleAllPermissions",
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

function LoadUserRoleWisePermissions() {
    var userRoleID = parseInt($("#userRoleFilter").val());

    if (userRoleID == 0) {
        toastr.warning('Please select an user role', "Warning");
        //deselect all rows
        permissionDataTable.rows().deselect();
    }
    else {
        loadUserRolePermissions(userRoleID);
    }
   
}

function loadUserRolePermissions(userRoleID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "UserRole/GetUserRolePermissionsByRoleID?RoleID=" + userRoleID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            var userRolewisePermissions = data;
            var selectedPermiRows = [];
            $.each(userRolewisePermissions, function (i, item) {

                let permissionID = item.permissionID;

                let permisssionDetails = allPermiData.filter(function (entry) {
                    return entry.permissionID === permissionID;
                });

                let rowID = permisssionDetails[0]["rowNo"];
                selectedPermiRows.push(rowID);
                
            });

            //console.log(selectedPermiRows);
            //deselect all rows
            permissionDataTable.rows().deselect();
            //select rows
            permissionDataTable.rows(selectedPermiRows).select();

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });


}

function SaveRolePermissions() {
    var userRoleID = parseInt($("#userRoleFilter").val());

    if (userRoleID == 0) {
        toastr.warning('Please select an user role', "Warning");
        //deselect all rows
        permissionDataTable.rows().deselect();
    }
    else {
        var selectedRows = permissionDataTable.rows('.selected').data().toArray();

        if (selectedRows.length == 0) {
            toastr.warning('Please select permission/permissions to update an user role', "Warning");
        }
        else {
            //console.log(selectedRows);
            var selectedUserRolePermissions = [];
            $.each(selectedRows, function (i, item) {

                var permissionRow = {
                    "PermissionID": parseInt(item.permissionID)
                };

                selectedUserRolePermissions.push(permissionRow);
            });

            var userRolePermiDetails = {
                "RoleID": userRoleID,
                "UserRolePermiList": selectedUserRolePermissions
            }

            SaveUserPermissionDetails(userRolePermiDetails);
        }
     
    }  
}

function SaveUserPermissionDetails(userRolePermiDetails) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "UserRole/SaveUserRolePermissionDetails",
        data: JSON.stringify(userRolePermiDetails),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {

                //Clear data
                ClearData();
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();

            }
            else {
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

function ClearData() {
    $('#userRoleFilter').val(0).change();
    //deselect all rows
    permissionDataTable.rows().deselect();
}

//function to enable buttons
function EnableButtons() {
    $("#btnSaveRolePermission").prop("disabled", false);
    $("#btnFilter").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#btnSaveRolePermission").prop("disabled", true);
    $("#btnFilter").prop("disabled", true);
}