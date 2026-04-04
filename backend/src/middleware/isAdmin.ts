import { type Request, type Response, type NextFunction } from "express";
import User from "../models/User";

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Forbidden",
      });
    }

    next();
  } catch (err) {
    console.error("Failed to verify admin privileges");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
