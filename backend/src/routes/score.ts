import express from "express";
import { ScoreController } from "../controllers/ScoreController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const scoreController = new ScoreController();

router.post(
  "/:quizId/scores",
  authMiddleware,
  scoreController.createScore.bind(scoreController)
);

export default router;
