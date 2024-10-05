import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Quiz } from "../entity/Quiz";
import { Score } from "../entity/Score";
import { User } from "../entity/User";

interface AuthRequest extends Request {
  user?: User;
}

export class ScoreController {
  private scoreRepository = AppDataSource.getRepository(Score);

  async createScore(req: AuthRequest, res: Response): Promise<void | any> {
    try {
      const { quizId } = req.params;

      const { totalMarks, totalQuestions } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const quizRepository = AppDataSource.getRepository(Quiz);

      const user = await userRepository.findOneBy({ id: req.user?.id });
      const quiz = await quizRepository.findOneBy({ id: Number(quizId) });

      if (!user || !quiz) {
        return res.status(404).json({ message: "User or Quiz not found" });
      }
      const percentageScore = (totalMarks / totalQuestions) * 100;

      const newScore = this.scoreRepository.create({
        percentageScore,
        totalMarks,
        totalQuestions,
        user,
        quiz,
      });

      await this.scoreRepository.save(newScore);
      res.status(201).json(newScore);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Error saving score", error: error.message });
    }
  }
}
