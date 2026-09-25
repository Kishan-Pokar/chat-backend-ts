import express, { Application } from 'express'
import healthRoutes from './routes/health.routes'
import cors from 'cors'
import userRoutes from './routes/user.routes'
import messageRoutes from './routes/message.routes';
import { errorHandler } from './middlewares/errorHandler'


const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://chat-frontend-ts.vercel.app'
    ],
    credentials: true
}));

app.use('/health', healthRoutes);
app.use('/users', userRoutes);
app.use('/messages', messageRoutes);

app.use(errorHandler);

export default app;