import 'reflect-metadata';
import { IUser, IUserDocument } from "../types/user.js";
import { injectable } from "inversify";
import User from '../models/user.js';

export interface IUserService {
    findByEmail(email: string): Promise<IUserDocument | null>;
    create(userData: IUser): Promise<IUserDocument> | null
}

@injectable()
export class UserService implements IUserService {
    async findByEmail(email: string): Promise<IUserDocument | null> {
        try {
            const user = await User.findOne({ email });

            if(!user) {
                console.log(`User with  email: ${email} not found`);
                return null
            }
            return user
        } catch(err) {
            console.error(`Error UserService.findbyEmail `, err);
            throw new Error(`Error in getting a user with email ${email}`)
        }
    }

    async create(userData: IUser): Promise<IUserDocument> | null {
        try {
            const existing = await User.findOne({ email: userData.email });
            if (existing) {
                return null;
            }

            const user = new User(userData);

            await user.save();
            return user
        } catch(err) {
            console.error(`Error UserService.create `, err);
            throw new Error(`Error in creating a user ${userData}`)
        }
    }
}
