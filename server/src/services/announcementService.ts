import "reflect-metadata";
import { IAnnouncement, IAnnouncementDocument } from "../types/announcements.js";
import Announcement from "../models/announcement.js";
import { injectable, inject } from "inversify";

export interface IAnnouncementService {
    find(params: Omit<IAnnouncement, 'images' | 'isDeleted'>): Promise<IAnnouncementDocument[] | null>;
    create(data: IAnnouncement): Promise<IAnnouncementDocument | null>;
    remove(id: string): Promise<IAnnouncementDocument | null>
}

@injectable()
export class AnnouncementService implements IAnnouncementService {
    async find(params: Omit<IAnnouncement, "images" | "isDeleted">): Promise<IAnnouncementDocument[] | null> {
        try {
            const announcement = await Announcement.find({
                ...(params.shortText && { shortText: { $regex: params.shortText, $options: "i" } }),
                ...(params.description && { description: { $regex: params.description, $options: "i" } }),
                ...(params.userId && { userId: params.userId }),
                ...(params.tags && params.tags.length && { tags: { $all: params.tags } }),
            });

            if(!announcement.length) {
                console.log(`Announcement with  params: ${params} not found`);
                return null
            }

            return announcement
        } catch(err) {
            console.error(`Error AnnouncementService.find `, err);
            throw new Error(`Error in getting a announcement with params ${params}`)
        }
    }

    async create(data: IAnnouncement): Promise<IAnnouncementDocument | null> {
        try {
            const announcement = await Announcement.findOne(data);
            if(announcement) {
                return null;
            }

            const newAnnouncement = new Announcement(data);

            await newAnnouncement.save();
            return newAnnouncement
        } catch(err) {
            console.error(`Error AnnouncementService.create `, err);
            throw new Error(`Error in create a announcement with params ${data}}`)
        }
    }

    async remove(id: string): Promise<IAnnouncementDocument | null> {
        try {
            const announcement = await Announcement.findOneAndDelete({ _id: id });

            if(!announcement) {
                console.log(`Announcement with  params: ${id} not found`);
                return null;
            }
            
            return announcement
        } catch(err) {
            console.error(`Error AnnouncementService.remove `, err);
            throw new Error(`Error in remove a announcement with id ${id}}`)
        }
    }
}