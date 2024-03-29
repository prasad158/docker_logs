import dotenv from 'dotenv';
import App from './src/app';
import { getList, getContainerLogs } from './src/controllers/docker_logs.ctrl';
import { EventTypes } from './src/types/types';

dotenv.config();

const app = App.startServer(Number(process.env.PORT), () => {
    console.log('server started on port ' + process.env.PORT);
});

app.on('get_list', async (data: any) => {
    const list = await getList(data);
    app.send('get_list', list.data);
});

app.on('get_logs', async (data: any) => {
    getContainerLogs(data, function (type: EventTypes, res: string) {
        app.send('get_logs', res);
    });
});