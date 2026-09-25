import app from './app';
import { config } from './config/index'
import { connectDB } from './config/db'
import { connectRedis } from './config/redis';
import http from "http";
import "dotenv/config";
import initSockets from "./sockets/index";

const start = async (): Promise<void> => {
    await connectDB();
    await connectRedis()
    const server = http.createServer(app);
    initSockets(server);
    server.listen(config.port, () => {
        console.log(`Server running on port ${config.port}`);
    });
};




start().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});