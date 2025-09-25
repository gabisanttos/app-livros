import { verify } from 'jsonwebtoken';
import { Request, Response } from "express-serve-static-core";
import { userRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../helpers/api-errors";
import bcrypt from 'bcrypt';

type JwtPayload = {
    id: number;
}

export class UserController {
    
    async getProfile(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }
}
