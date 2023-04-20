using MassTransit;
using ProductService.Repositories;
using SharedLogic;
using SharedLogic.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ProductService.Consumers
{
    public class BhaktaPublishConsumer : IConsumer<BhaktaPubishRequest>
    {
        private readonly IProductRepository _productRepository;
        private readonly ILogger<BhaktaPublishConsumer> _logger;

        public BhaktaPublishConsumer(IProductRepository productRepository, ILogger<BhaktaPublishConsumer> logger)
        {
            _productRepository = productRepository;
            _logger = logger;
        }

        public async Task Consume(ConsumeContext<BhaktaPubishRequest> context)
        {
            var data = context.Message;

            _logger.LogInformation($"PublishConsumer Received: {data.BhaktaMessage}");

            // TODO: do something with the data


            // send request further
            var endpoint = await context.GetSendEndpoint(new Uri("rabbitmq://localhost/queue:bhakta-send-example-queue"));

            await endpoint.Send(new SendRequest
            {
                SendMessage = "I was sent inside the Publish Consumer",
            });
        }
    }
}
