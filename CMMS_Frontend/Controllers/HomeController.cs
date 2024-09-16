using CMMS_Frontend.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Diagnostics;
using System.Security.Claims;
using CMMS_Frontend.Models.Helpers;

namespace CMMS_Frontend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public HomeController(ILogger<HomeController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Route("")]
        [Route("Home/Index")]
        [Authorize(Policy = "ViewDashboardV1")]
        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}