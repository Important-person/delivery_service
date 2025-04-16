import "reflect-metadata";
import { injectable } from "inversify";
import { IChatDocument, SubscribeChat, SubscribeChatData, UnSubscribeChat } from "../types/chat.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";
import { IMessage, IMessageDocument, ISendMessage } from "../types/message.js";
import { Types } from "mongoose";
import { EventEmitter } from "events";

export interface IChatService { 
    find(users: [Types.ObjectId]): Promise<IChatDocument | null>;
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

    async find(users: [Types.ObjectId]): Promise<IChatDocument | null> {
        try {
            const chat = await Chat.findOne({ users: { $all: users } });

            if(!chat) {
                console.log(`Chat with users ${users} not found`);
                return null;
            }

            return chat
        } catch(err) {
            console.error(`Error ChatService.find `, err);
            throw new Error(`Error in getting a chat with users ${users}`);
        }
    }

    async sendMessage(data: ISendMessage): Promise<IMessageDocument> {
        const session = await Message.startSession();
        session.startTransaction();

        try {
            const newMessage = new Message({
                author: data.author,
                text: data.text,
                sendAt: Date.now()
            })

            await newMessage.save({ session });
            console.log(`Message ${newMessage._id} created`);

            const newChatMessage = await Chat.findOneAndUpdate(
                { users: { $all: [data.author, data.receiver] } },
                { $push: { messages: newMessage._id},
                  $setOnInsert: {
                    users: [data.author, data.receiver],
                    createdAt: Date.now()
                  }
                },
                { new : true, upsert: true, session}
            )

            if(!newChatMessage) {
                throw new Error(`Chat with users ${[data.author, data.receiver]} not found and not create`);
            }
            console.log(`Chat ${newChatMessage._id} updated with message ${newMessage._id}`);

            const eventData: SubscribeChatData = {
                chatId: newChatMessage._id as Types.ObjectId,
                message: newMessage
            }

            this.emmiter.emit("NewMessage", eventData);
            console.log(`Created event with name - New message with message id ${newMessage._id}`);

            await session.commitTransaction();
            console.log('Session committed');

            return newMessage
        } catch(err) {
            await session.abortTransaction();
            console.error(`Error ChatService.sendMessage `, err);
            throw new Error(`Error send message in chat with users ${[data.author, data.receiver]}`);
        } finally {
            await session.endSession()
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