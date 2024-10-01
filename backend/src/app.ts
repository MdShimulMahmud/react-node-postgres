import express from "express";
import { QuestionController } from "./controllers/QuestionController";
import { QuizController } from "./controllers/QuizController";

const router = express.Router();
const quizController = new QuizController();
const questionController = new QuestionController();

// Quiz routes
router.post("/quizzes", quizController.createQuiz.bind(quizController));
router.get("/quizzes", quizController.getAllQuizzes.bind(quizController));
router.get("/quizzes/:id", quizController.getQuiz.bind(quizController));

// Question routes
router.post(
  "/quizzes/:quizId/questions",
  questionController.createQuestion.bind(questionController)
);

export default router;
