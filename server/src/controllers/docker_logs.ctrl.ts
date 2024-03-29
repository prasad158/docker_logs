import { getDockerContainerList, getContainerLogsById } from '../util/util';
import { EventTypes } from '../types/types';

export async function getList(data: any) {
    let list = await getDockerContainerList();
    return list;
}

export async function getContainerLogs(data: any, cb: (type: EventTypes, data: string) => void) {
    const id = data.containerId;
    getContainerLogsById(id, (type: EventTypes, data: any) => {
        cb(type, data ? data.toString() : '');
    });
}