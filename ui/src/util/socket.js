class SocketBuilder {
    HOST = 'localhost';
    PORT = 8081;

    constructor() {
        this.socket = new WebSocket(`ws://${this.HOST}:${this.PORT}`);
    }

    onopen(cb) {
        this.socket.onopen = function (event) {
            cb(event);
        }
    }

    onmessage(cb) {
        this.socket.onmessage = function (msg) {
            const data = JSON.parse(msg.data);
            const eventHandler = {
                on: (event, fn) => {
                    if (data.method == event) {
                        fn(data);
                    }
                    return eventHandler;
                }
            };

            cb(eventHandler);
        }
    }


    onerror(cb) {
        this.socket.onerror = function (error) {
            cb(error);
        }
    }

    send(data) {
        this.socket.send(data);
    }

    close() {
        this.socket.close();
    }
}

export default SocketBuilder;