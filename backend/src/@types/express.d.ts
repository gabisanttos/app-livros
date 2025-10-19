import { User } from "../models/user.model";
declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>
        }
    }
}
export {};