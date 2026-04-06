import express from "express";
import Lesson from "../models/Lesson";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.post("/lessons", verifyToken, isAdmin, async (req, res) => {
  try {
    const { lessonId, title, level, pages } = req.body;

    if (!lessonId || !title || !pages || !Array.isArray(pages)) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields: lessonId, title, pages (array)",
      });
    }

    const newLesson = await Lesson.create({ lessonId, title, level, pages });

    res.status(201).json({
      status: "success",
      data: newLesson,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Lesson with this ID already exists",
      });
    }

    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.get("/lessons", async (req, res) => {
  try {
    const lessons = await Lesson.find().lean();
    res.status(200).json({
      status: "success",
      results: lessons.length,
      data: lessons,
    });
  } catch (err) {
    console.error("Failed to fetch lessons");
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
});

router.get("/lessons/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findOne({ lessonId: id }).lean();

    if (!lesson) {
      return res.status(404).json({
        status: "fail",
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: lesson,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.put("/lessons/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { lessonId, title, level, pages } = req.body;
    const { id } = req.params;

    if (!lessonId || !title || !pages || !Array.isArray(pages)) {
      return res.status(400).json({
        status: "fail",
        message: "Missing required fields: lessonId, title, pages (array)",
      });
    }

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid lesson ID",
      });
    }

    const updatedLesson = await Lesson.findOneAndUpdate(
      { lessonId: id },
      { lessonId, title, level, pages },
      { new: true, runValidators: true },
    ).lean();

    if (!updatedLesson) {
      return res.status(404).json({
        status: "fail",
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: updatedLesson,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

router.delete("/lessons/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Invalid lesson ID",
      });
    }

    const lesson = await Lesson.findOneAndDelete({ lessonId: id }).lean();

    if (!lesson) {
      return res.status(404).json({
        status: "fail",
        message: "Lesson not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Lesson deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

export default router;
