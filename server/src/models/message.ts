import { Schema, model } from "mongoose";
import { IMessageDocument } from "../types/message.js";

const MessageSchema = new Schema<IMessageDocument>({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    sendAt: {
        type: Schema.Types.Date,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    readAt: {
        type: Schema.Types.Date
    }
}, { versionKey: false })

const Message = model<IMessageDocument>('Message',MessageSchema);

export default Message;