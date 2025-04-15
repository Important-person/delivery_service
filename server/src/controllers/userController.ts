import "reflect-metadata";
import { NextFunction, Request, Response } from "express";
import { IUserService} from "../services/userService.js";
import TYPES from "../types/types.js";
import { inject, injectable } from "inversify";
import { IUser } from "../types/user.js";
import passport from "passport";
import { IVerifyOptions } from "passport-local";

@injectable()
export class UserController {
    constructor(@inject(TYPES.UserService) private userService: IUserService) {}
    // такого обработчика нет в роутах но может пригодиться
    // async findByEmail(req: Request, res: Response): Promise<void> {
    //     const { email } = req.params;

    //     try {
    //         if(!email) {
    //             res.status(400).json({ message: "User ID is not" });
    //             return;
    //         }

    //         const user = await this.userService.findByEmail(email);

    //         if(!user) {
    //             res.status(404).json({ message: "User not found" });
    //         } else {
    //             res.status(201).json(user);
    //         }
    //     } catch(err) {
    //         console.error(`Error UserController.findByEmail for email `, err);
    //         res.status(500).json({ message: "Internal server error" })
    //     }
    // }

    async create(req: Request, res: Response): Promise<void> {
        const userData: IUser = req.body;

        try {
            if(!userData) {
                res.status(400).json({ message: "UserData is not" });
                return;
            }

            const user = await this.userService.create(userData);

            if(!user) {
                res.status(400).json({ error: 'email занят', status: 'error'});
            }

            res.status(200).json({ data: user, status: 'ok'});
        } catch(err) {
            console.error(`Error UserController.create userData `, err);
            res.status(500).json({ message: "Internal server error" })
        }
    }

    login(req: Request, res: Response, next: NextFunction): void {
        passport.authenticate('local', (err: any, user: Express.User, info: IVerifyOptions) => {

            if(err) return next(err);

            if(!user) return res.status(401).json({ error: 'Неверный логин или пароль', status: 'error' });

            req.login(user, (err) => {
                if(err) {
                    console.error(`Error UserController.login `, err);
                    return next(err);
                };
                return res.json({ data: user, status: 'ok' });
            })
        })(req, res, next);
    }
}