import "reflect-metadata";
import { inject, injectable } from 'inversify';
import { AnnouncementService, IAnnouncementService } from "../services/announcementService.js";
import { Request, Response, NextFunction } from "express";
import TYPES from "../types/types.js";

@injectable()
export class AnnouncementController {
    constructor(@inject(TYPES.AnnouncementService) private announcementService: IAnnouncementService) {}

    
}
