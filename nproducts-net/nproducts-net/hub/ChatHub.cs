using Microsoft.AspNetCore.SignalR;

namespace nproducts_net.hub
{
     public class ChatHub : Hub<IChatClient>
     {
        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
    
}
