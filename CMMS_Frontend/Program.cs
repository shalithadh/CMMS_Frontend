using CMMS_Frontend.Models.AppSetting;
using CMMS_Frontend.Models.Helpers;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
ConfigurationManager configuration = builder.Configuration; // allows both to access and to set up the config
IWebHostEnvironment environment = builder.Environment;
builder.Services.AddDistributedMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
   .AddCookie(options =>
   {
       options.LoginPath = new PathString("/UserAccount/Login");
       options.AccessDeniedPath = new PathString("/UserAccount/UnAuthorizedPage");
       options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
       options.ExpireTimeSpan = TimeSpan.FromDays(1);
   });
builder.Services.AddAuthorization(options =>
{
    _ = PermissionRequirement.CallUserPermissionAsync(options);
});
builder.Services.AddSingleton<IAuthorizationHandler, PermissionHandler>();
builder.Services.AddSingleton<CMMS_API>();
builder.Services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

builder.Services.Configure<ApplicationSettings>(configuration.GetSection("ApplicationSettings"));
builder.Services.AddMvc(options =>
{
    options.EnableEndpointRouting = false;
    var policy = new AuthorizationPolicyBuilder()
           .RequireAuthenticatedUser()
           .Build();
    options.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();
// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/UserAccount/ErrorPage");
    app.UseHsts();   
}
else
{
    app.UseDeveloperExceptionPage();
}
app.UseStaticFiles();
app.UseStatusCodePagesWithReExecute("/UserAccount/NotFoundPage");
app.UseCookiePolicy();
app.UseAuthentication();
app.UseMvcWithDefaultRoute();

app.Run();