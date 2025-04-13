import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import User from './models/user.js';
import { IUserDocument } from './types/user.js';
import { IAnnouncementDocument } from './types/announcements.js';
import Announcement from './models/announcement.js';

const app = express();

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

// тест схемы пользователя
app.get('/', async (req: Request, res: Response) => {
    try {
        const newUser: IUserDocument = new User({
            email: 'test@example.com',
            passwordHash: 'plain_passworder',
            name: 'Test User',
            contactPhone: '123456789'
        });
        await newUser.save();
        console.log('User savedу:', newUser);
        console.log('Is password modified?', newUser.isModified('passwordHash'));

        const email = await User.findOne({ email: 'test@example.com'});
        res.send(email);

    } catch(err) {
        console.error("Failed to create user:", err)
    }
})

// тест схемы объявления 
app.get('/a', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ email: 'test@example.com'});
        const newAnn: IAnnouncementDocument = new Announcement({
            shortText: 'dsfsdfsd',
            description: 'sdfsdfsd',
            images: ['dfsdfsd', 'fsdfsd'],
            userId: user._id,
            tags: ['fsdfsd', 'dsfsdfsd'],
            isDeleted: false
        });
        await newAnn.save();
        console.log('User savedу:', newAnn);

        const ann = await Announcement.findOne({ shortText: 'dsfsdfsd'});
        res.send(ann);

    } catch(err) {
        console.error("Failed to create user:", err)
    }
})


const PORT: string = process.env.PORT || '3000';
const URLDB: string = process.env.URLDB || 'mongodb://root:example@mongo:27017/';

startServer(URLDB, PORT);


