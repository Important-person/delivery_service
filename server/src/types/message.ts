import { Document, Types } from "mongoose";

export interface IMessage {
    author: Types.ObjectId;
    sendAt: Date;
    text: string;
    readAt?: Date;
}

export interface IMessageDocument extends IMessage, Document {}

export interface ISendMessage {
    author: Types.ObjectId;
    receiver: Types.ObjectId;
    text: string
}