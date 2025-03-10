import ws from 'k6/ws';
import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';

const messagesReceived = new Counter('messages_received');
const connections = new Counter('connections');
const errors = new Counter('errors');

export let options = {
  vus: 500, // Number of virtual users
  duration: '60s', // Test duration
};

export default function () {
  const url = 'wss://api-dev.transporte.mrptechnology.mx/api-movil/signalr/bus-hub'; // Replace with your SignalR URL
  const params = { tags: { my_tag: 'signalr-test' } };

  const res = ws.connect(url, params, function (socket) {
    socket.on('open', function open() {
      console.log('connected');
      connections.add(1);
      socket.send(JSON.stringify({ protocol: 'json', version: 1 }) + '\x1e'); // SignalR handshake
      socket.send(
        JSON.stringify({
          arguments: [
            {
              iIdRuta: 102,
              iIdRutas: [1, 2, 3, 4, 5],
            },
          ],
          target: 'SyncBusRealTime',
          type: 1,
        }) + '\x1e'
      ); // Subscribe to SyncBusRealTime
    });

    socket.on('message', function (data) {

        const maxLength = 100;
        const message = data.length > maxLength ? data.substring(0, maxLength) + '...' : data;
        console.log('Message received: ', message);
        messagesReceived.add(1);
    });

    socket.on('close', function close() {
      console.log('disconnected');
    });

    socket.on('error', function error(err) {
      console.error('WebSocket error:', err);
      errors.add(1);
    });

    console.log('-------------------------------------------------------');
  });

  check(res, { 'status is 101': (r) => r && r.status === 101 });
  sleep(Math.random() * 2); //simulate different user behaviors.
}