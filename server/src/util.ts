import WebSocket from 'ws';
import util from 'util';
import { Response } from './types';

const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

export async function getDockerContainerList(): Promise<Response<string>> {
    let { stdout, stderr } = await exec("docker ps -q | xargs docker inspect --format '{\"id\":\"{{.Id}}\", \"name\":\"{{.Name}}\"}'");
    if (stderr) {
        console.log("error => ", stderr);
        return { success: false, err: stderr };
    }

    console.log("stdout => ", stdout);
    stdout = stdout.split("\n");
    stdout.pop();
    return { success: true, data: '[' + stdout + ']' };
}

export async function getContainerLogsById(id: string): Promise<Response<string>> {
    try {
        const { stdout: res, stderr: err } = await exec(`docker logs --since $(date +%s) ${id}`);
        if (err) {
            return {
                success: false,
                err: err ?? ''
            };
        }

        if (res) {
            return { success: true, data: res ?? '' };
        }

        return { success: true, data: res ?? '' };
    } catch (err) {
        return {
            success: false,
            err: err?.toString()
        };
    }
}

export function getContainerLogsById1(id: string, ws: WebSocket): void {
    const command = 'docker';
    const args = ['logs', '-f', '--since', '$(date +%s)', id];

    const child = spawn(command, args, { shell: true });
    child.stdout.on('data', (data: any) => {
        ws.send(JSON.stringify({
            method: 'get_logs', data: data.toString() ?? ''
        }));
    });

    child.stderr.on('data', (err: any) => {
        ws.send(JSON.stringify({
            method: 'get_logs', data: err.toString() ?? ''
        }));
    });

    child.on('close', (code: number) => {
        console.log(`child process exited with code ${code}`);
        ws.send(JSON.stringify({
            method: 'get_logs_error', data: 'exited with code ${code}'
        }));
    });
}