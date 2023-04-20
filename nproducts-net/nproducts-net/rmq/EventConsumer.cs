using MassTransit;
using MessageContracts;

namespace nproducts_net.rmq
{
	public class EventConsumer : IConsumer<InvoiceToCreate>
	{
		public async Task Consume(ConsumeContext<InvoiceToCreate> context)
		{
				

			Console.WriteLine($"for customer: {context.Message.CustomerNumber}");

			
		}
	}
}
