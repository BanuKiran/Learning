using Microsoft.EntityFrameworkCore;
using WorldCitiesAPI.Data;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.MSSqlServer;
using WorldCitiesAPI.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using OfficeOpenXml;
using HealthCheckAPI;
using AutoMapper;
using nproducts_net.hub;
using HR.LeaveManagement.Persistence;
using HR.LeaveManagement.Application;
using HR.LeaveManagement.Identity;
using MediatR;
using System.Reflection;
using MassTransit;
using nproducts_net.rmq;
using ProductService.Consumers;
using ShipmentService.Consumers;
using ProductService.Repositories;
using ProductService;
using UserService1.Repositories;
using UserService1.StateMachines;
using SharedLogic.Models;

var builder = WebApplication.CreateBuilder(args);

// Adds Serilog support
builder.Host.UseSerilog((ctx, lc) => lc
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.MSSqlServer(connectionString:
                ctx.Configuration.GetConnectionString("DefaultConnection"),
            restrictedToMinimumLevel: LogEventLevel.Information,
            sinkOptions: new MSSqlServerSinkOptions
            {
                TableName = "LogEvents",
                AutoCreateSqlTable = true
            }
            )
    .WriteTo.Console()
    );

// Add services to the container.
builder.Services.AddControllers()
        .AddJsonOptions(options =>
        {
            // options.JsonSerializerOptions.WriteIndented = true;
            // options.JsonSerializerOptions.PropertyNamingPolicy = null;
        });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add ApplicationDbContext and SQL Server support

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
        )
);


// Add services to the container. 
//builder.Services.ConfigureApplicationServices();
builder.Services.ConfigurePersistenceServices(builder.Configuration);
//builder.Services.ConfigureIdentityServices(builder.Configuration);
builder.Services.ConfigureInfrastructureServices(builder.Configuration);
builder.Services.AddHttpContextAccessor();

builder.Services.AddHealthChecks()
    .AddCheck("ICMP_01",
        new ICMPHealthCheck("www.ryadel.com", 100))
    .AddCheck("ICMP_02",
        new ICMPHealthCheck("www.google.com", 100))
    .AddCheck("ICMP_03",
        new ICMPHealthCheck($"10.0.0.0", 100));


builder.Services.AddSignalR();
builder.Services.AddAutoMapper(typeof(Program));
builder.Services.AddMediatR(typeof(Program));




// Add ASP.NET Core Identity support
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = true;
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 8;
})
    .AddEntityFrameworkStores<ApplicationDbContext>();

ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

// Add Authentication services & middlewares
builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        RequireExpirationTime = true,
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["JwtSettings:Issuer"],
        ValidAudience = builder.Configuration["JwtSettings:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            System.Text.Encoding.UTF8.GetBytes(
                builder.Configuration["JwtSettings:SecurityKey"]))
    };
});

builder.Services.AddScoped<JwtHandler>();

builder.Services.AddTransient<IProductRepository, ProductRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();


builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<EventConsumer>();
    x.AddConsumer<PublishConsumer>();
    x.AddConsumer<BhaktaPublishConsumer>();
    x.AddConsumer<SendConsumer>();
    x.AddConsumer<RequestConsumer>();
    x.AddConsumer<ExceptionConsumer>();
    x.AddConsumer<ExceptionFaultConsumer>();

    x.AddConsumer<ReserveProductConsumer>();
    x.AddConsumer<OrderFailedConsumer>();
    x.AddConsumer<ShipmentConsumer>();

    x.AddSagaStateMachine<OrderStateMachine, OrderStateInstance>()
        .InMemoryRepository();

    // request only
    x.AddRequestClient<RequestResponse>();

    x.AddRequestClient<CheckOrderStatusResponse>();
    x.AddRequestClient<OrderNotFoundResponse>();

    x.UsingRabbitMq((cntxt, config) => {
        config.Host("localhost", "/", c => {
            c.Username("guest");
            c.Password("guest");
        });

        config.ReceiveEndpoint("event-coonsumer", e =>
        {
            e.ConfigureConsumer<EventConsumer>(cntxt);
        });
        // -- saga endpoints
        config.ReceiveEndpoint("product.order.received", e =>
        {
            e.ConfigureConsumer<ReserveProductConsumer>(cntxt);
        });

        config.ReceiveEndpoint("product.order.failed", e =>
        {
            e.ConfigureConsumer<OrderFailedConsumer>(cntxt);
        });


        // -- send example configuration
        config.ReceiveEndpoint("queue:send-example-queue", e =>
        {
            e.ConfigureConsumer<SendConsumer>(cntxt);
        });

        config.ReceiveEndpoint("queue:bhaktasend-example-queue", e =>
        {
            e.ConfigureConsumer<SendConsumer>(cntxt);
        });


        // -- publish example configuration
        config.ReceiveEndpoint("request-example-queue", e =>
        {
            e.ConfigureConsumer<PublishConsumer>(cntxt);
        });

        config.ReceiveEndpoint("bhakta-request-example-queue", e =>
        {
            e.ConfigureConsumer<BhaktaPublishConsumer>(cntxt);
        });


        // -- request response example
        config.ReceiveEndpoint("request-response-example-queue", e =>
        {
            e.ConfigureConsumer<RequestConsumer>(cntxt);
        });


        // -- exception example
        config.ReceiveEndpoint("exception-example-queue", e =>
        {
            e.ConfigureConsumer<ExceptionConsumer>(cntxt);
            //e.ConfigureConsumer<ExceptionFaultConsumer>(context);
        });

        // listen for exception and handle the problem
        config.ReceiveEndpoint("exception-example-queue_error", e =>
        {
            e.ConfigureConsumer<ExceptionFaultConsumer>(cntxt);
        });

        config.ReceiveEndpoint("product.order.shipment", e =>
        {
            e.ConfigureConsumer<ShipmentConsumer>(cntxt);
        });

        // -- saga specific
        config.ReceiveEndpoint("order.saga", e =>
        {
            e.ConfigureSaga<OrderStateInstance>(cntxt);
        });
    });

});

builder.Services.AddHostedService<MyBackgroundService>();

var app = builder.Build();

app.UseSerilogRequestLogging();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseHealthChecks(new PathString("/api/health"),
    new CustomHealthCheckOptions());

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");


app.UseCors(x => x
        .AllowAnyMethod()
        .AllowAnyHeader()
        .SetIsOriginAllowed(origin => true) // allow any origin
        .AllowCredentials()); // allow credentials

app.Run();
