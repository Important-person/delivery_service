import { Document, Types } from "mongoose";
import { IMessageDocument } from './message.js'

export interface IChat {
    users: Types.ObjectId[];
    createdAt: Date;
    messages?: IMessageDocument[]
}

export interface IChatDocument extends IChat, Document {}