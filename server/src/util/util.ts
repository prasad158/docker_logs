import util from 'util';
import { Response, EventTypes } from '../types/types';

const exec = util.promisify(require('child_process').exec);
const spawn = require('child_process').spawn;

export async function getDockerContainerList(): Promise<Response<string>> {
    let { stdout, stderr } = await exec("docker ps -q | xargs docker inspect --format '{\"id\":\"{{.Id}}\", \"name\":\"{{.Name}}\"}'");
    if (stderr) {
        console.log("error => ", stderr);
        return { success: false, err: stderr };
    }

    stdout = stdout.split("\n");
    stdout.pop();
    return { success: true, data: '[' + stdout + ']' };
}

export async function getContainerLogsByIdAndTime(id: string): Promise<Response<string>> {
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

export function getContainerLogsById(id: string, cb: (type: EventTypes, data: any) => any): void {
    const command = 'docker';
    const args = ['logs', '-f', '--since', '$(date +%s)', id];
    let child;

    function spawnComandThread() {
        return spawn(command, args, { shell: true });
    }

    function startCommandThread() {
        child = spawnComandThread();
        child.stdout.on('data', (data: any) => {
            cb('data', data);
        });

        child.stderr.on('data', (err: any) => {
            cb('error', err);
        });

        child.on('close', (code: number) => {
            console.log(`exited with code ${code}`);
            cb('close', `exited with code ${code}`);
        });
    }

    startCommandThread();
}

export function buildDockerImage() {

}