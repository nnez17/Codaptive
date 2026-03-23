export interface ExplanationSection {
  type: "explanation";
  content: string;
  example?: string;
}

export interface MCQQuestion {
  id: string;
  type: "mcq";
  question: string;
  code?: string;
  options: string[];
  answer: string;
  correctFeedback: string;
  wrongFeedback: string;
}

export interface FillQuestion {
  id: string;
  type: "fill";
  instruction: string;
  code: string;
  options: string[];
  answer: string | string[];
  expectedOutput: string;
  correctFeedback: string;
  wrongFeedback: string;
}

export type Question = MCQQuestion | FillQuestion;

export interface QuizSection {
  type: "quiz";
  questions: Question[];
}

export type Section = ExplanationSection | QuizSection;

export interface LessonData {
  id: string;
  title: string;
  level: string;
  sections: Section[];
}

export const levelMeta: Record<
  string,
  {
    name: string;
    lessons: { id: string; title: string; completed?: boolean }[];
  }
> = {
  beginner: {
    name: "Beginner Python",
    lessons: [
      { id: "1", title: "Hello World", completed: true },
      { id: "2", title: "Variables and Types", completed: true },
      { id: "3", title: "Strings and Numbers", completed: false },
      { id: "4", title: "Lists and Loops", completed: false },
      { id: "5", title: "Conditionals", completed: false },
    ],
  },
  intermediate: {
    name: "Intermediate Python",
    lessons: [
      { id: "1", title: "Functions", completed: false },
      { id: "2", title: "Dictionaries", completed: false },
      { id: "3", title: "Classes and OOP", completed: false },
    ],
  },
};

export const sampleQuestions = [
  {
    id: "1",
    type: "mcq",
    question: "What does print() do in Python?",
    options: [
      "Reads input",
      "Outputs text to the screen",
      "Defines a variable",
      "Imports a module",
    ],
    correct: 1,
  },
  {
    id: "2",
    type: "short",
    question: "Write the exact code to print the string 'Hello'.",
    correct: 'print("Hello")',
  },
];

export const levels = [
  {
    id: "beginner",
    name: "Beginner Python",
    desc: "Variables, loops, functions",
    lessons: 12,
    locked: false,
  },
  {
    id: "intermediate",
    name: "Intermediate Python",
    desc: "Data structures, OOP",
    lessons: 15,
    locked: false,
  },
  {
    id: "advanced",
    name: "Advanced Python",
    desc: "Decorators, async, testing",
    lessons: 10,
    locked: true,
  },
];
