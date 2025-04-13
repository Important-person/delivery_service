import { Document } from 'mongoose';

export interface IUser {
    email: string;
    passwordHash: string;
    name: string;
    contactPhone?: string
}

export interface IUserDocument extends IUser, Document {}