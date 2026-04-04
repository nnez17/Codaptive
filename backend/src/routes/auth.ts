import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { getEmailTemplate } from "../utils/emailTemplates";
import transporter from "../config/mailer";

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL;

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const rawToken = crypto.randomBytes(20).toString("hex");

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationToken: hashToken(rawToken),
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`,
    });

    const url = `${FRONTEND_URL}/verify-email/${rawToken}`;
    const mailOptions = {
      from: `"Codaptive Support" <${process.env.EMAIL_USER || "codaptiveplatform@gmail.com"}>`,
      to: newUser.email,
      subject: "Verify Your Email for Codaptive",
      html: getEmailTemplate(username, url, "verify"),
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
    const user = await User.findOne({
      verificationToken: hashToken(req.params.token),
    });
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

router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "fail",
        message: "Email is already verified",
      });
    }

    const rawToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = hashToken(rawToken);
    await user.save();

    const url = `${FRONTEND_URL}/verify-email/${rawToken}`;
    const mailOptions = {
      from: `"Codaptive Support" <${process.env.EMAIL_USER || "codaptiveplatform@gmail.com"}>`,
      to: user.email,
      subject: "Verify Your Email for Codaptive",
      html: getEmailTemplate(user.username, url, "verify"),
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      status: "success",
      message: "Verification email sent successfully",
    });
  } catch (err) {
    console.error("Resend Verification Error", err);
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

    if (
      !user ||
      !user.isVerified ||
      !(await bcrypt.compare(password, user.password))
    ) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    const accessToken = generateAccessToken({
      ...user.toObject(),
      _id: user._id.toString(),
    });
    const refreshToken = generateRefreshToken({
      ...user.toObject(),
      _id: user._id.toString(),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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

    interface JwtPayload {
      userId: string;
      [key: string]: unknown;
    }

    interface RefreshResponse {
      status: string;
      data?: { accessToken: string };
      message?: string;
    }

    jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "",
      (err: Error | null, decode: unknown) => {
        if (err) {
          res.clearCookie("refreshToken", { path: "/" });
          return res.status(403).json({
            status: "fail",
            message: "Forbidden. Please login again.",
          });
        }

        User.findById((decode as JwtPayload).userId)
          .then((user) => {
            if (!user) {
              res.clearCookie("refreshToken", { path: "/" });
              return res.status(403).json({
                status: "fail",
                message: "User no longer exists",
              });
            }

            const newAccessToken = generateAccessToken({
              ...user.toObject(),
              _id: user._id.toString(),
            });

            const response: RefreshResponse = {
              status: "success",
              data: { accessToken: newAccessToken },
            };

            res.status(200).json(response);
          })
          .catch(() => {
            res.status(403).json({
              status: "fail",
              message: "User no longer exists",
            });
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Email not registered",
      });
    }

    const rawToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = hashToken(rawToken);
    user.resetPasswordExpire = new Date(Date.now() + 3600000);
    await user.save();

    const url = `${FRONTEND_URL}/reset-password/${rawToken}`;

    const mailOptions = {
      from: `"Codaptive Support" <${process.env.EMAIL_USER || "codaptiveplatform@gmail.com"}>`,
      to: user.email,
      subject: "Reset Password Codaptive",
      html: getEmailTemplate(user.username, url, "reset"),
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
    const user = await User.findOne({
      resetPasswordToken: hashToken(req.params.token),
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    user.password = await bcrypt.hash(req.body.password, 10);
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
