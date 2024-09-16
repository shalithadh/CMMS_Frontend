using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace CMMS_Frontend.Controllers.UserProf
{
    public class UserProfMgntController : Controller
    {

        private readonly ILogger<UserProfMgntController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public UserProfMgntController(ILogger<UserProfMgntController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewUserProfile")]
        public IActionResult UserProfile()
        {
            return View();
        }

        [Authorize(Policy = "ViewUserChangePassword")]
        public IActionResult UserChangePassword()
        {
            return View();
        }

        [Authorize(Policy = "EditUserProfile")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(string userID, IList<IFormFile> files)
        {
            List<UploadHandler> uploadHandlerList = new List<UploadHandler>();
            int i = 0;
            string imageUserID = string.Format(userID); //to get userID
            foreach (IFormFile source in files)
            {
                i++;
                string filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                //filename = this.EnsureCorrectFilename(filename);
                string extension = Path.GetExtension(source.FileName);
                filename = "user_" + imageUserID + "_" + i.ToString() + "_" + DateTime.Now.ToString("yyyyMMddTHHmmss") + extension;

                using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                    await source.CopyToAsync(output);

                uploadHandlerList.Add(new UploadHandler { FileURL = _cMMSAPI.UserImgSourceUrl + filename });
            }

            return Ok(uploadHandlerList);
        }

        private string EnsureCorrectFilename(string filename)
        {
            if (filename.Contains("\\"))
                filename = filename.Substring(filename.LastIndexOf("\\") + 1);

            return filename;
        }

        private string GetPathAndFilename(string filename)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\uploads\usermgnt", filename);
            return path;
        }

    }
}
