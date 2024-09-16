namespace CMMS_Frontend.Models
{
    public class UserDetail
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string? Name { get; set; }
        public int RoleID { get; set; }
        public string? RoleName { get; set; }
        public int AttemptCount { get; set; }
        public bool IsTempPassword { get; set; }
        public string Password { get; set; }
        public string? Token { get; set; }
        public string[]? Permissions { get; set; }

        //Common Parameters
        public decimal? DeliveryCharge { get; set; }

    }
}
