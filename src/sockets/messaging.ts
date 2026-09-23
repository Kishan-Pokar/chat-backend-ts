import { markDelivered,createMessage,markRead,deliverPendingMessage } from "../services/message.services";
import { Socket,Server } from "socket.io";
import { SendMessagePayload } from "../types/message.types";
import { AppError } from "../utils/AppError";

export const messageHandler = (io:Server,socket:Socket,userId:string) => {
    console.log(`message handler is running for userId : ${userId}`);

    socket.on('send_message', async (payload: SendMessagePayload) => {
        try {
            await createMessage(io, socket, payload);
        } catch (err) {
            socket.emit('error', {
                message: err instanceof AppError ? err.message : 'Something went wrong',
            });
        }
    });

    socket.on('message_ack', async ({ messageId }) => {
        try {
            await markDelivered(io, messageId);
        } catch (err) {
            socket.emit('error', { message: 'Something went wrong' });
        }
    });

    socket.on('fetch_offline_messages', async () => {
        try {
            await deliverPendingMessage(socket, userId);
        }catch(err) {
            socket.emit('error', {
                message: err instanceof AppError ? err.message : 'Something went wrong',
            });
        }
    });

    socket.on('chat-opened', async ({ fromUserId }) => {
        try {
            await markRead(io, socket, fromUserId);
        } catch (err) {
            socket.emit('error', { message: 'Something went wrong' });
        }
    });
}