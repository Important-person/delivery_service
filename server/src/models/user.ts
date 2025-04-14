import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';
import { IUserDocument } from "../types/user.js";

const SALT_LENGTH = 10;

const UserSchema = new Schema<IUserDocument>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    contactPhone: {
        type: String,
    }
}, { versionKey: false })

UserSchema.pre<IUserDocument>('save', async function(next) {
    const user = this;

    if(!user.isModified('passwordHash')) return next();

    try {
        const salt = await bcrypt.genSalt(SALT_LENGTH);

        const hash = await bcrypt.hash(user.passwordHash, salt);

        user.passwordHash = hash;

        next();
    } catch(err: unknown) {
        console.error(`Error hashing ${err}`);
        
        if(err instanceof Error) {
            next(err);
        } else {
            next(new Error('Unknown error hash'));
        }
    }
});

const User = model<IUserDocument>('User', UserSchema);

export default User;

