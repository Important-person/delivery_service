import { Document, Types } from "mongoose";

export interface IMessage {
    author: Types.ObjectId;
    sendAt: Date;
    text: string;
    readAt?: Date;
}

export interface IMessageDocument extends IMessage, Document {}