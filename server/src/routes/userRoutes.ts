import { Router } from "express";
import container from "../config/container.config.js";
import TYPES from "../types/types.js";
import { UserController } from "../controllers/userController.js";

const userRouter = Router();
const userContainer = container.get<UserController>(TYPES.UserController);

userRouter.get('/:email', userContainer.findByEmail.bind(userContainer));
userRouter.post('/', userContainer.create.bind(userContainer));

export default userRouter;
