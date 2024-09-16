//object
var taskApprovalDataTable;
var allApprovalTasksData = [];

$(document).ready(function () {
   
    //Initialize datatable
    LoadDataTable();
    LoadAllApprovalPendingList();

});

//Initialize DataTable
function LoadDataTable() {
    //debugger;
    taskApprovalDataTable = $('#pendingAppTasksTable').DataTable({
        data: [],
        "autoWidth": false,
        "columns": [
            { "data": "projectTitle", "width": "10%" },
            { "data": "taskName", "width": "10%" },
            { "data": "serviceTypeName", "width": "5%" },
            { "data": "taskStatusName", "width": "5%" },
            { "data": "description", "width": "15%" },
            { "data": "assignToName", "width": "5%" },
            {
                "data": "taskID",
                "render": function (data) {
                    return `
                            <button class="btn btn-secondary btn-xs" type="button" data-original-title="btn btn-danger btn-xs" onclick="GoToTaskViewToApprove(${data})">
                                View
                            </button>                           
                     `;

                }, "width": "5%"
            }
        ],
        "language": {
            "emptyTable": "No data to load"
        },
    });
}

function LoadAllApprovalPendingList() {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntApproval/GetPendingApprovalTaskList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            allApprovalTasksData = [];
            allApprovalTasksData = data;
            //clear datatable
            taskApprovalDataTable.clear();
            //bind to datatable
            taskApprovalDataTable.rows.add(allApprovalTasksData).draw();
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function GoToTaskViewToApprove(taskID) {
    window.location.assign('/ProjectMgnt/TaskApprovalView?taskID=' + taskID);
}