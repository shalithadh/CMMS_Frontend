using CMMS_Frontend.Models.AppSetting;
using Microsoft.Extensions.Options;

namespace CMMS_Frontend.Models.Helpers
{
    public class CMMS_API
    {
        private readonly ApplicationSettings _appSettings;
        public CMMS_API(IOptions<ApplicationSettings> appSettings)
        {
            _appSettings = appSettings.Value;
        }
        public HttpClient initial()
        {
            var client = new HttpClient();
            client.BaseAddress = new Uri(_appSettings.API_Url);
            return client;

        }

        public string ApiUrl
        {
            get
            {
                return _appSettings.API_Url;
            }
        }
        public string WebUrl
        {
            get
            {
                return _appSettings.WEB_Url;
            }
        }

        public string TaskImgSourceUrl
        {
            get
            {
                return _appSettings.TASK_Img_Source_Url;
            }
        }

        public string ItemImgSourceUrl
        {
            get
            {
                return _appSettings.ITEM_Img_Source_Url;
            }
        }

        public string AdvImgSourceUrl
        {
            get
            {
                return _appSettings.ADV_Img_Source_Url;
            }
        }

        public string UserImgSourceUrl
        {
            get
            {
                return _appSettings.USER_Img_Source_Url;
            }
        }
    }
}
