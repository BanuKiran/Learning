namespace nproducts_net.hub
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);

    }
}
