import { Server, Socket } from "socket.io";
import { IChatService } from "../services/chatService.js";
import express from 'express';
import { IUserService } from "../services/userService.js";
import { Types } from "mongoose";

function wrapMiddleware(middleware: express.RequestHandler) {
    return (socket: Socket, next: (err?: any) => void) => {
        middleware(socket.request as any, {} as any, next);
    }
}

function configerSocketIO(io: Server, chat: IChatService, user: IUserService, sessionOption: express.RequestHandler) {
    io.use(wrapMiddleware(sessionOption));

    io.on('connection', async (socket) => {
        const req = socket.request as any;
        const userEmail = req.session.passport.user;

        if(!userEmail) {
            console.error(`Пользователь не авторизован`);
            socket.disconnect();
            return
        }

        const currentUserId = await user.findByEmail(userEmail);

        socket.on('getHistory', async (userId: string) => {
            try {
                const currentChat = await chat.find([currentUserId._id as Types.ObjectId, new Types.ObjectId(userId)]);

                if (!currentChat) {
                    socket.emit('chatHistory', null);
                    return;
                }

                socket.join(currentChat._id.toString());

                socket.emit('chatHistory', currentChat.messages);
            } catch(err) {
                console.error('Error join room', err);
            }
        })

        socket.on('sendMessage', async (data) => {
            try {
                const message = await chat.sendMessage({
                    author: currentUserId._id as Types.ObjectId,
                    receiver: new Types.ObjectId(data.receiver),
                    text: data.text
                })

                const currentChat = await chat.find([currentUserId._id as Types.ObjectId, new Types.ObjectId(data.receiver)]);

                io.to(currentChat._id.toString()).emit('newMessage', {
                    chatId: currentChat._id,
                    message
                })
            } catch(err) {
                console.error(`Error sending message to user with id ${data.receiver}`, err);
            }
        })
    })
}

export default configerSocketIO;