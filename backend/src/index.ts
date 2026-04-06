import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./utils/connectDB";
import adminRoutes from "./routes/admin";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import questionRoutes from "./routes/question";
import lessonRoutes from "./routes/lesson";

const app = express();

dotenv.config();
connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/", questionRoutes);
app.use("/", lessonRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);
});
