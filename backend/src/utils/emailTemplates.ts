export const getEmailTemplate = (
  username: string,
  url: string,
  type: "verify" | "reset",
) => {
  const config = {
    verify: { subject: "Verify Your Email", action: "Verify Email" },
    reset: { subject: "Reset Your Password", action: "Reset Password" },
  };

  const current = config[type];

  return `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title${current.subject}</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td align="center" style="padding: 40px 0;">
                  <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                    
                    <tr>
                      <td align="center" style="padding: 40px 40px 20px 40px;">
                        <div style="background-color: #eef2ff; width: 64px; height: 64px; border-radius: 20px; line-height: 64px; display: inline-block;">
                          <span style="font-size: 32px; color: #4f46e5; font-weight: bold;">C</span>
                        </div>
                        <h1 style="margin-top: 20px; color: #1e293b; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Codaptive</h1>
                      </td>
                    </tr>
    
                    <tr>
                      <td style="padding: 0 60px 40px 60px; text-align: center;">
                        <h2 style="color: #334155; font-size: 22px; font-weight: 700;">${current.subject}</h2>
                        <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                          Hi, <strong>${username}</strong>!<br>
                          Thank you for ${type === "verify" ? "registering an account" : "requesting a password reset"} with Codaptive. Please click the button below to ${type === "verify" ? "verify your email address" : "reset your password"}.
                        </p>
                        
                        <a href="${url}" style="background-color: #4f46e5; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                          ${current.action}
                        </a>
    
                        <p style="color: #94a3b8; font-size: 13px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                            If you did not ${type === "verify" ? "create an account" : "request a password reset"}, please ignore this email or contact support if you have questions.
                        </p>
                      </td>
                    </tr>
    
                    <tr>
                      <td style="background-color: #f8fafc; padding: 30px; text-align: center;">
                        <p style="color: #cbd5e1; font-size: 12px; margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                          &copy; 2026 Codaptive Platform. All Rights Reserved.
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
