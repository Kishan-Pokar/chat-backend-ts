import { createClient } from "redis";
import { config } from './index'

const redisClient = createClient({
    url:config.redisUrl
})

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log('redis connected successfully');
  } catch (error) {
    console.error('redis connection failed:', error);
    process.exit(1);  
  }
};


export default redisClient