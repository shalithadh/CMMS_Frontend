$(document).ready(function () {

    var projectStatus = 0;
    //initial loading
    loadAllTypeProjectList(projectStatus, "projectListAllTab");

});

//Event used for Tabs 
function loadFilteredProjectList(tabID) {
    if (tabID == "doingProject-tab") {
        loadAllTypeProjectList(1, "projectListDoingTab");
    }
    else if (tabID == "doneProject-tab") {
        loadAllTypeProjectList(2, "projectListDoneTab");
    }
    else{
        loadAllTypeProjectList(0, "projectListAllTab");
    }
}

function loadAllTypeProjectList(projectStatus, tabDivName) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgnt/GetProjectDetailsAllByUserID?ProjectStatus=" + projectStatus,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data)
            createProjectTiles(data, tabDivName);

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });


}

function createProjectTiles(projList, tabDivName) {

    //Clearing and emptying tab
    $('#' + tabDivName).empty();
    $.each(projList, function (i, item) {

        var badgeColor = getTitleBadgeColor(item.projectStatusName); 

        var projectTileStart = `<div id="projectTile_${item.projectID}"  class="col-xxl-4 col-lg-6"> <div class="project-box" style="cursor: pointer;" onclick="redirectToTaskList(${item.projectID})">`;
        var projectTileTemplate = `<span class="badge badge-${badgeColor}">${item.projectStatusName}</span>
                                    <h6>${item.projectTitle}</h6>
                                    <div class="media">
                                        <img class="img-20 me-2 rounded-circle" src="../assets/images/dashboard/1.png" alt="" data-original-title="" title="">
                                        <div class="media-body">
                                            <p>${item.clientName}</p>
                                        </div>
                                    </div>
                                    <p>${item.description}</p>
                                    <div class="row details">
                                        <div class="col-6"><span>New Tasks </span></div>
                                        <div class="col-6 font-primary">${item.newTaskCount} </div>
                                        <div class="col-6"> <span>In Progress Tasks</span></div>
                                        <div class="col-6 font-primary">${item.inProgressTaskCount}</div>
                                        <div class="col-6"> <span>Completed Tasks</span></div>
                                        <div class="col-6 font-primary">${item.completeTaskCount}</div>
                                    </div>                                  
                                    <div class="project-status mt-4">
                                        <div class="media mb-0">
                                            <p>${item.projectProgress}% </p>
                                            <div class="media-body text-end"><span>${item.projectStatusName}</span></div>
                                        </div>
                                        <div class="progress" style="height: 5px">
                                            <div class="progress-bar-animated bg-${badgeColor} progress-bar-striped" role="progressbar" style="width: ${item.projectProgress}%" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100"></div>
                                        </div>
                                    </div> `;

        var projectTileEnd = `</div></div>`;

        var combinedTemplate = projectTileStart + projectTileTemplate + projectTileEnd;

        //Append tile to main tab
        $('#' + tabDivName).append(combinedTemplate);

    });

}

function redirectToTaskList(projectID) {
    window.location.assign('/ProjectMgnt/CreateNewTask?projectID=' + projectID);
}

function getTitleBadgeColor(projectStatus) {
    if (projectStatus == "Doing") {
        return "secondary";
    }
    else if (projectStatus == "Done") {
        return "primary";
    }
    else {
        return "info";
    }
}
