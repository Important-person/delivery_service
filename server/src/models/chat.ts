import { Schema, model } from "mongoose";
import { IChatDocument} from "../types/chat.js";

const ChatSchema = new Schema<IChatDocument>({
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Schema.Types.Date,
        required: true
    },
    messages: {
        type: [Schema.Types.ObjectId],
        ref: 'Message'
    }
})

const Chat = model<IChatDocument>('Chat', ChatSchema);

export default Chat;