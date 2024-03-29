import App from '../app'

export interface Response<T> {
    success: boolean,
    data?: T,
    err?: T
}

export interface Message {
    method: string,
    // id: string
    data: any
}

export type EventFunction = (data: any) => any;
export type EventTypes = "data" | "error" | "close";