import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let currentSlideName = 'Slide 1';

wss.on('connection', function connection(ws) {
  ws.send(JSON.stringify({ type: 'slideChanged', slideName: currentSlideName }));

  ws.on('message', function message(data) {
    const message = JSON.parse(data);
    if (message.type === 'slideChanged') {
      currentSlideName = message.slideName;
      wss.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'slideChanged', slideName: currentSlideName }));
        }
      });
    }
  });
});

console.log('WebSocket server started on port 8080');