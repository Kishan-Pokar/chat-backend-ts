import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SendMessagePayload } from "../types/message.types";
import { Message } from "../types/message.types";
import { saveMessage, updateMessageStatus, getAllMessages, getUndeliveredMessages, updateMessageStatusToRead } from "../repositories/message.repository";
import { getSocketId } from "./presence.services";
import { AppError } from "../utils/AppError";



export const createMessage = async (
    io: Server,
    socket: Socket,
    payload: SendMessagePayload
): Promise<void> => {
    const { to, content, clientTempId } = payload;
    const from = socket.data.userId as string;

    if (!from || !to || !content) {
        throw new AppError("to and content are required", 400);
    }

    const message: Message = {
        id: uuidv4(),
        from,
        to,
        content,
        timestamp: String(Date.now()),
        status: "PENDING",
    };

    await saveMessage(message);

    const receiverSocketId = await getSocketId(to);

    let finalMessage = message;
    if (receiverSocketId) {
        await updateMessageStatus(message.id, "SENT");
        finalMessage = { ...message, status: "SENT" };
        io.to(receiverSocketId).emit("receive_message", finalMessage);
    }


    socket.emit("message_sent", { clientTempId, message: finalMessage });
};

export const markDelivered = async (io: Server, messageId: string): Promise<void> => {
    const updated = await updateMessageStatus(messageId, 'DELIVERED');

    if (!updated) {
        return;
    }

    const senderSocketId = await getSocketId(updated.sender_id);
    if (senderSocketId) {
        io.to(senderSocketId).emit('message_delivered', { messageId });
    }
};

export const deliverPendingMessage = async (socket: Socket, userId: string): Promise<void> => {
    const pendingMessages = await getUndeliveredMessages(userId)
    if (!pendingMessages) {
        return
    }
    const updatedMessages = pendingMessages.map((msg) => ({ ...msg, status: "SENT" }));
    for (const msg of updatedMessages) {
        await updateMessageStatus(msg.id, 'SENT');
    }
    socket.emit('offline_messages', updatedMessages);
}

export const getChatHistory = async (userId: string, otherUserId: string): Promise<Message[] | null> => {
    const chatHistory = await getAllMessages(userId, otherUserId)
    return chatHistory
}

export const markRead = async (io: Server, socket: Socket, fromUserId: string): Promise<void> => {
    const toUserId = socket.data.userId as string;
    if (!toUserId) {
        throw new AppError("toUser Id is required", 400);
    }

    const updatedMessageIds = await updateMessageStatusToRead(fromUserId, toUserId);

    if (updatedMessageIds.length === 0) {
        return; 
    }

    const senderSocketId = await getSocketId(fromUserId);
    if (senderSocketId) {
        io.to(senderSocketId).emit('messages_read', {
            readBy: toUserId,
            messageIds: updatedMessageIds,
        });
    }
};