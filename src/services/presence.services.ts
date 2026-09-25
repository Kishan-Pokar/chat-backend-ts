import redisClient from "../config/redis";

export const setOnline = async (userId: string, socketId: string) => {
    await redisClient.set(`online:${userId}`, socketId);
}

export const setOffline = async (userId: string) => {
    await redisClient.del(`online:${userId}`);
}

export const getSocketId = async (userId: string) => {
    return await redisClient.get(`online:${userId}`);
}

export const getOnlineUserIds = async (): Promise<string[]> => {
    const keys = await redisClient.keys("online:*");
    return keys.map((key) => key.replace("online:", ""));
};