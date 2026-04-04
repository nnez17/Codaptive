import jwt from "jsonwebtoken";

interface User {
  _id: string;
}

const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "codaptivelearningaccess";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "codaptivelearningrefresh";

export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user._id,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user._id,
    },
    JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
