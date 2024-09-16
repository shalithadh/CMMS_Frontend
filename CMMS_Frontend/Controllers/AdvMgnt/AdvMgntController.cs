using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace CMMS_Frontend.Controllers.AdvMgnt
{
    public class AdvMgntController : Controller
    {
        private readonly ILogger<AdvMgntController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public AdvMgntController(ILogger<AdvMgntController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewAdvMgnt")]
        public IActionResult AdvManagement()
        {
            return View();
        }

        [Authorize(Policy = "AddAdvMgnt")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(string advID, IList<IFormFile> files)
        {
            List<UploadHandler> uploadHandlerList = new List<UploadHandler>();
            int i = 0;
            string imageAdvID = string.Format(advID); //to get advID
            foreach (IFormFile source in files)
            {
                i++;
                string filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                //filename = this.EnsureCorrectFilename(filename);
                string extension = Path.GetExtension(source.FileName);
                filename = "adv_" + imageAdvID + "_" + i.ToString() + "_" + DateTime.Now.ToString("yyyyMMddTHHmmss") + extension;

                using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                    await source.CopyToAsync(output);

                uploadHandlerList.Add(new UploadHandler { FileURL = _cMMSAPI.AdvImgSourceUrl + filename });
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
            var path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\uploads\advmgnt", filename);
            return path;
        }
    }
}
