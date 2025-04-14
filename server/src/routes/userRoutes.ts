import { Router } from "express";
import container from "../config/container.config.js";
import TYPES from "../types/types.js";
import { UserController } from "../controllers/userController.js";

const userRouter = Router();
const userContainer = container.get<UserController>(TYPES.UserController);

userRouter.post('/signup', userContainer.create.bind(userContainer));
userRouter.post('/signin', userContainer.findByEmail.bind(userContainer));
export default userRouter;
