import WebSocket from 'ws';

import { Message, EventFunction } from './types/types';

export default class App {
    private server;
    private webSocket: WebSocket | undefined;
    private eventList: Record<string, EventFunction>;

    private constructor(port: number, cb: () => any) {
        this.eventList = {};
        this.server = new WebSocket.Server({ port }, cb);

        this.server.on('connection', (ws: WebSocket) => {
            this.webSocket = ws;
            ws.on('message', async (message: Buffer) => {
                const data: Message = JSON.parse(message.toString());

                if (this.eventList[data.method]) {
                    this.eventList[data.method](data.data);
                }
            });

            ws.once('close', () => {
                console.log('connection close!!!');
            });
        });
    }

    static startServer(port: number, cb: () => any) {
        return new App(port, cb);
    }

    on(eventName: string, cb: EventFunction) {
        this.eventList[eventName] = cb;
        console.log('Client disconnected');
    }

    send(eventName: string, data: any) {
        if (this.webSocket) {
            this.webSocket.send(JSON.stringify({ method: eventName, data }));
        }
    }
}
