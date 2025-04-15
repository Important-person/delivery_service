import "reflect-metadata";
import { inject, injectable } from 'inversify';
import { IAnnouncementService } from "../services/announcementService.js";
import { Request, Response, NextFunction } from "express";
import TYPES from "../types/types.js";
import { IAnnouncement } from "../types/announcements.js";

@injectable()
export class AnnouncementController {
    constructor(@inject(TYPES.AnnouncementService) private announcementService: IAnnouncementService) {}

    async find(req: Request, res: Response): Promise<void> {
        const params = req.body;
        try {
            if(!params) {
                res.status(400).json({ message: "Params is not" });
                return;
            }

            const announcement = await this.announcementService.find(params);

            if(!announcement) {
                res.status(404).json({ message:  "Announcement not found"});
            } else {
                res.status(201).json({ data: announcement, status: 'ok' });
            }
        } catch(err) {
            console.error(`Error AnnouncementController.find`, err);
            res.status(500).json({ message: "Internal server error" })
        }       
    }

    async create(req: Request, res: Response): Promise<void> {
        const data: IAnnouncement = req.body;

        try {
            if(!data) {
                res.status(400).json({ message: "Data is not "});
            }

            const files = req.files as Express.Multer.File[];
            const imagePaths = files.map(file => `/uploads/${file.filename}`);

            const announcement = await this.announcementService.create({
                ...data,
                images: imagePaths,
            });

            if(!announcement) {
                res.status(400).json({ message: 'точно такое же объявление существует'})
            } else {
                res.status(200).json({ data: announcement, status: 'ok' })
            }
        } catch(err) {
            console.error(`Error AnnouncementController.create`, err);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async remove(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            if(!id) {
                res.status(400).json({ message: "ID is not "});
            }

            const announcement = await this.announcementService.remove(id);

            if(announcement.userId.toString() !== req.user._id.toString()) {
                res.status(403).json({ message: `Пользователь не является создателем объявления с id ${id}`})
            }

            if(!announcement) {
                res.status(400).json({ message: `Announcement with id ${id} not found`})
            } else {
                res.status(200).json({ data: announcement, status: 'ok'})
            }
        } catch(err) {
            console.error(`Error AnnouncementController.remove`, err);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async findId(req: Request, res: Response): Promise<void> {
        const { id } = req.params;

        try {
            if(!id) {
                res.status(400).json({ message: "ID is not "});
            }

            const announcement = await this.announcementService.findId(id);

            if(!announcement) {
                res.status(400).json({ message: `Объявление с id ${id} не найдено`});
            } else {
                res.status(200).json({data: announcement, status: 'ok'})
            }
        } catch(err) {
            console.error(`Error AnnouncementController.findId`, err);
            res.status(500).json({ message: "Internal server error" })
        }
    }
}
