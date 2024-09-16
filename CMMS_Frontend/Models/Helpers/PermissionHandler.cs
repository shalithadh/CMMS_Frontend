using Microsoft.AspNetCore.Authorization;

namespace CMMS_Frontend.Models.Helpers
{
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
        {
            if (context.User.Claims.Count() == 0)
            {
                return Task.CompletedTask;
            }
            else
            {
                bool hasPermission = CheckPermissionForUser(context, requirement.Permission);
                if (hasPermission)
                {
                    context.Succeed(requirement);
                }
            }
            return Task.CompletedTask;
        }

        private bool CheckPermissionForUser(AuthorizationHandlerContext context, string permission)
        {
            string userPermissions = context.User.Claims.First(c => c.Type == "Permission").Value;
            return userPermissions.Contains(permission);
        }

    }
}
