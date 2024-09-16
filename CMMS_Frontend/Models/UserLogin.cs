using CMMS_Frontend.Models.Helpers;

namespace CMMS_Frontend.Models
{
    public class UserLogin
    {
        public UserDetail userDetail { get; set; }
        public OutputMessageModel outputMessage { get; set; }
    }
}
