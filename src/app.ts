import express,{Application} from 'express'
import healthRoutes from './routes/health.routes'
import {errorHandler} from './middlewares/errorHandler'


const app:Application = express();
app.use(express.json());

app.use('/health',healthRoutes);

app.use(errorHandler);

export default app;