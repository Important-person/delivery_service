import './config/passport.config.js'
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
import session from 'express-session';
import passport from 'passport';

const app = express();
app.use(express.json());
app.use(session({
    secret: 'Bus on road',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api', userRouter);

async function startServer(URLDB: string, PORT: string): Promise<void> {
    try {
        await mongoose.connect(URLDB);

        app.listen(PORT, () => {
            console.log(`Сервер запущен на ${PORT} порту`);
        })
    } catch (err) {
        console.error('Ошибка при запуске сервера:', err);
    }
}

const PORT: string = process.env.PORT || '3000';
const URLDB: string = process.env.URLDB || 'mongodb://root:example@mongo:27017/';

startServer(URLDB, PORT);


