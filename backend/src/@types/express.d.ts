import { User } from "../server/database/models/User";


declare global {
    namespace Express {
        export interface Request {
            user: Partial<User>
        }
    }
}
export {};