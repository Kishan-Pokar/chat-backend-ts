import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { SendMessagePayload } from "../types/message.types";
import { Message } from "../types/message.types";
import { saveMessage, updateMessageStatus,getAllMessages,getUndeliveredMessages } from "../repositories/message.repository";
import { getSocketId } from "./presence.services";
import { AppError } from "../utils/AppError";



export const createMessage= async(
    io: Server,
    socket: Socket,
    payload: SendMessagePayload
): Promise<void> => {
    const { to, content } = payload;
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

    if (!receiverSocketId) {
        return; 
    }

    await updateMessageStatus(message.id, "SENT");
    io.to(receiverSocketId).emit("receive_message", { ...message, status: "SENT" });
}

export const markDelivered = async (messageId:string) : Promise<void> => {
    await updateMessageStatus(messageId,'DELIVERED')
}

export const deliverPendingMessage = async (socket:Socket,userId:string) : Promise<void> => {
    const pendingMessages = await getUndeliveredMessages(userId)
    if(!pendingMessages){
        return
    }
    for(const msg of pendingMessages){
        await updateMessageStatus(msg.id, 'SENT');
    }
    socket.emit('offline_messages', pendingMessages);
}

export const getChatHistory = async (userId:string,otherUserId:string) : Promise<Message[] | null> => {
    const chatHistory = await getAllMessages(userId,otherUserId)
    return chatHistory
}