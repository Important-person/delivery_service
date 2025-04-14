import passport from "passport";
import { Strategy as LocalStrategy } from 'passport-local';
import container from "./container.config.js";
import bcrypt from "bcryptjs";
import { UserService } from "../services/userService.js";
import TYPES from "../types/types.js";

const userContainer = container.get<UserService>(TYPES.UserService);

passport.use(
    new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {
        try {
            const user = await userContainer.findByEmail(email);

            if(!user) {
                return done(null, false, { message: 'Пользователь не найден' });
            }

            const comparePassword = await bcrypt.compare(password, user.passwordHash)
            if(!comparePassword) {
                return done(null, false, { message: 'Неверный пароль' })
            }

            return done(null, user)
        } catch(err) {
            console.error(`Error auntificated ${err}`);
            done(err);
        }
    })
)

passport.serializeUser((user, done) => {
    done(null, user.email)
})

passport.deserializeUser(async (email: string, done) => {
    try {
        const user = await userContainer.findByEmail(email);

        done(null, user);
    } catch(err) {
        console.error(`Error deserializeUser ${err}`);
        done(err)
    }
})