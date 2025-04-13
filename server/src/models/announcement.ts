import { Schema, model } from "mongoose";
import { IAnnouncementDocument } from "../types/announcements.js";

const AnnouncementSchema = new Schema<IAnnouncementDocument>({
    shortText: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    images: {
        type: [String],
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    tags: {
        type: [String],
    },
    isDeleted: {
        type: Boolean,
        required: true
    }
}, { timestamps: true, versionKey: false })

const Announcement = model<IAnnouncementDocument>('Announcement', AnnouncementSchema);

export default Announcement;