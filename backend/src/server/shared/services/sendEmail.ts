// 1. Importe a biblioteca oficial da Resend
import { Resend } from 'resend';
import 'dotenv/config'; 

// 2. Configure a chave de API (ela será lida da variável de ambiente)
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Capitaliza a primeira letra de cada palavra numa string de nome.
 */
function capitalizeName(name?: string): string {
    if (!name) return 'Usuário';
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Envia um e-mail com o CÓDIGO de 6 dígitos para reset de senha usando a API da Resend.
 *
 * @param email O e-mail do destinatário.
 * @param resetToken O código de 6 dígitos gerado para reset de senha (OTP).
 * @param name O nome do utilizador.
 */
export async function sendResetEmail(email: string, resetToken: string, name: string): Promise<void> {
    // O remetente DEVE ser um e-mail de um domínio que você verificou na Resend
    const emailFrom = process.env.APP_EMAIL_FROM;

    if (!emailFrom) {
        console.error("FATAL ERROR: APP_EMAIL_FROM não configurado no ambiente.");
        throw new Error("Configurações de e-mail incompletas.");
    }
    
    const formattedName = capitalizeName(name);
    const otpCode = resetToken;

    const htmlContent = `
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

    try {
        // 3. Envie o e-mail usando a função da Resend
        const { data, error } = await resend.emails.send({
            from: emailFrom, // Use o formato "Nome <email@seu-dominio.com>"
            to: [email], 
            subject: 'Capitu: Seu Código de Reset de Senha',
            html: htmlContent,
        });

        if (error) {
            console.error(`[RESEND ERROR] Falha ao enviar e-mail para ${email}:`, error);
            throw new Error("Falha no envio de e-mail com a Resend.");
        }

        console.log(`[EMAIL] E-mail enviado com sucesso para ${email} via Resend. Message ID: ${data?.id}`);
    } catch (err) {
        console.error(`[EMAIL SERVICE ERROR] Exceção ao tentar enviar e-mail para ${email}:`, err);
        throw new Error("Falha no envio de e-mail.");
    }
}

