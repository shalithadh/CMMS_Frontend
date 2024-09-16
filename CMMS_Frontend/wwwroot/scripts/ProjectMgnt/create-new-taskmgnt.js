//object
var taskMgntDataTable;
var allTasksData = [];
var collapsedGroups = {};
var today;
var taskImgUrls = [];
var newAddedImgCount = 0;
//validation variables
var taskNameError = true;
var taskRateError = true;
var taskRateTypeError = true;
var taskPriorityError = true;
var taskStatusError = true;
var startDateError = true;
var endDateError = true;
var serviceTypeError = true;
var assignToError = true;
var taskImageGalleryError = true;

$(document).ready(function () {
    //to hover side bar menu
    cmmsSideBarLinkSelector("/ProjectMgnt/ProjectList");
    //Today's date
    today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    $('#startDate,#endDate').val(today);
    $('#startTime,#endTime').val('00:00');
    //select2
    $('#taskStatusFilter,#taskRateType,#taskPriority,#taskStatus,#serviceType,#assignTo').select2();
    $('#startTime,#endTime').clockpicker({
        autoclose: true
    });

    // Multiple images preview in browser
    var imagesPreview = function (input, placeToInsertImagePreview) {

        if (input.files) {
            var filesAmount = input.files.length;
            //clear div
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

    $('#taskImageGallery').on('change', function () {
        imagesPreview(this, 'div.gallery');
    });

    // #region Validations
    $("#taskNameCheck").hide();
    $("#taskName").keyup(function () {
        validateTaskName();
    });

    $("#taskRateCheck").hide();
    $("#taskRate").change(function () {
        validateTaskRate();
    });

    $("#taskRateTypeCheck").hide();
    $("#taskRateType").change(function () {
        validateTaskRateType();
    });

    $("#taskPriorityCheck").hide();
    $("#taskPriority").change(function () {
        validateTaskPriority();
    });

    $("#taskStatusCheck").hide();
    $("#taskStatus").change(function () {
        validateTaskStatus();
    });

    $("#startDateCheck").hide();
    $("#startDate").keyup(function () {
        validateStartDate();
    });

    $("#endDateCheck").hide();
    $("#endDate").keyup(function () {
        validateEndDate();
    });

    $("#assignToCheck").hide();
    $("#assignTo").change(function () {
        validateAssignTo();
    });

    $("#taskImageGalleryCheck").hide();
    $("#taskImageGallery").change(function () {
        validateTaskImageGallery(); 
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
        console.log("test");
        var selectedTime = $("#startTime").val();
        var value = selectedTimeValidator(selectedTime);
        $("#startTime").val(value);
    });
    $("#endTime").change(function () {
        var selectedTime = $("#endTime").val();
        var value = selectedTimeValidator(selectedTime);
        $("#endTime").val(value);
    });

    //Service Type
    $("#serviceType").change(function () {
        $("#serviceTypeCheck").hide();
        var value = $("#serviceType").val();
        if (value != null) {
            //clear Assign To combo data
            $("#assignTo").empty().trigger('change');
            LoadAllAssignToList(value);
        }
    });

    ClearData();
    LoadAllComboData();
    //Initialize datatable
    LoadDataTable();

    // Order by the grouping
    $('#taskMgntTable tbody').on('click', 'tr.group', function () {
        var currentOrder = taskMgntDataTable.order()[0];
        if (currentOrder[0] === 1 && currentOrder[1] === 'asc') {
            taskMgntDataTable.order([1, 'desc']).draw();
        }
        else {
            taskMgntDataTable.order([1, 'asc']).draw();
        }
    });

    //Page URL & Parameters
    var pageURLString = window.location.href;
    var pageURL = new URL(pageURLString);
    var projID = pageURL.searchParams.get("projectID");

    if (projID != null) {
        LoadProjectDetailsByID(projID); 
        //load initial task list
        LoadAllProjectTasks(projID, 0, null, null);
    }
    else {
        location.replace('/ProjectMgnt/ProjectList');
    }  


});

//#region Load All Combo Data
function LoadAllComboData() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntTask/GetInitialTaskMgntData",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var taskRateTypes = data["taskRateTypes"];
            var taskPriorities = data["taskPriorities"];
            var taskStatuses = data["taskStatuses"];
            var taskServiceTypes = data["taskServiceTypes"];

            BindAllTaskRateTypes(taskRateTypes);
            BindAllTaskPriorities(taskPriorities);
            BindAllTaskStatuses(taskStatuses);
            BindAllTaskStatusesFilter(taskStatuses);
            BindAllTaskServiceTypes(taskServiceTypes);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function LoadAllAssignToList(serviceTypeID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntTask/GetAssignToContractorList?ServiceTypeID=" + serviceTypeID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            var contactorList = data["contactorList"];

            BindAllAssignTo(contactorList);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function BindAllTaskRateTypes(taskRateTypes) {
    $.each(taskRateTypes, function () {
        $("#taskRateType").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllTaskPriorities(taskPriorities) {
    $.each(taskPriorities, function () {
        $("#taskPriority").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllTaskStatuses(taskStatuses) {
    $.each(taskStatuses, function () {
        $("#taskStatus").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllTaskStatusesFilter(taskStatuses) {
    $.each(taskStatuses, function () {
        $("#taskStatusFilter").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllTaskServiceTypes(taskServiceTypes) {
    $.each(taskServiceTypes, function () {
        $("#serviceType").append($("<option/>").val(this.valueID).text(this.value));
    });
}

function BindAllAssignTo(contactorList) {
    //clear combo data
    $("#assignTo").empty().trigger('change');
    $("#assignTo").append($("<option/>").val(0).text("Please Select"));
    $.each(contactorList, function () {
        $("#assignTo").append($("<option/>").val(this.valueID).text(this.value));
    });
    $("#assignToCheck").hide();
}
// #endregion

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    taskMgntDataTable = $('#taskMgntTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "taskName", "width": "10%" },
            { "data": "taskStatus", "width": "5%", "visible": false},
            { "data": "taskStatusName", "width": "5%" },
            { "data": "priorityName", "width": "5%" },        
            { "data": "description", "width": "10%" },
            { "data": "startDate", "width": "10%" },
            { "data": "endDate", "width": "10%" },
            { "data": "assignToName", "width": "5%" },
            {
                "data": "taskID",
                "render": function (data) {
                    return `
                            <button class="btn btn-primary btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="LoadTaskToEdit(${data})">
                                Edit
                            </button>                           
                     `;

                }, "width": "5%"
            }
        ],
        "columnDefs": [
            { "visible": false, "targets": 2 }
        ],
        "order": [[1, 'asc']], // order by taskStatus ID
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(2, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                        '<tr class="group"><td colspan="7" style="background-color:	#E5E4E2; font-weight: bold;">' + group + '</td></tr>'
                    );

                    last = group;
                }
            });
        },
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

//Load Project Details By ProjectID
function LoadProjectDetailsByID(projectID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgnt/GetProjectDetailsByProjectID?ProjectID=" + projectID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);

            //To get project title
            var title = data[0]["projectTitle"];
            $('#projectTitleName').text("Project - " + title);
            $('#projectID').val(data[0]["projectID"]);
            $('#projectTitleName').append(`&emsp;<button class="btn btn-pill btn-primary btn-air-primary btn-sm" 
            onclick="redirectToEditProject(${projectID})"> Edit <i class="fa fa-edit"></i>`);
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

//Filter Button Event
function LoadFilteredTaskList() {

    var projectID = $("#projectID").val();
    var taskStatusID = $("#taskStatusFilter").val();
    var startDate = $("#startDateFilter").val();
    var endDate = $("#endDateFilter").val();

    if (startDate == "") { startDate = null;}
    if (endDate == "") { endDate = null;}

    //validations
    if (taskStatusID == 0) {
        toastr.warning("Please select a status", "Warning");
    }
    else if (startDate == null && endDate != null) {
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
            LoadAllProjectTasks(projectID, taskStatusID, startDate, endDate);
        }
    }

}

function LoadAllProjectTasks(projectID, taskStatus, startDate, endDate) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntTask/GetProjectTaskByProjectID?ProjectID=" + projectID + "&TaskStatus=" + taskStatus
            + "&StartDate=" + startDate + "&EndDate=" + endDate ,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allTasksData = [];
            allTasksData = data;
            //clear datatable
            taskMgntDataTable.clear();
            //bind to datatable
            taskMgntDataTable.rows.add(allTasksData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Load Add Task Popup
function AddTaskMgntPopUp() {

    ClearData();

    //title
    $('#taskModalTitle').text('Add Task');
    //button text
    $('#btnSaveDetails').text('Add');
    //show reset button
    $('#btnReset').show();

    //initial bindings
    $("#taskStatus").prop('disabled', true);
    $('#taskStatus').val(1).change(); //always insert a new task

    $('#addTaskModal').modal('show');
}

//Load Task To Edit
function LoadTaskToEdit(taskID) {
    //clear old data
    ClearData();
    //filter required data from json object
    var data_filter = allTasksData.filter(element => element.taskID == taskID);
    //console.log(data_filter);

    var taskID = data_filter[0]["taskID"];
    var projectID = data_filter[0]["projectID"];
    var projectTitle = data_filter[0]["projectTitle"];
    var taskName = data_filter[0]["taskName"];
    var taskRate = data_filter[0]["taskRate"];
    var taskRateType = data_filter[0]["taskRateType"];
    var taskRateTypeName = data_filter[0]["taskRateTypeName"];
    var taskPriority = data_filter[0]["taskPriority"];
    var priorityName = data_filter[0]["priorityName"];
    var taskStatus = data_filter[0]["taskStatus"];
    var taskStatusName = data_filter[0]["taskStatusName"];
    var description = data_filter[0]["description"];
    var startDate = data_filter[0]["startDate"];
    var startTime = data_filter[0]["startTime"];
    var endDate = data_filter[0]["endDate"];
    var endTime = data_filter[0]["endTime"];
    var serviceType = data_filter[0]["serviceType"];
    var serviceTypeName = data_filter[0]["serviceTypeName"];
    var assignTo = data_filter[0]["assignTo"];
    var assignToName = data_filter[0]["assignToName"];
    var approvalStatus = data_filter[0]["approvalStatus"];
    var createUser = data_filter[0]["createUser"];

    //title
    $('#taskModalTitle').text('Update Task');
    //button text
    $('#btnSaveDetails').text('Update');
    //hide reset button
    $('#btnReset').hide();

    $('#taskID').val(taskID);
    $('#projectID').val(projectID);
    $('#approvalStatus').val(approvalStatus);
    $('#taskName').val(taskName);
    $('#taskRate').val(taskRate);
    $('#taskRateType').val(taskRateType).change();
    $('#taskPriority').val(taskPriority).change();
    $('#taskStatus').val(taskStatus).change();
    $('#description').val(description);
    $('#startDate').val(startDate);
    $('#startTime').val(startTime);
    $('#endDate').val(endDate);
    $('#endTime').val(endTime);
    $('#serviceType').val(serviceType).change();
    setTimeout(function () { $('#assignTo').val(assignTo).change() }, 1800); 
    LoadSavedImgURlsByTaskID(taskID);

    if (approvalStatus == 1) { //For Completed Approved Tasks
        $('#btnSaveDetails').hide();
        $('#btnClearSelectedImg').hide();
        $("#taskApprovedMessage").show();
        $("#taskRejectedMessage").hide();        
    }
    else if (approvalStatus == 2) { //For Completed Rejected Tasks
        $('#btnSaveDetails').hide();
        $('#btnClearSelectedImg').hide();
        $("#taskApprovedMessage").hide();
        $("#taskRejectedMessage").show();     
    }

    //show modal
    $('#addTaskModal').modal('show');
}

//Main Button event
function SubmitButtonEvent() {

    var taskID = $('#taskID').val();
    var projectID = $('#projectID').val();
    var taskName = $('#taskName').val();
    var taskRate = $('#taskRate').val();
    var taskRateType = $('#taskRateType').val();
    var taskPriority = $('#taskPriority').val();
    var taskStatus = $('#taskStatus').val();
    var description = $('#description').val();
    var startDate = $('#startDate').val();
    var startTime = $('#startTime').val();
    var endDate = $('#endDate').val();
    var endTime = $('#endTime').val();
    var serviceType = $('#serviceType').val();
    var assignTo = $('#assignTo').val();

    validateTaskName();
    validateTaskRate();
    validateTaskRateType();
    validateTaskPriority();
    validateTaskStatus();
    validateStartDate();
    validateEndDate();
    validateServiceType();
    validateAssignTo();
    validateTaskImageGallery();
    
    if (
        taskNameError == true &&
        taskRateError == true &&
        taskRateTypeError == true &&
        taskPriorityError == true &&
        taskStatusError == true &&
        startDateError == true &&
        endDateError == true &&
        serviceTypeError == true &&
        assignToError == true &&
        taskImageGalleryError == true
    ) {
        if (taskID == null || taskID == 0) {
            //Save
            SaveNewTask(projectID, taskName, taskRate, taskRateType, taskPriority, taskStatus, description,
                startDate, startTime, endDate, endTime, serviceType, assignTo);
        }
        else {
            //Update
            UpdateTask(taskID, projectID, taskName, taskRate, taskRateType, taskPriority, taskStatus, description,
                startDate, startTime, endDate, endTime, serviceType, assignTo);
        }
        return true;
    } else {
        return false;
    }

}

// #region Save and Update
//Save Task
function SaveNewTask(projectID, taskName, taskRate, taskRateType, taskPriority, taskStatus, description,
    startDate, startTime, endDate, endTime, serviceType, assignTo) {

    //disable buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgntTask/SaveTaskDetails",
        data: JSON.stringify({
            "TaskID": 0, "ProjectID": projectID, "TaskName": taskName,
            "TaskRate": taskRate, "TaskRateType": taskRateType,
            "TaskPriority": taskPriority, "TaskStatus": taskStatus, "Description": description,
            "StartDate": startDate, "StartTime": startTime, "EndDate": endDate, "EndTime": endTime,
            "ServiceType": serviceType, "AssignTo": assignTo 
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];
            var savedID = data[0]["savedID"];
            $('#taskID').val(savedID);

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('taskImageGallery').files.length;
                var alreadyUploadImgUrls = taskImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }            
                //hide modal
                $('#addTaskModal').modal('hide');
                //Clear data
                ClearData();
                //reload task table
                let selectedTaskStatusFilter = $('#taskStatusFilter').val();
                let selectedStartDateFilter = $('#startDateFilter').val();
                let selectedEndDateFilter = $('#endDateFilter').val();
                if (selectedStartDateFilter == "") { selectedStartDateFilter = null; }
                if (selectedEndDateFilter == "") { selectedEndDateFilter = null; }
                LoadAllProjectTasks(projectID, selectedTaskStatusFilter, null, null);
                // Display an success toast with title
                toastr.success(msg, "Success");
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

//Update Task
function UpdateTask(taskID, projectID, taskName, taskRate, taskRateType, taskPriority, taskStatus, description,
    startDate, startTime, endDate, endTime, serviceType, assignTo) {

    //disable buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgntTask/UpdateTaskDetails",
        data: JSON.stringify({
            "TaskID": taskID, "ProjectID": projectID, "TaskName": taskName,
            "TaskRate": taskRate, "TaskRateType": taskRateType,
            "TaskPriority": taskPriority, "TaskStatus": taskStatus, "Description": description,
            "StartDate": startDate, "StartTime": startTime, "EndDate": endDate, "EndTime": endTime,
            "ServiceType": serviceType, "AssignTo": assignTo 
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //debugger;
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //Save Images
                newAddedImgCount = document.getElementById('taskImageGallery').files.length;
                var alreadyUploadImgUrls = taskImgUrls;
                if (newAddedImgCount > 0) {
                    ImageUpload(alreadyUploadImgUrls);
                }            
                //hide modal
                $('#addTaskModal').modal('hide');
                //clear old data
                ClearData();
                //reload task table
                let selectedTaskStatusFilter = $('#taskStatusFilter').val();
                let selectedStartDateFilter = $('#startDateFilter').val();
                let selectedEndDateFilter = $('#endDateFilter').val();
                if (selectedStartDateFilter == "") { selectedStartDateFilter = null; }
                if (selectedEndDateFilter == "") { selectedEndDateFilter = null; }
                LoadAllProjectTasks(projectID, selectedTaskStatusFilter, null, null);
                // Display an success toast with title
                toastr.success(msg, "Success");
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
// #endregion


// #region Image Upload Events
//Load Saved Img Urls
function LoadSavedImgURlsByTaskID(taskID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntTask/GetProjectTaskImgUrlsByTaskID?TaskID=" + taskID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.length > 0 ) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.imageURL;
                    var imgName = imgURL.imageName;
                    taskImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                    //Bind Uploaded Images
                    $($.parseHTML('<img>')).attr('src', webUrl + onlyImgURL).width(150).height(150).css("margin", "2%").appendTo('div.gallery');
                }
                //console.log(taskImgUrls);             
            }
          
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

//Clear Selected Images
function clearAllSelectedImages() {
    taskImgUrls = [];
    newAddedImgCount = 0;
    $('#taskImageGallery').val('');
    $(".gallery").empty();
}

//Image Upload
function ImageUpload(alreadyUploadImgUrls) {

    var taskID = $('#taskID').val();
    var input = document.getElementById('taskImageGallery');
    var files = input.files;
    var formData = new FormData();

    for (var i = 0; i != files.length; i++) {
        formData.append("taskID", taskID);
        formData.append("files", files[i]);
    }
    //console.log(files);

    $.ajax({
        type: "POST",
        url: "/ProjectMgnt/UploadFile",
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            //console.log(data);
            taskImgUrls = [];
            taskImgUrls = alreadyUploadImgUrls;
            if (data) {
                for (var x in data) {
                    var imgURL = data[x];
                    var onlyImgURL = imgURL.fileURL;
                    var imgName = onlyImgURL.split("/").pop();
                    //console.log(imgName, onlyImgURL);
                    taskImgUrls.push({ "imageName": imgName, "imageURL": onlyImgURL });
                }
                //console.log(taskImgUrls);
                SaveImageURLs(taskID, taskImgUrls);
            }         
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })

}

//Save Images URL in Database Level
function SaveImageURLs(taskID, taskImgUrls) {
    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgntTask/SaveTaskImageURLs",
        data: JSON.stringify({
            "TaskID": taskID, "TaskImgURLs": taskImgUrls  
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

function redirectToEditProject(projectID) {
    window.location.assign('/ProjectMgnt/CreateNewProject?projectID=' + projectID);
}

// #region Validations
function validateTaskName() {
    let value = $("#taskName").val();
    if (value.length == "") {
        $("#taskNameCheck").show();
        taskNameError = false;
        return false;
    }
    else {
        $("#taskNameCheck").hide();
        taskNameError = true;
        return true;
    }
}

function validateTaskRate() {
    let value = $("#taskRate").val();
    if (value.length == "") {
        $("#taskRateCheck").show();
        taskRateError = false;
        return false;
    }
    else {
        $("#taskRateCheck").hide();
        taskRateError = true;
        return true;
    }
}

function validateTaskRateType() {
    let value = $("#taskRateType").val();
    if (value == 0) {
        $("#taskRateTypeCheck").show();
        taskRateTypeError = false;
        return false;
    }
    else {
        $("#taskRateTypeCheck").hide();
        taskRateTypeError = true;
        return true;
    }
}

function validateTaskPriority() {
    let value = $("#taskPriority").val();
    if (value == 0) {
        $("#taskPriorityCheck").show();
        taskPriorityError = false;
        return false;
    }
    else {
        $("#taskPriorityCheck").hide();
        taskPriorityError = true;
        return true;
    }
}

function validateTaskStatus() {
    let value = $("#taskStatus").val();
    if (value == 0) {
        $("#taskStatusCheck").show();
        taskStatusError = false;
        return false;
    }
    else {
        $("#taskStatusCheck").hide();
        taskStatusError = true;
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

function validateServiceType() {
    let value = $("#serviceType").val();
    if (value == 0) {
        $("#serviceTypeCheck").show();
        serviceTypeError = false;
        return false;
    }
    else {
        $("#serviceTypeCheck").hide();
        serviceTypeError = true;
        return true;
    }
}

function validateAssignTo() {
    let value = $("#assignTo").val();
    if (value == 0 || value == "" || value == null) {
        $("#assignToCheck").show();
        assignToError = false;
        return false;
    }
    else {
        $("#assignToCheck").hide();
        assignToError = true;
        return true;
    }
}

function validateTaskImageGallery() {
    let value = $("#taskStatus").val();
    let taskImageCount = document.getElementById('taskImageGallery').files.length;
    let alreadyUploadImageCount = taskImgUrls.length;
    if (value == 3 && (taskImageCount == 0 && alreadyUploadImageCount == 0)) { //In order to complete task user need to upload images
        $("#taskImageGalleryCheck").show();
        taskImageGalleryError = false;
        return false;
    }
    else {
        $("#taskImageGalleryCheck").hide();
        taskImageGalleryError = true;
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
    console.log(timeValue);
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

function ClearData() {
    //button text
    $('#btnSaveDetails').text('Add');
    //show buttons
    $('#btnSaveDetails').show();
    $('#btnReset').show();
    $('#btnClearSelectedImg').show();
    $("#taskStatus").prop('disabled', false);

    $('#taskID').val('');
    $('#taskName').val('');
    $('#taskRate').val('');
    $('#taskRateType').val(0).change();
    $('#taskPriority').val(0).change();
    $('#taskStatus').val(0).change();
    $('#description').val('');
    $('#startDate').val(today);
    $('#startTime').val('00:00');
    $('#endDate').val(today);
    $('#endTime').val('00:00');
    $('#serviceType').val(0).change();
    //Clear Uploaded Images
    taskImgUrls = [];
    newAddedImgCount = 0;
    $('#taskImageGallery').val('');
    $(".gallery").empty();

    //hide validation mgs
    $("#taskNameCheck").hide();
    $("#taskRateCheck").hide();
    $("#taskRateTypeCheck").hide();
    $("#taskPriorityCheck").hide();
    $("#taskStatusCheck").hide();
    $("#serviceTypeCheck").hide();
    $("#assignToCheck").hide();
    $("#taskImageGalleryCheck").hide();
    $("#taskApprovedMessage").hide();
    $("#taskRejectedMessage").hide();
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