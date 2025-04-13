import { Document, Types } from "mongoose"

export interface IAnnouncement {
    shortText: string;
    description?: string;
    images?: string[];
    userId?: Types.ObjectId;
    tags?: string[];
    isDeleted: boolean
}

export interface IAnnouncementDocument extends IAnnouncement, Document {}
