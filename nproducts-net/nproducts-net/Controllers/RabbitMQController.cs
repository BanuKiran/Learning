using MassTransit;
using MessageContracts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using nproducts_net.rmq;

namespace HealthCheckAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class RabbitMQController : ControllerBase
    {
		private readonly IPublishEndpoint _publishEndpoint;
		private readonly IBus _bus;


		public RabbitMQController(
			IPublishEndpoint publishEndpoint, IBus bus
			)
        {
			_publishEndpoint = publishEndpoint;
			_bus = bus;

		}

		[HttpPost]
		public async Task<IActionResult> Invoice(InvoiceToCreate iInvoiceToCreate)
		{


			await _publishEndpoint.Publish<InvoiceToCreate>(iInvoiceToCreate);

			
			return Ok();

			

		}
	
    }
}