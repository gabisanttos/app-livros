import { verify } from 'jsonwebtoken';
import { Request, Response } from "express-serve-static-core";
import { userRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../helpers/api-errors";
import bcrypt from 'bcrypt';

type JwtPayload = {
    id: number;
}

export class UserController {
    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body;
        
        const userExists = await userRepository.findOneBy({ email });

        if (userExists) {
            throw new BadRequestError('Email já cadastrado');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword
        });

        await userRepository.save(newUser);

        const { password: _, ...user } = newUser;

        return res.status(201).json(user);
    }

    async getProfile(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }
}
