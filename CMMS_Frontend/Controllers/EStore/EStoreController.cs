using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMMS_Frontend.Controllers.EStore
{
    public class EStoreController : Controller
    {
        private readonly ILogger<EStoreController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public EStoreController(ILogger<EStoreController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult ItemList()
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult ItemPage(int itemID)
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult CartView()
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult CheckoutPage()
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult InvoiceView(int id)
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult OrderHistory()
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult OrderView(int id)
        {
            return View();
        }

        [Authorize(Policy = "ViewEStore")]
        public IActionResult ItemCompare()
        {
            return View();
        }

    }
}
