import { Request, Response } from "express-serve-static-core";
import { userRepository } from "../../repositories/userRepository";
import { BadRequestError } from "../../helpers/api-errors";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export class LoginController {
    async register(req: Request, res: Response) {
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

    async login(req: Request, res: Response) {
        const { email, password } = req.body;
        
        console.log('Requisição login - req.body:', req.body);


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
