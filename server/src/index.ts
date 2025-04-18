import './config/passport.config.js';
import dotenv from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from "url";
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import session from 'express-session';
import passport from 'passport';
import announcementRouter from './routes/announcementRouter.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import container from './config/container.config.js';
import { IChatService } from './services/chatService.js';
import TYPES from './types/types.js';
import configerSocketIO from './config/socketio.config.js';
import { IUserService } from './services/userService.js';
import cors from 'cors';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET || 'Bus on road',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
});
app.use(express.json());
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

const chatServiceInstance = container.get<IChatService>(TYPES.ChatService);
const userServiceInstance = container.get<IUserService>(TYPES.UserService);

configerSocketIO(io, chatServiceInstance, userServiceInstance, sessionMiddleware);

app.use('/api', userRouter);
app.use('/api', announcementRouter);

async function startServer(URLDB: string, PORT: string): Promise<void> {
    try {
        await mongoose.connect(URLDB);

        httpServer.listen(PORT, () => {
            console.log(`Сервер запущен на ${PORT} порту`);
        })
    } catch (err) {
        console.error('Ошибка при запуске сервера:', err);
    }
}

const PORT: string = process.env.PORT || '3000';
const URLDB: string = process.env.MONGO_URL || 'mongodb://root:example@mongo:27017/mydatabase?authSource=admin';

startServer(URLDB, PORT);


