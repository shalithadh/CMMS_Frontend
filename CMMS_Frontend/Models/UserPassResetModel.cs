namespace CMMS_Frontend.Models
{
    public class UserPassResetModel
    {
        public string Username { get; set; }
        public string NewPassword { get; set; }
        public string? CreateIP { get; set; }
    }
}
