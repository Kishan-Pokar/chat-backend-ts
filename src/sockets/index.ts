import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { connection } from "./connections";
import { isJwtPayloadWithUserId } from "../utils/jwt.utils";

export default function initializeSocket(server: HTTPServer): void {
    const io = new SocketIOServer(server, {
        cors: {
            origin: [
                'http://localhost:3000',
                'https://chat-frontend-ts.vercel.app'
            ],
        }
    });

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            console.warn("Connection attempt without token");
            return next(new Error("Authentication required"));
        }

        try {
            const payload = jwt.verify(token, config.jwtSecret);

            if (!isJwtPayloadWithUserId(payload)) {
                return next(new Error("Invalid token payload"));
            }

            socket.data.userId = payload.userId;
            next();
        } catch (err) {
            console.log("Invalid token:", err instanceof Error ? err.message : err);
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket: Socket) => {
        connection(io, socket);
    });

    console.log("Socket.IO server initialized");
}