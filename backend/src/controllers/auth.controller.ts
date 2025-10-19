import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import { 
  LoginUserDto, 
  RegisterUserDto, 
  RequestPasswordResetDto, 
  ResetPasswordDto, 
  VerifyTokenDto 
} from "../view/dto/auth.dto";

export class AuthController {
  
  // 1. Registro
  async register(req: Request, res: Response) {
    const dto: RegisterUserDto = req.body;
    const user = await AuthService.register(dto);
    return res.status(201).json(user);
  }

  // 2. Login
  async login(req: Request, res: Response) {
    const dto: LoginUserDto = req.body;
    console.log('Requisição login - req.body:', req.body);

    const authResponse = await AuthService.login(dto);
    return res.json(authResponse);
  }

  // 3. Solicitar reset de senha
  async requestPasswordReset(req: Request, res: Response) {
    const dto: RequestPasswordResetDto = req.body;
    
    await AuthService.requestPasswordReset(dto);

    return res.status(200).json({ 
      message: "Se o e-mail existir, você receberá instruções para resetar a senha." 
    });
  }

  // 4. Verificar código de reset
  async verifyResetToken(req: Request, res: Response) {
    const dto: VerifyTokenDto = req.body;
    await AuthService.verifyResetToken(dto);
    return res.status(200).json({ message: "Código válido" });
  }

  // 5. Resetar senha
  async resetPassword(req: Request, res: Response) {
    const dto: ResetPasswordDto = req.body;
    await AuthService.resetPassword(dto);
    return res.status(200).json({ message: "Senha redefinida com sucesso" });
  }
}