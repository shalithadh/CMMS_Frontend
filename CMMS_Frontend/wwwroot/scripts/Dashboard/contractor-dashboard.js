$(document).ready(function () {
    LoadAllContractorDashboardDetails();
});

function LoadAllContractorDashboardDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "Dashboard/GetContractorDashboardDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            //1st row
            var totProjects = data.contractorTotalProjects[0].totalProjects;
            $('#conTotProjects').text(totProjects.toString());
            var bestClient;
            if (data.contractorBestClients.length == 0) {
                bestClient = " - ";
            }
            else {
                bestClient = data.contractorBestClients[0].bestClient;
            }
            $('#conBestClient').text(bestClient.toString());

            var overallRating;
            if (data.contractorOverallRatings.length == 0) {
                overallRating = " - ";
            }
            else {
                overallRating = data.contractorOverallRatings[0].myOverallRating;
            }
            $('#conOverallRating').text(overallRating.toString());

            //tables
            var recentProjects = data.contractorRecentProjects;
            CreateRecentProjectTableRows(recentProjects, 'conRecentProjectBody');
            var recentCompletedTasks = data.contractorRecentCompletedTasks;
            CreateRecentCompletedTasksTableRows(recentCompletedTasks, 'conCompletedTasksBody');

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function CreateRecentProjectTableRows(recentProjects, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentProjects, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.projectTitle}</td>
                            <td>${item.clientName}</td>
                            <td>
                                <div class="progress-showcase">
                                    <div class="progress" style="height: 8px;">
                                        <div class="progress-bar bg-primary" role="progressbar" style="width: ${item.projectProgress}%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                                    </div>
                                </div>
                            </td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}

function CreateRecentCompletedTasksTableRows(recentCompletedTasks, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentCompletedTasks, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.taskName}</td>
                            <td>${item.projectTitle}</td>
                            <td>${item.clientName}</td>
                            <td>${item.completedDate}</td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}