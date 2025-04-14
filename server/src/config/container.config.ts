import "reflect-metadata";
import TYPES from "../types/types.js";
import { Container } from "inversify";
import { IUserService, UserService } from "../services/userService.js";
import { UserController } from "../controllers/userController.js";

const container = new Container();
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<UserController>(TYPES.UserController).to(UserController);

export default container;