$(document).ready(function () {
    LoadAllCustomerDashboardDetails();
});

function LoadAllCustomerDashboardDetails() {

    $.ajax({
        type: "GET",
        url: window.base_url + "Dashboard/GetCustomerDashboardDetails",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            //console.log(data);
            //1st row
            var totOrders = data.cusTotalOrders[0].totalOrders;
            $('#cusTotOrders').text(totOrders.toString());
            var prefContractor;
            if (data.cusPreferredContractors.length == 0) {
                prefContractor = " - ";
            }
            else {
                prefContractor = data.cusPreferredContractors[0].preferredContractor;
            }
            $('#cusPrefContractor').text(prefContractor.toString());

            var prefVendor;
            if (data.cusPreferredVendors.length == 0) {
                prefVendor = " - ";
            }
            else {
                prefVendor = data.cusPreferredVendors[0].preferredVendor;
            }
            $('#cusPrefVendor').text(prefVendor.toString());
            //2nd row
            var advertisements = data.cusAdvertisements;
            CreateAdvertisementCarousel(advertisements);     
            //tables
            var recentOrders = data.cusRecentOrders;
            CreateRecentOrderTableRows(recentOrders, 'cusRecentOrdersBody');
            var recentTasks = data.cusRecentTasks;
            CreateRecentTaskTableRows(recentTasks, 'cusRecentTasksBody');

            //hide or show divs
            if (advertisements.length = 0) {
                $('#cusAdvertisementCardDiv').hide();
            }
            else {
                $('#cusAdvertisementCardDiv').show();

            }

        },
        error: function (xhr, status, error) {
            toastr.warning('Server Error', "Warning");
        }
    })
}

function CreateAdvertisementCarousel(advertisements) { 

    $.each(advertisements, function (i, item) {

        var template = `<div class="item">
                            <img src="${webUrl + item.imageURL}" alt="">
                        </div>`;

        //Append tile to main div
        $('#cusAdvertisement').append(template);

    });

    //Apply owlCarousel settings
    $('#cusAdvertisement').owlCarousel({
        items: 5,
        loop: true,
        margin: 10,
        autoplay: true,
        autoplayTimeout: 1000,
        autoplayHoverPause: true,
        nav: false,
        responsive: {
            576: {
                items: 1,
                mergeFit: true
            },
            768: {
                items: 2,
                mergeFit: true
            },
            992: {
                items: 3,
                mergeFit: true

            }
        }
    }),
        $('.play').on('click', function () {
        $('#cusAdvertisement').trigger('play.owl.autoplay', [1000])
    }),
        $('.stop').on('click', function () {
        $('#cusAdvertisement').trigger('stop.owl.autoplay')
    })
}

function CreateRecentOrderTableRows(recentOrders, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentOrders, function (i, item) {

        var tableRow = `<tr>
                            <td class="f-w-600">${item.orderNo}</td>
                            <td>${item.vendorName}</td>
                            <td>${item.placedDate}</td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}

function CreateRecentTaskTableRows(recentTasks, divName) {

    //Clearing and emptying div
    $('#' + divName).empty();
    $.each(recentTasks, function (i, item) {

        var textClass;
        if (item.taskStatus == 1) {
            textClass = "text-secondary f-w-600";
        }
        else if (item.taskStatus == 2) {
            textClass = "text-warning f-w-600";
        }
        else if (item.taskStatus == 3) {
            textClass = "text-success f-w-600";
        }
        else {
            textClass = "text-danger f-w-600";
        }

        var tableRow = `<tr>
                            <td class="f-w-600">${item.taskName}</td>
                            <td>${item.projectTitle}</td>
                            <td>${item.contractorName}</td>
                            <td>
                                <div class="${textClass}">${item.taskStatusName}</div>
                            </td>
                        </tr> `;

        var combinedTable = tableRow;

        //Append row to main table
        $('#' + divName).append(combinedTable);

    });

}