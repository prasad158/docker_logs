import React, { useState, useEffect } from 'react';

const ListDockerContainers = () => {
    const [containerList, setContainerList] = useState([]);
    const [ws, setWs] = useState(null);
    const [logs, setLogs] = useState('');

    const scrollToBottom = () => {
        setTimeout(function () {
            window.scrollTo({
                top: document.documentElement.scrollHeight + 100,
            });
        }, 100);
    };

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8081');

        socket.onopen = function (event) {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({ method: 'get_list' }));
        };

        socket.onmessage = (event) => {
            console.log('Got message from WebSocket server', event);
            const data = JSON.parse(event.data);
            if (data.method === 'get_list') {
                setContainerList(JSON.parse(data.data));
            }

            if (data.method === 'get_logs') {
                console.log('Got logs from WebSocket server =>', data);
                if (data.data) {
                    setLogs((prev_val) => prev_val + '\n' + data.data);
                    scrollToBottom();
                }
                if (data.err) {
                    setLogs((prev_val) => prev_val + '\n' + data.err);
                    scrollToBottom();
                }
            }
        };

        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
        };

        setWs(socket);

        return () => {
            socket.close();
        }
    }, []);

    const getLogs = (containerId) => {
        console.log('called getLog', containerId);
        ws.send(JSON.stringify({ method: 'get_logs', data: { containerId } }));
    }

    return (
        <div className='col-md-12'>
            <div className='col-md-4'>
                <table className='table table-bordered'>
                    <thead>
                        <tr>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {containerList.map((container) => (
                            <tr key={container.id}>
                                <td><a onClick={() => { getLogs(container.id) }}>{container.name}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table >
            </div>
            <div className='col-md-8' contentEditable>
                {logs}
            </div>
        </div>
    );

}

export default ListDockerContainers;