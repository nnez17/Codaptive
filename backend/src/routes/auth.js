import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import transporter from "../config/mailer.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: "fail",
        message: "Password does not match confirm Password",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Username or Email already exists",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashedVerificationToken,
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
    });

    const verificationUrl = `http://localhost:5173/verify-email/${verificationToken}`;

    const templateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Akun Codaptive</title>
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
                    <h2 style="color: #334155; font-size: 22px; font-weight: 700;">Selamat Datang di Codaptive!</h2>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                      Halo, <strong>${newUser.username}</strong>!<br>
                      Terima kasih telah bergabung. Satu langkah lagi sebelum kamu mulai menjelajahi platform kami, silakan konfirmasi bahwa ini memang alamat email kamu.
                    </p>
                    
                    <a href="${verificationUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 18px 36px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                      Verifikasi Akun Saya
                    </a>

                    <p style="color: #94a3b8; font-size: 13px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                      Link verifikasi ini akan kedaluwarsa dalam <strong>24 jam</strong>.<br>
                      Jika kamu tidak merasa mendaftar di Codaptive, silakan abaikan email ini.
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

    const mailOptions = {
      from: `"Codaptive Support" <${process.env.EMAIL_USER || "codaptiveplatform@gmail.com"}>`,
      to: newUser.email,
      subject: "Verification Codaptive Account",
      html: templateHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: newUser._id,
        username: newUser.username,
      },
    });
  } catch (err) {
    console.error("Register Error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({ verificationToken: hashedToken });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or expired verification token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    console.error("Email Verification Error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isVerified) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { accessToken },
    });
  } catch (err) {
    console.error("Login error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
      async (err, decode) => {
        if (err) {
          res.clearCookie("refreshToken", { path: "/" });
          return res.status(403).json({
            status: "fail",
            message: "Forbidden. Please login again.",
          });
        }

        const user = await User.findById(decode.userId);

        if (!user) {
          res.clearCookie("refreshToken", { path: "/" });
          return res.status(403).json({
            status: "fail",
            message: "User no longer exists",
          });
        }

        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
          status: "success",
          data: { accessToken: newAccessToken },
        });
      },
    );
  } catch (err) {
    console.error("Refresh Token Error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Email not registered",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 3600000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    const templateHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
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
                    <h2 style="color: #334155; font-size: 20px; font-weight: 700;">Atur Ulang Password Kamu</h2>
                    <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
                      Halo, <strong>${user.username}</strong>!<br>
                      Kami menerima permintaan untuk mereset password akunmu. Jangan khawatir, klik tombol di bawah untuk membuat password baru.
                    </p>
                    
                    <a href="${resetUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 16px 32px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);">
                      Reset Password
                    </a>

                    <p style="color: #94a3b8; font-size: 13px; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                      Link ini akan kedaluwarsa dalam <strong>1 jam</strong>.<br>
                      Jika kamu tidak merasa meminta ini, kamu bisa mengabaikan email ini dengan aman.
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

    const mailOptions = {
      from: `"Codaptive Support" <${process.env.EMAIL_USER || "codaptiveplatform@gmail.com"}>`,
      to: user.email,
      subject: "Reset Password Codaptive",
      html: templateHtml,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "The password reset link has been sent to the email",
    });
  } catch (err) {
    console.error("Forgot Password Error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.put("/reset-password/:token", async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    const { password } = req.body;
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password successfully updated",
    });
  } catch (err) {
    console.error("Reset Password Error", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;
