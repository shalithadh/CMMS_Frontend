var currentRating = $('#taskRating').data('current-rating');
$(document).ready(function () {

    $("#approveModalApproveBtn").prop("disabled", true);
    $('#isVisitedSite').change(function () {
        var isChecked = $('#isVisitedSite').is(":checked");
        if (isChecked) {
            $("#approveModalApproveBtn").prop("disabled", false);
        }
        else {
            $("#approveModalApproveBtn").prop("disabled", true);
        }
    });

    //Rating Scale 
    $('.stars-example-fontawesome-o .current-rating').find('span').html(currentRating);
    $('.stars-example-fontawesome-o .clear-rating').click(function (event) {
        event.preventDefault();
        $('#taskRating').barrating('clear');
    });
    $('#taskRating').barrating({
        theme: 'fontawesome-stars-o',
        showSelectedRating: false,
        initialRating: currentRating,
        onSelect: function (value, text) {
            if (!value) {
                $('#taskRating').barrating('clear');
            } else {
                $('.stars-example-fontawesome-o .current-rating').addClass('hidden');
                $('.stars-example-fontawesome-o .your-rating').removeClass('hidden').find('span').html(value);
            }
        },
        onClear: function (value, text) {
            $('.stars-example-fontawesome-o').find('.current-rating').removeClass('hidden').end().find('.your-rating').addClass('hidden');
        }
    });

    //Page URL & Parameters
    var pageURLString = window.location.href;
    var pageURL = new URL(pageURLString);
    var taskID = pageURL.searchParams.get("taskID");

    if (taskID != null) {
        LoadPendingApprovalDetailByTaskID(taskID);
    }
    else {
        location.replace('/UserAccount/UnAuthorizedPage');
    }

});

function LoadPendingApprovalDetailByTaskID(taskID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntApproval/GetPendingApprovalTaskListByTaskID?TaskID=" + taskID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            $('#projectTitle').val(data[0]["projectTitle"]);
            $('#taskName').val(data[0]["taskName"]);
            $('#taskRate').val(data[0]["taskRate"]);
            $('#taskRateTypeName').val(data[0]["taskRateTypeName"]);
            $('#priorityName').val(data[0]["priorityName"]);
            $('#taskStatusName').val(data[0]["taskStatusName"]);
            $('#startDate').val(data[0]["startDate"]);
            $('#startTime').val(data[0]["startTime"]);
            $('#endDate').val(data[0]["endDate"]);
            $('#endTime').val(data[0]["endTime"]);
            $('#serviceTypeName').val(data[0]["serviceTypeName"]);
            $('#assignToName').val(data[0]["assignToName"]);
            $('#description').val(data[0]["description"]);
            $('#taskID').val(data[0]["taskID"]);
            $('#contractorID').val(data[0]["assignTo"]);
            //Load Images
            LoadSavedImgURlsByTaskID(data[0]["taskID"]); 
        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    });

}

function ApproveTask() {

    //Disable Buttons
    DisableButtons();
    //loader
    cmmsSvgLoader();

    var taskID = $('#taskID').val();
    var taskRating = $('#taskRating').val();
    var taskComment = $('#taskComment').val();
    var contractorID = $('#contractorID').val();
    var isVisitedSite = $('#isVisitedSite').is(":checked");

    $.ajax({
        type: "POST",
        url: window.base_url + "ProjectMgntApproval/SaveTaskReviewInfo",
        data: JSON.stringify({
            "TaskID": taskID, "Rating": taskRating, "Comment": taskComment,
            "ContractorID": contractorID, "IsVisitedSite": isVisitedSite
        }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {

            //console.log(data);
            var msg = data[0]["outputInfo"];
            var msgcode = data[0]["rsltType"];

            if (msgcode == 1) {
                //hide modal
                $('#approvalConfirmationModal').modal('hide');
                //Clear data
                ClearData();
                // Display an success toast with title
                toastr.success(msg, "Success");
                //Enable Buttons
                EnableButtons();
                //loader
                cmmsSvgLoader();
                //Redirect to Approval Pending List
                setTimeout(function () { window.location.assign('/ProjectMgnt/TaskApproval') }, 1000);  
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

function RejectTask() {

    var taskID = $('#taskID').val();
    var taskRejectReason = $('#taskRejectReason').val();

    if (taskRejectReason == '' || taskRejectReason == null) {
        toastr.warning('Please enter a reason ', "Warning");
    }
    else {
        //Disable Buttons
        DisableButtons();
        //loader
        cmmsSvgLoader();

        $.ajax({
            type: "POST",
            url: window.base_url + "ProjectMgntApproval/SaveTaskRejectInfo",
            data: JSON.stringify({
                "TaskID": taskID, "Reason": taskRejectReason
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {

                //console.log(data);
                var msg = data[0]["outputInfo"];
                var msgcode = data[0]["rsltType"];

                if (msgcode == 1) {
                    //hide modal
                    $('#taskRejectionModal').modal('hide');
                    //Clear data
                    ClearData();
                    // Display an success toast with title
                    toastr.success(msg, "Success");
                    //Enable Buttons
                    EnableButtons();
                    //loader
                    cmmsSvgLoader();
                    //Redirect to Approval Pending List
                    setTimeout(function () { window.location.assign('/ProjectMgnt/TaskApproval') }, 1000);
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

   
}

//Load Saved Img Urls
function LoadSavedImgURlsByTaskID(taskID) {

    $.ajax({
        type: "GET",
        url: window.base_url + "ProjectMgntTask/GetProjectTaskImgUrlsByTaskID?TaskID=" + taskID,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            if (data.length > 0) {
                $.each(data, function (i, item) {

                    var template = `<div class="item">
                                    <img src="${webUrl + item.imageURL}" alt="">
                                    </div>`;

                    //Append tile to main div
                    $('#taskImageList').append(template);

                });

                //Apply owlCarousel settings
                $('#taskImageList').owlCarousel({
                    loop: false,
                    margin: 10,
                    nav: false,
                    responsive: {
                        0: {
                            items: 1
                        },
                        600: {
                            items: 3
                        },
                        1000: {
                            items: 5
                        }
                    }
                })           
            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function ConfirmApprovalModal() {
    ClearData();
    $('#approvalConfirmationModal').modal('show');
}

function ConfirmRejectModal() {
    ClearData();
    $('#taskRejectionModal').modal('show');
}

function ClearData() {
    $("#approveModalApproveBtn").prop("disabled", true);
    $('#isVisitedSite').prop('checked', false);
    $('#taskRating').barrating('clear');
    $('#taskRating').val(1).change();
    $('#taskComment').val('');
    $('#taskRejectReason').val('');
}

//function to enable buttons
function EnableButtons() {
    $("#approveModalCloseBtn").prop("disabled", false);
    $("#approveModalApproveBtn").prop("disabled", false);
    $("#rejectModalCloseBtn").prop("disabled", false);
    $("#rejectModalApproveBtn").prop("disabled", false);
}

//function to disable buttons
function DisableButtons() {
    $("#approveModalCloseBtn").prop("disabled", true);
    $("#approveModalApproveBtn").prop("disabled", true);
    $("#rejectModalCloseBtn").prop("disabled", true);
    $("#rejectModalApproveBtn").prop("disabled", true);
}