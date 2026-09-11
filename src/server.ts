import app from './app';
import {config} from './config/index'
import {connectDB} from './config/db'
import { connectRedis } from './config/redis';

const start = async (): Promise<void> => {
  await connectDB();
  await connectRedis()
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

start();

