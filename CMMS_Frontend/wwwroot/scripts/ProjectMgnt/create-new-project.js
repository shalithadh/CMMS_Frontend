var today;
//validation variables
var projectTitleError = true;
var clientNameError = true;
var projectPriorityError = true;
var projectSizeError = true;
var projectStatusError = true;
var startDateError = true;
var endDateError = true;

$(document).ready(function () {

    //show reset button
    $('#btnReset').show();
    //Today's date
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    $('#startDate,#endDate').val(today);
    //select2
    $('#projectType,#projectPriority,#projectSize,#projectStatus').select2();

    //autocomplete search
    $("#clientSearch").autocomplete({
        source: function (request, response) {
            $.ajax({
                url: window.base_url + "ProjectMgnt/GetSearchCustomers?searchKeyword=" + $("#clientSearch").val(),
                dataType: "json",
                data: {
                    term: request.term
                },
                success: function (data) {
                    response(data);
                }
            });
        },
        minLength: 2,
        select: function (event, ui) {
            $("#clientSearch").val(ui.item.label);
            $("#clientID").val(ui.item.value);
            $("#clientName").val(ui.item.desc);
            $("#clientNameCheck").hide();
            return false;
        }
    })
    .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>")
            .append("<div>" + item.desc + " - " + item.label + "</div>")
            .appendTo(ul);
    };


    //Clear Data
    ClearData();
    //Load all initial data
    LoadAllComboData();

    // #region Validations
    $("#projectTitleCheck").hide();
    $("#projectTitle").keyup(function () {
        validateProjectTitle();
    });

    $("#clientNameCheck").hide();
    $("#clientName").change(function () {
        validateClientName();
    });

    $("#projectPriorityCheck").hide();
    $("#projectPriority").change(function () {
        validateProjectPriority();
    });

    $("#projectSizeCheck").hide();
    $("#projectSize").change(function () {
        validateProjectSize();
    });

    $("#projectStatusCheck").hide();
    $("#projectStatus").change(function () {
        validateProjectStatus();
    });

    $("#startDateCheck").hide();
    $("#startDate").keyup(function () {
        validateStartDate();
    });

    $("#endDateCheck").hide();
    $("#endDate").keyup(function () {
        validateEndDate();
    });

    // #endregion

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

    //Time Selectors
    $("#startTime").change(function () {
        var selectedTime = $("#startTime").val();
        var value = selectedTimeValidator(selectedTime);
        $("#startTime").val(value);
    });
    $("#endTime").change(function () {
        var selectedTime = $("#endTime").val();
        var value = selectedTimeValidator(selectedTime);
        $("#endTime").val(value);
    });

});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgnt/LoadInitialData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var projectPriorities = data["projectPriorities"];
            var projectSizes = data["projectSizes"];
            var projectStatuses = data["projectStatuses"];

            BindAllProjectPriorities(projectPriorities);
            BindAllProjectSizes(projectSizes);
            BindAllProjectStatuses(projectStatuses);

            //Page URL & Parameters
            var pageURLString = window.location.href;
            var pageURL = new URL(pageURLString);
            var projID = pageURL.searchParams.get("projectID");

            //In Edit Mode
            if (projID != null) {
                LoadProjectDetailsByID(projID);
            }
            else {
                //initial bindings
                $("#projectStatus").prop('disabled', true);
                setTimeout(function () { $('#projectStatus').val(1).change() }, 1000); //always insert a doing(new) project                
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllProjectPriorities(projectPriorities) {
    $.each(projectPriorities, function () {
        $("#projectPriority").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllProjectSizes(projectSizes) {
    $.each(projectSizes, function () {
        $("#projectSize").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllProjectStatuses(projectStatuses) {
    $.each(projectStatuses, function () {
        $("#projectStatus").append($("<option/>").val(this.valueID).text(this.value));
    });
}
// #endregion

//Load Project Details By ProjectID
function LoadProjectDetailsByID(projectID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgnt/GetProjectDetailsByProjectID?ProjectID=" + projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            $('#projectID').val(data[0]["projectID"]);
            $('#projectTitle').val(data[0]["projectTitle"]);
            $('#clientID').val(data[0]["clientID"]);
            $('#clientName').val(data[0]["clientName"]);
            $('#projectPriority').val(data[0]["projectPriority"]).change();
            $('#projectSize').val(data[0]["projectSize"]).change();
            $('#startDate').val(data[0]["startDate"]);
            $('#startTime').val(data[0]["startTime"]);
            $('#endDate').val(data[0]["endDate"]);
            $('#endTime').val(data[0]["endTime"]);
            $('#description').val(data[0]["description"]);
            $('#projectStatus').val(data[0]["projectStatus"]).change();
            //button text
            $('#btnSaveDetails').text('Update');
            $("#projectStatus").prop('disabled', false);
            //hide reset button
            $('#btnReset').hide();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

//Add Button
function SubmitProjectDetails() {

    var projectID = $('#projectID').val();
    var projectTitle = $('#projectTitle').val();
    var clientID = $('#clientID').val();
    var projectPriority = $('#projectPriority').val();
    var projectSize = $('#projectSize').val();
    var startDate = $('#startDate').val();
    var startTime = $('#startTime').val();
    var endDate = $('#endDate').val();
    var endTime = $('#endTime').val();
    var description = $('#description').val();
    var projectStatus = $('#projectStatus').val();

    validateProjectTitle();
    validateClientName();
    validateProjectPriority();
    validateProjectSize();
    validateProjectStatus();
    validateStartDate();
    validateEndDate();
    if (
        projectTitleError == true &&
        clientNameError == true &&
        projectPriorityError == true &&
        projectSizeError == true &&
        projectStatusError == true &&
        startDateError == true &&
        endDateError == true
    ) {
        //Save Project
        if (projectID == null || projectID == 0) {
            SaveProject(projectTitle, clientID,
                projectPriority, projectSize,
                startDate, startTime, endDate, endTime, description, projectStatus);
        }
        //Edit Project
        else {
            UpdateProject(projectID, projectTitle, clientID,
                projectPriority, projectSize,
                startDate, startTime, endDate, endTime, description, projectStatus);
        }
        return true;
    } else {
        return false;
    }
}

// #region Save and Update
function SaveProject(projectTitle, clientID,
    projectPriority, projectSize, 
    startDate, startTime, endDate, endTime, description, projectStatus)
{

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgnt/SaveProjectDetails",
        data: JSON.stringify({
            "ProjectID": 0, "ProjectTitle": projectTitle, "ClientID": clientID,
            "ProjectPriority": projectPriority, "ProjectSize": projectSize,
            "StartDate": startDate, "StartTime": startTime, "EndDate": endDate, "EndTime": endTime,
            "Description": description, "ProjectStatus": projectStatus
        }),
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
                //Redirect to Project List
                setTimeout(function () { window.location.assign('/ProjectMgnt/ProjectList') }, 1000);  
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

function UpdateProject(projectID, projectTitle, clientID,
    projectPriority, projectSize,
    startDate, startTime, endDate, endTime, description, projectStatus) {

    //disable buttons
    DisableButtons();

    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgnt/UpdateProjectDetails",
        data: JSON.stringify({
            "ProjectID": projectID, "ProjectTitle": projectTitle, "ClientID": clientID,
            "ProjectPriority": projectPriority, "ProjectSize": projectSize,
            "StartDate": startDate, "StartTime": startTime, "EndDate": endDate, "EndTime": endTime,
            "Description": description, "ProjectStatus": projectStatus
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {

                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
                //Redirect to Project List
                setTimeout(function () { window.location.assign('/ProjectMgnt/ProjectList') }, 1000);  
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
// #endregion

// #region Validations
function validateProjectTitle() {
    let value = $("#projectTitle").val();
    if (value.length == "") {
        $("#projectTitleCheck").show();
        projectTitleError = false;
        return false;
    }
    else {
        $("#projectTitleCheck").hide();
        projectTitleError = true;
        return true;
    }
}

function validateClientName() {
    let value = $("#clientName").val();
    if (value.length == "") {
        $("#clientNameCheck").show();
        clientNameError = false;
        return false;
    }
    else {
        $("#clientNameCheck").hide();
        clientNameError = true;
        return true;
    }
}

function validateProjectPriority() {
    let value = $("#projectPriority").val();
    if (value == 0) {
        $("#projectPriorityCheck").show();
        projectPriorityError = false;
        return false;
    }
    else {
        $("#projectPriorityCheck").hide();
        projectPriorityError = true;
        return true;
    }
}

function validateProjectSize() {
    let value = $("#projectSize").val();
    if (value == 0) {
        $("#projectSizeCheck").show();
        projectSizeError = false;
        return false;
    }
    else {
        $("#projectSizeCheck").hide();
        projectSizeError = true;
        return true;
    }
}

function validateProjectStatus() {
    let value = $("#projectStatus").val();
    if (value == 0) {
        $("#projectStatusCheck").show();
        projectStatusError = false;
        return false;
    }
    else {
        $("#projectStatusCheck").hide();
        projectStatusError = true;
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

function selectedTimeValidator(timeValue) {
    var value = timeValue;
    if (/^\d{2}:\d{2}$/.test(value)) {
        if (parts[0] > 23 || parts[1] > 59) {
            return value;
        }
        else {
            return "00:00";
        }
    }
    else {
        return "00:00";
    }
}

//Clear Data
function ClearData() {
    //button text
    $('#btnSaveDetails').text('Add');
    //show reset button
    $('#btnReset').show();
    $("#projectStatus").prop('disabled', false);

    $('#projectID').val('');
    $('#projectTitle').val('');
    $('#clientSearch').val('');
    $('#clientID').val('');
    $('#clientName').val('');
    $('#projectPriority').val(0).change();
    $('#projectSize').val(0).change();
    $('#projectStatus').val(0).change();
    $('#startDate').val(today);
    $('#startTime').val('00:00');
    $('#endDate').val(today);
    $('#endTime').val('00:00');
    $('#description').val('');

    $("#projectPriorityCheck").hide();
    $("#projectSizeCheck").hide();
    $("#projectStatusCheck").hide();
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