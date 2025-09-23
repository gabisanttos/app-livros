import { User } from "../app/models/User";


declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>
        }
    }
}
export {};