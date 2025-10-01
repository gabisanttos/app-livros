import { Request, Response } from "express-serve-static-core";
import { userRepository } from "../database/repositories/userRepository";
import { BadRequestError } from "../helpers/api-errors";
import { sendResetEmail } from "../shared/services/sendEmail";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

function generateOtpCode(): string {
    // Gera um número entre 100000 e 999999.
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
}

export class AuthController {
    // 1. Registro
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

    // 2. Login
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

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error("JWT_SECRET não configurado no .env");
        }

        const token = jwt.sign({ id: user.id }, jwtSecret, {
            expiresIn: '1h',
        });


        const { password: _, ...userLogin} = user;
        
        return res.json({ 
            user: userLogin,
            token: token,
        });
    }

    // 3. Solicitar reset de senha
    async requestPasswordReset(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError("E-mail é obrigatório");
    }

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return res.status(200).json({ message: "Se o e-mail existir, você receberá instruções para resetar a senha." });
    }

    const resetToken = generateOtpCode();
    const resetTokenExpiry = new Date(Date.now() + 3600000); 

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;

    try {
            await userRepository.save(user);

            await sendResetEmail(user.email, resetToken);
            
            return res.status(200).json({ message: "Se o e-mail existir, você receberá instruções para resetar a senha." });
        } catch (error) {
            console.error("Erro ao processar reset de senha:", error);
            return res.status(500).json({ message: "Ocorreu um erro interno. Tente novamente mais tarde." });
        }

    }

    // 4. Resetar senha
    async resetPassword(req: Request, res: Response) {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
        throw new BadRequestError("Código de reset e nova senha são obrigatórios.");
        }

        const user = await userRepository.findOneBy({ resetToken: token });

        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            throw new BadRequestError("Código inválido ou expirado");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;

        await userRepository.save(user);

        return res.status(200).json({ message: "Senha resetada com sucesso" });
    }


}
