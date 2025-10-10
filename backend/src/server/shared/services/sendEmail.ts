// 1. Importe a biblioteca oficial do SendGrid
import sgMail from '@sendgrid/mail';
import 'dotenv/config'; 

// 2. Configure a chave de API (ela será lida da variável de ambiente)
// O SendGrid recomenda o nome 'SENDGRID_API_KEY'
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

/**
 * Capitaliza a primeira letra de cada palavra em uma string de nome.
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
 * Envia um e-mail com o CÓDIGO de 6 dígitos para reset de senha usando a API do SendGrid.
 *
 * @param email O e-mail do destinatário.
 * @param resetToken O código de 6 dígitos gerado para reset de senha (OTP).
 * @param name O nome do usuário.
 */
export async function sendResetEmail(email: string, resetToken: string, name: string): Promise<void> {
    // O remetente DEVE ser um e-mail de um domínio que você verificou no SendGrid
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

    
    // 3. Monte a mensagem no formato que o SendGrid espera
    const msg = {
        to: email,
        from: emailFrom, // Use o e-mail verificado
        subject: 'Capitu: Seu Código de Reset de Senha',
        html: htmlContent,
    };

    try {
        // 4. Envie o e-mail usando a função do SendGrid
        await sgMail.send(msg);
        console.log(`[EMAIL] E-mail enviado com sucesso para ${email} via SendGrid.`);
    } catch (error: any) {
        console.error(`[SENDGRID ERROR] Falha ao enviar e-mail para ${email}:`, error);
        // O SendGrid pode fornecer mais detalhes do erro no corpo da resposta
        if (error.response) {
            console.error(error.response.body)
        }
        throw new Error("Falha no envio de e-mail.");
    }
}
