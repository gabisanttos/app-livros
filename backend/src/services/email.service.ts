import EmailGateway from '../gateways/resend.gateway';
import { getPasswordResetEmail } from '../templates/passwordReset.template';

class EmailService {
  
  public async sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<void> {
    try {
      const { subject, html } = getPasswordResetEmail(name, resetToken);

      await EmailGateway.sendEmail(email, subject, html);
          
    } catch (error) {
      throw new Error("Não foi possível enviar o e-mail de reset de senha.");
    }
  }

}

export default new EmailService();