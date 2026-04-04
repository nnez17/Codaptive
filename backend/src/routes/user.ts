import express, { type Request } from "express";
import User from "../models/User";
import { verifyToken } from "../middleware/verifyToken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const router = express.Router();

router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (err) {
    console.error("Failed to Get Profile");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

export default router;
