import WebSocket from 'ws';
import { Message } from './src/types';
import { getDockerContainerList, getContainerLogsById1 } from './src/util';

const PORT = 8081;
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log('server started on port ' + PORT);
});

wss.on('connection', function connection(ws: WebSocket) {
    console.log('Client connected');

    ws.on('message', async function (message: Buffer) {
        const data: Message = JSON.parse(message.toString());

        if (data.method === 'get_list') {
            console.log('get_list called');
            let list = await getDockerContainerList();
            if (list.success) {
                ws.send(JSON.stringify({ method: 'get_list', data: list.data }));
            }
        }

        if (data.method === 'get_logs') {
            const id = data.data.containerId;
            console.log('get_logs called =>', id);

            getContainerLogsById1(id, ws);
        }
    });

    ws.on('close', function close() {
        console.log('Client disconnected');
    });
});