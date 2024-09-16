using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMMS_Frontend.Controllers.UserMgnt
{
    public class UserMgntAdminController : Controller
    {
        private readonly ILogger<UserMgntAdminController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public UserMgntAdminController(ILogger<UserMgntAdminController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewUserManagement")]
        public IActionResult UserMgnt()
        {
            return View();
        }

        [Authorize(Policy = "ViewUserRolePermission")]
        public IActionResult UserRolePermissions()
        {
            return View();
        }

        [Authorize(Policy = "ViewUserPermission")]
        public IActionResult Permissions()
        {
            return View();
        }

    }
}
