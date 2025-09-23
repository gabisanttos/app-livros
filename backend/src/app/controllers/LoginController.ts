import { Request, Response } from "express-serve-static-core";
import { userRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../helpers/api-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class LoginController {
    async login(req: Request, res: Response) {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new BadRequestError("E-mail e senha são obrigatórios");
        }

        const user = await userRepository.findOneBy({ email });

        if (!user) {
            throw new BadRequestError("Email ou senha inválidos");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new BadRequestError("Email ou senha inválidos");
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET ?? '',{
            expiresIn: '1h'
        });

        const { password: _, ...userLogin} = user;
        
        return res.json({ 
            user: userLogin,
            token: token,
        });
    }
}
