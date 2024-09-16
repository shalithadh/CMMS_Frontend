using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;

namespace CMMS_Frontend.Models.Helpers
{
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public PermissionRequirement(string permission)
        {
            Permission = permission;
        }

        public string Permission { get; }

        public static async Task CallUserPermissionAsync(AuthorizationOptions options)
        {         
            //List<string> permissions = await GetPermissionForCMMSSolution();
            var permissions = GetPermissionList();
            foreach (var permission in permissions)
            {
                var permissionTrim = permission.Trim();
                options.AddPolicy(permissionTrim, policy =>
                policy.Requirements.Add(new PermissionRequirement(permissionTrim)));

            }

        }

        public static string[] GetPermissionList()
        {
            string[] permissions = new string[]
            {

                "ViewDashboardV1",
                "ViewDashboardV2",
                "ViewAdminDashboard",
                "ViewCustomerDashboard",
                "ViewContractorDashboard",
                "ViewVendorDashboard",
                "ViewProjectList",
                "AddNewProject",
                "EditNewProject",
                "ViewTasksList",
                "AddNewTask",
                "EditNewTask",
                "ViewTaskApprovalList",
                "ViewTaskApprovalSingleView",
                "ApprovePendingApprovalTask",
                "RejectPendingApprovalTask",
                "ViewItemInventory",
                "AddItemInventory",
                "EditItemInventory",
                "ViewEStore",
                "ViewOrderManagement",
                "AddOrderManagement",
                "EditOrderManagement",
                "ViewAdvMgnt",
                "AddAdvMgnt",
                "EditAdvMgnt",
                "ViewUserProfile",
                "EditUserProfile",
                "ViewUserChangePassword",
                "EditUserChangePassword",
                "ViewUserManagement",
                "EditUserManagement",
                "ViewUserPermission",
                "AddUserPermission",
                "EditUserPermission",
                "ViewUserRolePermission",
                "EditUserRolePermission",
                "ViewReportProjectOverview",
                "ViewReportProjectProgress",
                "ViewReportContractorReview",
                "ViewReportSales",
                "ViewReportOrderStatus",
                "ViewReportInventory",
                "ViewReportCustomer",
                "ViewReportPopularItem"
            };
            return permissions;
        }

        private static async Task<List<string>> GetPermissionForCMMSSolution()
        {
            //get API URL
            string cMMSAPIUrl = GetCMMSAPIURL();
            var client = new HttpClient();
            client.Timeout = TimeSpan.FromMinutes(2);
            client.BaseAddress = new Uri(cMMSAPIUrl);
            var response = await client.GetAsync("User/GetAllUserPermissions");
            var permissions = await response.Content.ReadFromJsonAsync<List<string>>();
            return permissions;
        }

        private static string GetCMMSAPIURL() {

            string backendAPIURL = "";
            using (StreamReader r = new StreamReader("appsettings.json"))
            {
                var json = r.ReadToEnd();
                dynamic appSettingJSON = JObject.Parse(json);
                backendAPIURL = appSettingJSON.ApplicationSettings.API_Url;
            }
            return backendAPIURL;
        }

    }
}
