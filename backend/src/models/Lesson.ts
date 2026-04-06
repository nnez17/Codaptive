import { Schema, model, Document } from "mongoose";

interface IQuestion {
  id: string;
  type: "mcq" | "fill";
  instruction?: string;
  question: string;
  code?: string;
  options?: string[];
  answer: string | string[];
  expectedOutput?: string;
  correctFeedback?: string;
  wrongFeedback?: string;
}

interface IPage {
  type: "explanation" | "quiz";
  content?: string;
  example?: string;
  quizType?: "mcq" | "fill";
  question?: IQuestion;
}

export interface ILesson extends Document {
  lessonId: string;
  title: string;
  level: "advanced" | "intermediate" | "beginner";
  pages: IPage[];
}

const lessonSchema = new Schema<ILesson>({
  lessonId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  level: {
    type: String,
    enum: ["advanced", "intermediate", "beginner"],
    default: "advanced",
  },
  pages: [
    {
      _id: false,
      type: {
        type: String,
        enum: ["explanation", "quiz"],
        required: true,
      },
      content: { type: String },
      example: { type: String },
      quizType: {
        type: String,
        enum: ["mcq", "fill"],
      },
      question: {
        _id: false,
        id: { type: String },
        type: {
          type: String,
          enum: ["mcq", "fill"],
        },
        instruction: { type: String },
        question: { type: String },
        code: { type: String },
        options: [{ type: String }],
        answer: { type: Schema.Types.Mixed },
        expectedOutput: { type: String },
        correctFeedback: { type: String },
        wrongFeedback: { type: String },
      },
    },
  ],
});

export default model<ILesson>("Lesson", lessonSchema);
