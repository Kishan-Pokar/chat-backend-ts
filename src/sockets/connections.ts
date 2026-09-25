import { Socket, Server } from "socket.io";
import { setOffline, setOnline, getOnlineUserIds } from "../services/presence.services";
import { messageHandler } from "./messaging";

export const connection = async (io: Server, socket: Socket): Promise<void> => {
    const userId = socket.data.userId;

    if (!userId) {
        console.warn("Unauthenticated socket attempted connection — disconnecting");
        socket.disconnect();
        return;
    }

    try {
        messageHandler(io, socket, userId);
        await setOnline(userId, socket.id);
        console.log(`User ${userId} connected`);

        socket.broadcast.emit('user_online', { userId });

        const onlineUserIds = await getOnlineUserIds();
        socket.emit('online_users', onlineUserIds);

    } catch (err) {
        console.error(`Error during connection setup for user ${userId}:`, err);
        socket.disconnect();
        return;
    }

    socket.on('disconnect', async () => {
        try {
            await setOffline(userId);
            console.log(`User ${userId} disconnected`);
            socket.broadcast.emit('user_offline', { userId });
        } catch (err) {
            console.error(`Error during disconnect cleanup for user ${userId}:`, err);
        }
    });
}