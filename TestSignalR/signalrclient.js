const signalR = require("@microsoft/signalr");

async function connectToSignalR() {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://api-dev.transporte.mrptechnology.mx/api-movil/signalr/bus-hub") // Replace with your SignalR hub URL
    .configureLogging(signalR.LogLevel.Debug)
    .build();

  // Listen for "sendbusrealtime" event
  connection.on("SendBusRealTime", (data) => {
    const timestamp = new Date().toISOString(); // e.g. "2025-03-05T21:16:12.345Z"
    console.log(`[${timestamp}] Received data:`, JSON.stringify(data, null, 2));  
  }); //Buses list

    // Also listen for "MethodTwo"
  connection.on("ReceiveMessage", (anotherData) => {
    console.log("Received Message:", anotherData);
  });

  try {
    await connection.start();
    console.log("SignalR connection established.");

    // Example: Filter parameters
    const filter = {
      iIdRutas: [2,5]
     
    };

    await connection.invoke("SyncBusRealTime", filter); 

  } catch (err) {
    console.error("Error connecting to SignalR:", err);
  }
}

connectToSignalR();