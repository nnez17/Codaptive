import express from "express";
import mongoose from "mongoose";
import User, { type IUser } from "../models/User";
import Question, { type IQuestion } from "../models/Question";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import { updateUserProgress } from "../services/progressService";

const router = express.Router();

router.post("/create", verifyToken, isAdmin, async (req, res) => {
  try {
    const {
      questionText,
      type,
      difficulty,
      options,
      correctAnswer,
      explanation,
      tags,
      moduleId,
    } = req.body;

    if (!questionText || !type || !correctAnswer || !moduleId) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields",
      });
    }

    const newQuestion = {
      questionId: new mongoose.Types.ObjectId(),
      questionText,
      type,
      difficulty: difficulty || "medium",
      options: options || [],
      correctAnswer,
      explanation: explanation || "",
      tags: tags || [],
      moduleId,
    };

    await Question.create(newQuestion);

    res.status(201).json({
      status: "success",
      message: "Question created successfully",
    });
  } catch (err) {
    console.error("Failed to create question");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.get("/list", verifyToken, isAdmin, async (req, res) => {
  try {
    const { moduleId } = req.query;

    if (!moduleId || typeof moduleId !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Missing or invalid moduleId",
      });
    }

    if (!mongoose.isValidObjectId(moduleId)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid Module ID format",
      });
    }

    const questions = await Question.find<IQuestion>({ moduleId }).lean();

    res.status(200).json({
      status: "success",
      results: questions.length,
      data: questions,
    });
  } catch (err) {
    console.error("Failed to fetch questions");
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.put("/update/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const questionId = req.params.id;
    const updateData = req.body;

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      updateData,
      { new: true },
    );

    if (!updatedQuestion) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (err) {
    console.error("Failed to update question");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.delete("/delete/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const questionId = req.params.id;

    const deletedQuestion = await Question.findByIdAndDelete(questionId);

    if (!deletedQuestion) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Question deleted successfully",
    });
  } catch (err) {
    console.error("Failed to delete question");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { questionId, userAnswer } = req.body;
    const userId = req.userId as string;

    const question = (await Question.findById(questionId).select(
      "+correctAnswer +explanation",
    )) as IQuestion;
    const { lessonId, moduleId } = question as any;

    if (!question) {
      return res.status(404).json({
        status: "fail",
        message: "Question not found",
      });
    }

    const isCorrect = question.correctAnswer === userAnswer;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    if (isCorrect) {
      const xpGained = question.xpReward || 100;
      user.stats.xp += xpGained;
      user.stats.streak += 1;

      if (user.stats.xp >= user.stats.maxXP) {
        user.stats.level += 1;
        user.stats.xp -= user.stats.maxXP;
        user.stats.maxXP = Math.round(user.stats.maxXP * 1.2);
      }

      await updateUserProgress(userId, lessonId, moduleId);
    } else {
      user.stats.streak = 0;
    }

    await user.save();

    res.status(200).json({
      status: "success",
      message: isCorrect ? "Correct answer!" : "Wrong answer.",
    });
  } catch (err) {
    console.error("Failed to submit question");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.get("/next", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { moduleId } = req.query;

    if (!moduleId || typeof moduleId !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Missing moduleId",
      });
    }

    const user = await User.findById(userId).select("stats");
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    let targetDifficulty = "EASY";
    const streak = user.stats?.streak || 0;

    if (streak >= 3 && streak <= 5) targetDifficulty = "MEDIUM";
    else if (streak > 5) targetDifficulty = "HARD";

    const questions = await Question.aggregate([
      {
        $match: {
          moduleId,
          difficulty: targetDifficulty,
        },
      },
      { $sample: { size: 1 } },
    ]);

    if (questions.length === 0) {
      const fallbackQuestions = await Question.aggregate([
        { $match: { moduleId } },
        { $sample: { size: 1 } },
      ]);

      if (fallbackQuestions.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "No questions found for this module",
        });
      }

      return res.status(200).json({
        status: "success",
        adaptiveLevel: "FALLBACK",
        data: fallbackQuestions[0],
      });
    }

    res.status(200).json({
      status: "success",
      adaptiveLevel: targetDifficulty,
      data: questions[0],
    });
  } catch (err) {
    console.error("Failed to get next question");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

export default router;
