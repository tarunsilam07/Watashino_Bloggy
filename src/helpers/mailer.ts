import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export default async function sendEmail({email,emailType,userId }:any) {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    const hashedEmail = await bcryptjs.hash(email, 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
        hashedEmail: hashedEmail,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
        hashedEmail: hashedEmail,
      });
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const verificationLink = `${process.env.DOMAIN}/${
      emailType === "VERIFY" ? "verifyemail" : "resetpassword"
    }?token=${encodeURIComponent(hashedToken)}&id=${encodeURIComponent(
      hashedEmail
    )}`;

    const mailOptions = {
      from: "tarun79767@gmail.com",
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${emailType === "VERIFY" ? "Email Verification" : "Password Reset"}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4f46e5;
              color: #ffffff;
              padding: 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
              text-align: center;
              color: #333333;
            }
            .content p {
              font-size: 16px;
              line-height: 1.6;
              margin: 0 0 20px;
            }
            .button-container {
              margin: 20px 0;
            }
            .button {
              background-color: #4f46e5;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              display: inline-block;
            }
            .button:hover {
              background-color: #3730a3;
            }
            .footer {
              background-color: #f4f4f4;
              color: #999999;
              text-align: center;
              padding: 10px;
              font-size: 14px;
            }
            .footer a {
              color: #4f46e5;
              text-decoration: none;
            }
            .footer a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>${
                emailType === "VERIFY"
                  ? "Welcome to Watashino Bloggy"
                  : "Reset Your Password"
              }</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>${
                emailType === "VERIFY"
                  ? "We received a request to verify your email."
                  : "We received a request to reset your password."
              }</p>
              <p>Please click the button below to ${
                emailType === "VERIFY"
                  ? "complete the verification process"
                  : "reset your password"
              }:</p>
              <div class="button-container">
                <a href="${verificationLink}" class="button" target="_blank">${
        emailType === "VERIFY" ? "Verify Email" : "Reset Password"
      }</a>
              </div>
              <p>If you didn't request this, you can safely ignore this email.</p>
              <p>Alternatively, you can copy and paste the following link into your browser:</p>
              <p><a href="${verificationLink}" target="_blank">${verificationLink}</a></p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Watashino Bloggy. All rights reserved.</p>
              <p><a href="https://watashino-bloggy.vercel.app" target="_blank">Visit our website</a></p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    return mailResponse;
  } catch (error:any) {
    throw new Error(error.message);
  }
}
