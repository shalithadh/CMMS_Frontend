using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;

namespace CMMS_Frontend.Controllers.ItemInventory
{
    public class ItemInventoryController : Controller
    {
        private readonly ILogger<ItemInventoryController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public ItemInventoryController(ILogger<ItemInventoryController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewItemInventory")]
        public IActionResult ItemInventoryMgnt()
        {
            return View();
        }

        [Authorize(Policy = "AddItemInventory")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(string itemID, IList<IFormFile> files)
        {
            List<UploadHandler> uploadHandlerList = new List<UploadHandler>();
            int i = 0;
            string imageItemID = string.Format(itemID); //to get itemID
            foreach (IFormFile source in files)
            {
                i++;
                string filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                //filename = this.EnsureCorrectFilename(filename);
                string extension = Path.GetExtension(source.FileName);
                filename = "item_" + imageItemID + "_" + i.ToString() + "_" + DateTime.Now.ToString("yyyyMMddTHHmmss") + extension;

                using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                    await source.CopyToAsync(output);

                uploadHandlerList.Add(new UploadHandler { FileURL = _cMMSAPI.ItemImgSourceUrl + filename });
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
            var path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\uploads\invmgnt", filename);
            return path;
        }
    }
}
