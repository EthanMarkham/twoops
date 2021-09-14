import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { v4 as uuidv4 } from "uuid";

export interface SocketListener {
    event: string;
    callable: (socket: Socket, data: any) => void;
}

export interface SocketAPI {
    io: Server | null;
    listeners: Map<string, SocketListener>;
    init: (server: HTTPServer) => void;
    addListener: (listener: SocketListener) => string;
    removeListener: (id: string) => void;
}

const socketAPI: SocketAPI = (module.exports = {
    io: null,
    listeners: new Map<string, SocketListener>(),
    init(server: HTTPServer) {
        socketAPI.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        socketAPI.io.on("connection", (socket: Socket) => {
            console.log("client connected to ws.");
            socketAPI.listeners.forEach((listener) => {
                socket.on(listener.event, (data) =>
                    listener.callable(socket, data)
                );
            });
        });
    },
    addListener(listener: SocketListener) {
        const newID = uuidv4();
        socketAPI.listeners.set(newID, listener);
        return newID;
    },
    removeListener(id: string) {
        socketAPI.listeners.delete(id);
    },
});
