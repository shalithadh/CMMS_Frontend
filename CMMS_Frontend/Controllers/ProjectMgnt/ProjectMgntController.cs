using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing.Drawing2D;
using System.Net.Http.Headers;

namespace CMMS_Frontend.Controllers.ProjectMgnt
{
    public class ProjectMgntController : Controller
    {
        private readonly ILogger<ProjectMgntController> _logger;
        private readonly CMMS_API _cMMSAPI;
        public ProjectMgntController(ILogger<ProjectMgntController> logger, CMMS_API cMMSAPI)
        {
            _logger = logger;
            _cMMSAPI = cMMSAPI;
        }

        [Authorize(Policy = "ViewProjectList")]
        [Route("ProjectMgnt/ProjectList")]
        public IActionResult ProjectList()
        {
            return View();
        }

        [Authorize(Policy = "AddNewProject")]
        [Route("ProjectMgnt/CreateNewProject")]
        public IActionResult CreateNewProject(int? projectID)
        {
            return View();
        }

        [Authorize(Policy = "ViewTasksList")]
        [Route("ProjectMgnt/CreateNewTask")]
        public IActionResult CreateNewTask(int? projectID)
        {
            return View();
        }

        [Authorize(Policy = "ViewTaskApprovalList")]
        [Route("ProjectMgnt/TaskApproval")]
        public IActionResult TaskApproval()
        {
            return View();
        }

        [Authorize(Policy = "ViewTaskApprovalSingleView")]
        [Route("ProjectMgnt/TaskApprovalView")]
        public IActionResult TaskApprovalView(int taskID)
        {
            return View();
        }

        [Authorize(Policy = "EditNewTask")]
        [HttpPost]
        public async Task<IActionResult> UploadFile(string taskID, IList<IFormFile> files)
        {
            List<UploadHandler> uploadHandlerList = new List<UploadHandler>();
            int i = 0;
            string imageTaskID = string.Format(taskID); //to get taskID
            foreach (IFormFile source in files)
            {
                i++;
                string filename = ContentDispositionHeaderValue.Parse(source.ContentDisposition).FileName.Trim('"');

                //filename = this.EnsureCorrectFilename(filename);
                string extension = Path.GetExtension(source.FileName);
                filename = "task_" + imageTaskID + "_" + i.ToString() + "_" + DateTime.Now.ToString("yyyyMMddTHHmmss") + extension;           

                using (FileStream output = System.IO.File.Create(this.GetPathAndFilename(filename)))
                await source.CopyToAsync(output);

                uploadHandlerList.Add(new UploadHandler { FileURL = _cMMSAPI.TaskImgSourceUrl + filename });
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
            var path = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\uploads\taskmgnt", filename);
            return path;
        }
    }
}
