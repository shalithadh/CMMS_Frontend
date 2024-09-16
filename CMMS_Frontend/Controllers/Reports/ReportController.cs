using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMMS_Frontend.Controllers.Reports
{
    public class ReportController : Controller
    {
        private readonly ILogger<ReportController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public ReportController(ILogger<ReportController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewReportProjectOverview")]
        public IActionResult ProjectOverview()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportProjectProgress")]
        public IActionResult ProjectProgress()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportContractorReview")]
        public IActionResult ContractorReview()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportSales")]
        public IActionResult Sales()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportOrderStatus")]
        public IActionResult OrderStatus()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportInventory")]
        public IActionResult Inventory()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportCustomer")]
        public IActionResult Customer()
        {
            return View();
        }

        [Authorize(Policy = "ViewReportPopularItem")]
        public IActionResult PopularItem()
        {
            return View();
        }

    }
}
