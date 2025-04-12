const express = require('express');
const mongoose = require('mongoose');

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

const PORT: string = process.env.PORT || '3000';
const URLDB: string = process.env.URLDB || 'mongodb://root:example@mongo:27017/';

startServer(URLDB, PORT);


