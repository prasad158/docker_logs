export interface Response<T> {
    success: boolean,
    data?: T,
    err?: T
}

export interface Message {
    method: string,
    // id: string
    data: {
        containerId: string
    }
}