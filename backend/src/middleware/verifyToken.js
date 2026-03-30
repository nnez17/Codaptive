import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Access denied. Token not found.",
    });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Token is invalid or has expired",
      });
    }

    req.userId = decode.userId;

    next();
  });
};
