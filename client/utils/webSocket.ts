import socketIO, { Socket } from 'socket.io-client';
import { v4 as uuid } from 'uuid';

export interface Listener{
    id: string,
    event: string,
    callback: (data: any) => void,
}
export interface SocketAPI{
    socket: Socket,
    listeners: Map<string, Listener>,
    emit: (event: string, message: any) => void,
    addListener: (event: string, callback: (data: any) => void) => string,
    removeListener: (id: string) => void,
}

const socketAPI: SocketAPI = {
    socket: socketIO("/", { autoConnect: true, reconnectionDelayMax: 10000 }),
    listeners: new Map<string, Listener>(),
    emit: function (event: string, message: any): void {
        this.socket.emit(event, message)
    },
    addListener: function (event: string, callback: (data: any) => void): string {
        const listener: Listener = {
            id: uuid(),
            event: event,
            callback: callback
        };
        socketAPI.listeners.set(listener.id, listener);
        this.socket.on(listener.event, (data: any) => listener.callback(data));
        return listener.id;
    },
    removeListener: function (id: string): void {
        const listener = socketAPI.listeners.get(id);
        if (listener !== undefined) {
            this.socket.off(listener.event, listener.callback);
            socketAPI.listeners.delete(id)
        }
    }
}

export default socketAPI;