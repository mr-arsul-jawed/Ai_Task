const resetPasswordTemplate = (user, resetUrl) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            .fallback-link { word-break: break-all !important; }
            @media screen and (max-width: 600px) {
                .main-content { width: 100% !important; padding: 10px !important; }
                .button { width: 100% !important; text-align: center !important; box-sizing: border-box; display: block !important; }
            }
        </style>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6f8;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px 0; font-family: 'Segoe UI', Arial, sans-serif;">
            <tr>
                <td align="center">
                    <table class="main-content" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:500px; width:500px;">
                        
                        <tr>
                            <td align="center" style="padding-bottom:30px;">
                                <h2 style="margin:0; color:#1a202c; font-size: 24px;">AI Task App</h2>
                                <p style="margin:5px 0 0; color:#718096; font-size:14px;">Secure Account Services</p>
                            </td>
                        </tr>

                        <tr>
                            <td align="left">
                                <h3 style="color:#2d3748; margin:0 0 15px; font-size: 18px;">Reset Your Password</h3>
                            </td>
                        </tr>

                        <tr>
                            <td align="left" style="color:#4a5568; font-size:15px; line-height:1.6;">
                                <p>Hi ${user.name || "User"},</p>
                                <p>We received a request to reset your password for your account.</p>
                                <p>Click the button below to proceed. This link is valid for <strong style="color:#2d3748;">15 minutes</strong>.</p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding:30px 0;">
                                <a href="${resetUrl}" class="button" style="background-color:#4CAF50; color:#ffffff; padding:14px 24px; text-decoration:none; border-radius:8px; font-size:16px; font-weight:600; display:inline-block;">
                                    Reset Password
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td align="left" style="border-top:1px solid #cbd5e0; padding-top:20px;">
                                <p style="font-size:12px; color:#718096; margin-bottom: 5px;">
                                    If the button doesn't work, copy and paste this link:
                                </p>
                                <p class="fallback-link" style="font-size:12px; margin:0;">
                                    <a href="${resetUrl}" style="color:#4CAF50; text-decoration: underline;">${resetUrl}</a>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="left" style="padding-top:30px;">
                                <p style="font-size:12px; color:#718096; margin:0;">
                                    If you didn’t request this, you can safely ignore this email.
                                </p>
                                <p style="font-size:12px; color:#718096; margin:10px 0 0;">
                                    Need help? <a href="mailto:arsh49760@gmail.com" style="color:#4CAF50; text-decoration:none;">arsh49760@gmail.com</a>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding-top:40px;">
                                <p style="font-size:11px; color:#a0aec0; margin:0;">
                                    &copy; ${new Date().getFullYear()} AI Task App
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
};

export default resetPasswordTemplate;