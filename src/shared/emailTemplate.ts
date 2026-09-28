import config from '../config';
import { ICreateAccount, IResetPassword } from '../types/emailTemplate';

const BRAND = 'ShortUrl';

const logoSrc = () => {
    const domain = (config.domain || '').replace(/\/$/, '');
    return `${domain}/shorturl-logo.png`;
};

const layout = (title: string, body: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#F4F6FB; font-family:Arial, Helvetica, sans-serif; color:#1E1B4B;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F4F6FB; padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#1E1B4B; padding:28px 32px; text-align:center;">
                            <img src="${logoSrc()}" alt="${BRAND}" width="72" height="72" style="display:block; margin:0 auto 12px; border-radius:16px;" />
                            <p style="margin:0; font-size:20px; font-weight:700; letter-spacing:0.4px; color:#ffffff;">${BRAND}</p>
                            <p style="margin:6px 0 0; font-size:13px; color:#99F6E4;">Short links. Clear clicks.</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            ${body}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 32px 28px; text-align:center;">
                            <p style="margin:0; font-size:12px; line-height:1.6; color:#94A3B8;">
                                If you did not request this email, you can safely ignore it.
                            </p>
                            <p style="margin:8px 0 0; font-size:12px; color:#94A3B8;">
                                &copy; ${new Date().getFullYear()} ${BRAND}. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

const otpBlock = (otp: number | string) => `
    <p style="margin:0 0 16px; font-size:15px; line-height:1.6; color:#475569; text-align:center;">Your one-time code</p>
    <div style="margin:0 auto 16px; max-width:220px; background-color:#1E1B4B; border-radius:12px; padding:14px 20px; text-align:center;">
        <span style="font-size:28px; font-weight:700; letter-spacing:6px; color:#2DD4BF;">${otp}</span>
    </div>
    <p style="margin:0; font-size:14px; line-height:1.6; color:#64748B; text-align:center;">This code expires in 3 minutes.</p>
`;

const createAccount = (values: ICreateAccount) => {
    const html = layout(
        'Verify your ShortUrl account',
        `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:700; color:#1E1B4B;">Hey, ${values.name}</h1>
            <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#475569;">
                Thanks for joining ${BRAND}. Verify your email to start turning long links into short ones.
            </p>
            ${otpBlock(values.otp)}
        `
    );

    return {
        to: values.email,
        subject: 'Verify your ShortUrl account',
        html,
    };
};

const resetPassword = (values: IResetPassword) => {
    const html = layout(
        'Reset your ShortUrl password',
        `
            <h1 style="margin:0 0 12px; font-size:22px; font-weight:700; color:#1E1B4B;">Reset your password</h1>
            <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#475569;">
                Use this code to set a new password for your ${BRAND} account.
            </p>
            ${otpBlock(values.otp)}
        `
    );

    return {
        to: values.email,
        subject: 'Reset your ShortUrl password',
        html,
    };
};

export const emailTemplate = {
    createAccount,
    resetPassword,
};
