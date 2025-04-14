import "reflect-metadata";
import { Request, Response } from "express";
import { IUserService} from "../services/userService.js";
import TYPES from "../types/types.js";
import { inject, injectable } from "inversify";
import { IUser } from "../types/user.js";

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: IUserService) {}

    async findByEmail(req: Request, res: Response): Promise<void> {
        const { email } = req.params;

        try {
            if(!email) {
                res.status(400).json({ message: "User ID is not" });
                return;
            }

            const user = await this.userService.findByEmail(email);

            if(!user) {
                res.status(404).json({ message: "User not found" });
            } else {
                res.status(200).json(user);
            }
        } catch(err) {
            console.error(`Error UserController.findByEmail for email ${email}`);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        const userData: IUser = req.body;

        try {
            if(!userData) {
                res.status(400).json({ message: "UserData is not" });
                return;
            }

            const user = await this.userService.create(userData);

            res.status(200).json(user);
        } catch(err) {
            console.error(`Error UserController.create userData `, err);
            res.status(500).json({ message: "Internal server error" })
        }
    }
}