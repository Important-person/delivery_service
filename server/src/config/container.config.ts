import "reflect-metadata";
import TYPES from "../types/types.js";
import { Container } from "inversify";
import { IUserService, UserService } from "../services/userService.js";
import { UserController } from "../controllers/userController.js";
import { AnnouncementService, IAnnouncementService } from "../services/announcementService.js";
import { AnnouncementController } from "../controllers/announcementController.js";
import { ChatService, IChatService } from "../services/chatService.js";

const container = new Container();
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<IAnnouncementService>(TYPES.AnnouncementService).to(AnnouncementService);
container.bind<AnnouncementController>(TYPES.AnnouncementController).to(AnnouncementController);
container.bind<IChatService>(TYPES.ChatService).to(ChatService).inSingletonScope();

export default container;