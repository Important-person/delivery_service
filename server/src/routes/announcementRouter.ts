import { Router } from "express";
import container from "../config/container.config.js";
import TYPES from "../types/types.js";
import { AnnouncementController } from "../controllers/announcementController.js";
import isAuthenticated from "../middleware/auth.js";
import multerSettings from "../middleware/multer.js";

const announcementRouter = Router();

const announcementContainer = container.get<AnnouncementController>(TYPES.AnnouncementController);

announcementRouter.get('/advertisements', announcementContainer.find.bind(announcementContainer));
announcementRouter.post('/advertisements/:id', announcementContainer.findId.bind(announcementContainer));
announcementRouter.post('/advertisements', isAuthenticated, multerSettings.array('images', 5), announcementContainer.create.bind(announcementContainer));
announcementRouter.delete('/advertisements/:id', isAuthenticated, announcementContainer.remove.bind(announcementContainer));

export default announcementRouter;