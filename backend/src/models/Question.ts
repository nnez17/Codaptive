import { Schema, model, Document } from "mongoose";

export interface IQuestion extends Document {
  questionText: string;
  type: "MCQ" | "BOOLEAN" | "CODE_CHALLENGE";
  difficulty: "EASY" | "MEDIUM" | "HARD";
  options?: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
  xpReward: number;
  moduleId?: Schema.Types.ObjectId;
  lessonId?: Schema.Types.ObjectId;
}

const questionSchema = new Schema(
  {
    questionText: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["MCQ", "BOOLEAN", "CODE_CHALLENGE"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
      default: "MEDIUM",
      index: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          if ((this as any).type === "MCQ") return v.length >= 2;
          return true;
        },
        message: "A question must have at least 2 options.",
      },
    },
    correctAnswer: {
      type: String,
      required: true,
      select: false,
    },
    explanation: {
      type: String,
      required: true,
      select: false,
    },
    tags: {
      type: [String],
      index: true,
    },
    xpReward: {
      type: Number,
      default: 10,
    },
    moduleId: {
      type: Schema.Types.ObjectId,
      ref: "Module",
      required: true,
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: "Lesson",
    },
  },
  {
    timestamps: true,
  },
);

questionSchema.pre<IQuestion>("save", async function () {
  if (this.difficulty === "EASY") this.xpReward = 10;
  else if (this.difficulty === "MEDIUM") this.xpReward = 20;
  else if (this.difficulty === "HARD") this.xpReward = 50;
});

export default model<IQuestion>("Question", questionSchema);
