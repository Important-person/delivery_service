import "reflect-metadata";
import { injectable } from "inversify";
import { IChatDocument, SubscribeChat, SubscribeChatData, UnSubscribeChat } from "../types/chat.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { IMessage, IMessageDocument, ISendMessage } from "../types/message.js";
import { Types } from "mongoose";
import { EventEmitter } from "events";

export interface IChatService { 
    find(users: Types.ObjectId[]): Promise<IChatDocument | null>;
    sendMessage(data: ISendMessage): Promise<IMessageDocument>;
    subscribe(callBack: SubscribeChat): UnSubscribeChat;
    getHistory(id: string): Promise<IMessage[] | null>
}

@injectable()
export class ChatService implements IChatService {
    private emmiter: EventEmitter;

    constructor() {
        this.emmiter = new EventEmitter;
        this.emmiter.setMaxListeners(25);
        console.log('Chat initilaised');
    }

    async find(users: Types.ObjectId[]): Promise<IChatDocument | null> {
        try {
            const chat = await Chat.findOne({ users: { $all: users } });

            if(!chat) {
                console.log(`Chat with users ${users} not found`);
                return null;
            }

            await chat.populate('messages');

            return chat
        } catch(err) {
            console.error(`Error ChatService.find `, err);
            throw new Error(`Error in getting a chat with users ${users}`);
        }
    }

    async sendMessage(data: ISendMessage): Promise<IMessageDocument> {
        try {
            const newMessage = new Message({
                author: data.author,
                text: data.text,
                sendAt: Date.now()
            })

            await newMessage.save();
            console.log(`Message ${newMessage._id} created`);

            let chat: IChatDocument | null = null;

            chat = await Chat.findOne({ users: { $all: [data.author, data.receiver] } });

            if(!chat) {
                console.log(`Chat with users ${[data.author, data.receiver]} not found`);

                chat = new Chat({
                    users: [data.author, data.receiver],
                    createdAt: Date.now(),
                    messages: [newMessage._id]
                })

                await chat.save();
                console.log(`New chat with id ${chat._id} created`);
            } else {
                const updatedChat = await Chat.findOneAndUpdate(
                    chat._id,
                    { $push: { messages: newMessage._id } },
                    { new: true }
                )

                chat = updatedChat;
                console.log(`Chat ${chat._id} updated`);
            }

            if (!chat) {
                throw new Error(`Can not find or create chat with users ${[data.author, data.receiver]}`);
            }

            const eventData: SubscribeChatData = {
                chatId: chat._id as Types.ObjectId,
                message: newMessage
            }

            this.emmiter.emit("NewMessage", eventData);
            console.log(`Created event with name - New message with message id ${newMessage._id}`);

            console.log('Session committed');

            return newMessage
        } catch(err) {
            console.error(`Error ChatService.sendMessage `, err);
            throw new Error(`Error send message in chat with users ${[data.author, data.receiver]}`);
        }
    }

    subscribe(callBack: SubscribeChat): UnSubscribeChat {
        this.emmiter.on("NewMessage", callBack);
        const unSubscribe: UnSubscribeChat = () => {
            this.emmiter.off("NewMessage", callBack);
            console.log(`Listener is delited on event with name NewMessage`);
        }
        return unSubscribe;
    }

    async getHistory(id: string): Promise<IMessage[] | null> {
        try {
            const chat = (await Chat.findById(id)).populated('messages');

            if(!chat) {
                console.log(`Chat with id ${id} not found`);
                return null;
            }

            return chat.messages
        } catch(err) {
            console.error(`Error ChatService.getHistory `, err);
            throw new Error(`Error in getting a chat with users ${id}`);
        }
    }
}