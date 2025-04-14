import { IUserDocument } from "./user.ts";

declare global {
  namespace Express {
    interface User extends IUserDocument {}
  }
}
