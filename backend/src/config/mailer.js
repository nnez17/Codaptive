import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "codaptiveplatform@gmail.com",
    pass: process.env.EMAIL_PASS || "tubs wcji asxl ahkx",
  },
});

export default transporter;
