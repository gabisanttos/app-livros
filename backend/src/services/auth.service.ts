import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import EmailService from './email.service';
import { userRepository } from "../repositories/user.repository";
import { BadRequestError } from "../helpers/api-errors";
import { generateOtpCode } from "../utils/otp.util";
import { UserProfileDto } from "../view/dto/user-profile.dto";
import { 
  AuthResponseDto, 
  LoginUserDto, 
  RegisterUserDto, 
  RequestPasswordResetDto, 
  ResetPasswordDto, 
  VerifyTokenDto 
} from "../view/dto/auth.dto";

class AuthService {
  
  // 1. Registro
  public async register(dto: RegisterUserDto): Promise<UserProfileDto> {
    const { name, email, password } = dto;
    
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

    return UserProfileDto.fromEntity(newUser);
  }

  // 2. Login
  public async login(dto: LoginUserDto): Promise<AuthResponseDto> {
    const { email, password } = dto;

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
      throw new Error("JWT_SECRET não configurado no .env"); // Erro de servidor
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '1h' });

    return {
      user: UserProfileDto.fromEntity(user),
      token: token,
    };
  }

  // 3. Solicitar reset de senha
  public async requestPasswordReset(dto: RequestPasswordResetDto): Promise<void> {
    const { email } = dto;
    if (!email) {
      throw new BadRequestError("E-mail é obrigatório");
    }

    const user = await userRepository.findOneBy({ email });

    if (user) {
      const resetToken = generateOtpCode();
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora

      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;

      try {
        await userRepository.save(user);
        await EmailService.sendPasswordResetEmail(user.email, resetToken, user.name);
      } catch (error) {
        console.error("Erro ao salvar token ou enviar e-mail:", error);
        throw new Error("Ocorreu um erro interno. Tente novamente mais tarde.");
      }
    }

  }

  // 4. Verificar código de reset
  public async verifyResetToken(dto: VerifyTokenDto): Promise<void> {
    const { token } = dto;
    if (!token) {
      throw new BadRequestError("O código é obrigatório.");
    }

    const user = await userRepository.findOneBy({ resetToken: token });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestError("Código inválido ou expirado. Solicite um novo.");
    }
  }

  // 5. Resetar senha
  public async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = dto;

    if (!token || !newPassword) {
      throw new BadRequestError("O código e a nova senha são obrigatórios.");
    }

    const user = await userRepository.findOneBy({ resetToken: token });

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new BadRequestError("Código inválido ou expirado.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await userRepository.save(user);
  }
}

export default new AuthService();