import { Schema, model, Document, Types } from "mongoose";

interface ILessonProgress {
  lessonId: string;
  completed: boolean;
  completedAt?: Date;
}

interface IActivityDay {
  day: string;
  lessons: number;
  challenges: number;
}

interface IActivityWeek {
  week: number;
  lessons: number;
  challenges: number;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  avatar: string;
  stats: {
    xp: number;
    streak: number;
    level: number;
    maxXP: number;
  };
  progress: {
    lessons: ILessonProgress[];
    levels: { levelId: string; status: "COMPLETED" | "ON GOING" | "LOCKED" }[];
  };
  activity: {
    lastWeek: IActivityDay[];
    lastMonth: IActivityWeek[];
  };
  settings: {
    theme: "light" | "dark";
    notifications: boolean;
  };
}

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String, sparse: true },
    resetPasswordToken: { type: String, sparse: true },
    resetPasswordExpire: Date,
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?background=random&name=New+User",
    },
    stats: {
      xp: { type: Number, default: 0, min: 0 },
      streak: { type: Number, default: 0, min: 0 },
      level: { type: Number, default: 1, min: 1 },
      maxXP: { type: Number, default: 1000, min: 100 },
    },
    progress: {
      lessons: [
        {
          lessonId: { type: String, ref: "Lesson" },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date, default: Date.now() },
          _id: false,
        },
      ],
      levels: [
        {
          levelId: { type: String, default: "beginner" },
          status: {
            type: String,
            enum: ["COMPLETED", "ON GOING", "LOCKED"],
            default: "LOCKED",
          },
          _id: false,
        },
      ],
    },
    activity: {
      lastWeek: [
        {
          day: { type: String },
          lessons: { type: Number, default: 0 },
          challenges: { type: Number, default: 0 },
          _id: false,
        },
      ],
      lastMonth: [
        {
          week: { type: Number },
          lessons: { type: Number, default: 0 },
          challenges: { type: Number, default: 0 },
          _id: false,
        },
      ],
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark"],
        default: "light",
      },
      notifications: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  },
);

export default model<IUser>("User", userSchema);
