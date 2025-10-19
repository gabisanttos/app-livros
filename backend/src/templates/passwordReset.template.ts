import { capitalizeName } from './helpers/text.helpers';

interface EmailContent {
  subject: string;
  html: string;
}

/**
 * Gera o conteúdo de e-mail para reset de senha.
 * @param name
 * @param otpCode
 * @returns
 */
export function getPasswordResetEmail(name: string, otpCode: string): EmailContent {
  const formattedName = capitalizeName(name);
  
  const subject = 'Capitu: Seu Código de Reset de Senha';
  
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h1 style="color: #a07d4c; text-align: start;">
            Capitu -
            <span style="font-size: 0.7em; font-weight: bold;">Descubra seu próximo livro favorito</span>
        </h1>
        <h2 style="color: #a07d4c; text-align: center;">Código de Reset de Senha</h2>
        <p>Olá, ${formattedName},</p>
        <p>Você solicitou um reset de senha para sua conta no Capitu. Utilize o código de 6 dígitos abaixo no seu aplicativo para confirmar a troca de senha.</p>

        <div style="text-align: center; margin: 30px 0; background-color: #f7f3fb; padding: 20px; border-radius: 6px; border: 1px dashed #a07d4c;">
            <p style="font-size: 14px; color: #555; margin-bottom: 5px;">Seu Código de Confirmação (Válido por 1 hora):</p>
            <strong style="font-size: 32px; letter-spacing: 10px; color: #a07d4c;">${otpCode}</strong>
        </div>

        <p>Este código expira em 1 hora. Por favor, não compartilhe este código com ninguém.</p>
        <p>Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
        <p>Atenciosamente,<br>A Equipe Capitu</p>
    </div>
  `;

  return { subject, html };
}