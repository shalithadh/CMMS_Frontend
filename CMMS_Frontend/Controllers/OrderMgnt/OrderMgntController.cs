using CMMS_Frontend.Controllers.EStore;
using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMMS_Frontend.Controllers.OrderMgnt
{
    public class OrderMgntController : Controller
    {

        private readonly ILogger<OrderMgntController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public OrderMgntController(ILogger<OrderMgntController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewOrderManagement")]
        public IActionResult OrderMgnt()
        {
            return View();
        }
    }
}
