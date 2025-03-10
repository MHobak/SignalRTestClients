using Microsoft.AspNetCore.SignalR.Client;

class Program
{
    static async Task Main(string[] args)
    {        
        ThreadPool.SetMinThreads(100, 100);
        ThreadPool.SetMaxThreads(3000, 3000);
        int numberOfClients = 3000; // Simulate 3 clients
        List<Task> clientTasks = new List<Task>();

        for (int i = 0; i < numberOfClients; i++)
        {
            int clientId = i; // Create a local copy of i
            clientTasks.Add(Task.Run(() => StartClient(clientId)));
        }

        await Task.WhenAll(clientTasks);
    }

    static async Task StartClient(int clientId)
    {
        var connection = new HubConnectionBuilder()
            .WithUrl("https://api-dev.transporte.mrptechnology.mx/api-movil/signalr/bus-hub")
            .Build();

        connection.On<List<object>>("SendBusRealTime", (message) =>
        {
            Console.WriteLine($"[{DateTime.Now}] Client {clientId} received message: {message.Count} camiones");
        });

        await connection.StartAsync();
        Console.WriteLine($"Client {clientId} connected");

        // Call the SyncBusRealTime method on the server
        await connection.InvokeAsync("SyncBusRealTime", new
        {
            iIdRuta = 102,
            iIdRutas = new List<int> { 1, 2, 3, 4, 5 }
        });

        // Keep the connection alive
        await Task.Delay(-1);
    }
}
