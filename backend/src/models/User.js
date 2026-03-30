import { Schema, model } from "mongoose";

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
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    avatar: {
      type: String,
      default: "https://ui-avatars.com/api/?background=random&name=New+User",
    },
    stats: {
      xp: { type: Number, default: 0 },
      streak: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      maxXP: { type: Number, default: 1000 },
    },
    progress: {
      modules: [
        {
          moduleId: { type: Schema.Types.ObjectId, ref: "Module" },
          name: { type: String },
          progress: { type: Number, default: 0, min: 0, max: 100 },
          completed: { type: Boolean, default: false },
        },
      ],
      lessons: [
        {
          lessonId: { type: Schema.Types.ObjectId, ref: "Lesson" },
          completed: { type: Boolean, default: false },
          completedAt: { type: Date },
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
        },
      ],
    },
    activity: {
      lastWeek: [
        {
          day: { type: Date },
          lessons: { type: Number, default: 0 },
          challenges: { type: Number, default: 0 },
        },
      ],
      lastMonth: [
        {
          week: { type: Number },
          lessons: { type: Number, default: 0 },
          challenges: { type: Number, default: 0 },
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

export default model("User", userSchema);
