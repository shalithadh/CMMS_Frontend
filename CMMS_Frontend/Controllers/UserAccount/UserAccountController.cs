using CMMS_Frontend.Models;
using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Claims;

namespace CMMS_Frontend.Controllers.UserAccount
{
    public class UserAccountController : Controller
    {
        private readonly ILogger<UserAccountController> _logger;
        private readonly CMMS_API _cMMSAPI;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserAccountController(ILogger<UserAccountController> logger, CMMS_API cMMSAPI,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet, AllowAnonymous]
        public IActionResult Login(string returnUrl)
        {
            if (User.Identity.IsAuthenticated)
            {
                return RedirectToAction("Index", "Home");
            }
            return View();
        }

        [HttpGet, AllowAnonymous]
        public IActionResult Registration()
        {       
            return View();
        }

        public IActionResult NotFoundPage()
        {
            return View();
        }

        public IActionResult UnAuthorizedPage()
        {
            return View();
        }

        public IActionResult ErrorPage()
        {
            return View();
        }

        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserDetail loginViewModel)
        {

            HttpClient client = _cMMSAPI.initial();
            var response = await client.PostAsJsonAsync("User/UserLogin", loginViewModel);

            if (response.IsSuccessStatusCode)
            {
                var authData = await response.Content.ReadAsAsync<UserLogin>();
                if (authData.userDetail != null && !authData.userDetail.IsTempPassword)
                {
                    await GetUserClaims(authData.userDetail, false);
                    return Ok(authData);
                }
                return Ok(authData);
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                var authData = await response.Content.ReadAsAsync<UserLogin>();
                return Ok(authData);
            }
            return BadRequest("Server error contact Administrator");
        }

        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> ResetUserLoginPassword([FromBody] UserPassResetModel user)
        {

            HttpClient client = _cMMSAPI.initial();
            var response = await client.PostAsJsonAsync("User/ResetUserLoginPassword", user);

            if (response.IsSuccessStatusCode)
            {
                var responseMsg = await response.Content.ReadAsAsync<List<OutputMessageModel>>();              
                return Ok(responseMsg);
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                var responseMsg = await response.Content.ReadAsAsync<List<OutputMessageModel>>();
                return Ok(responseMsg);
            }
            return BadRequest("Server error contact Administrator");
        }

        [HttpPost, AllowAnonymous]
        public async Task<IActionResult> LogOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(true);
        }

        private async Task GetUserClaims(UserDetail authData, bool rememberMe)
        {
            var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name,authData.Name),
                        new Claim("UserID",authData.UserID.ToString()),
                        new Claim("RoleID",authData.RoleID.ToString()),
                        new Claim("Permission",JsonConvert.SerializeObject(authData.Permissions))
                    };
            SetCookie(rememberMe, claims);

        }

        private void SetCookie(bool rememberMe, List<Claim> claims)
        {
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var props = new AuthenticationProperties();
            props.IsPersistent = rememberMe;
            props.ExpiresUtc = DateTime.Now.AddDays(1);
            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, props).Wait();
        }
    }
}
