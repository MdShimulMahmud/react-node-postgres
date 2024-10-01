import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Question } from "../entity/Question";
import { Quiz } from "../entity/Quiz";

export class QuestionController {
  private questionRepository = AppDataSource.getRepository(Question);
  private quizRepository = AppDataSource.getRepository(Quiz);

  async createQuestion(req: Request, res: Response): Promise<void | any> {
    try {
      const quizId = parseInt(req.params.quizId);
      const { text, options, correctAnswer } = req.body;

      // Validate input
      if (
        !text ||
        !options ||
        options.length === 0 ||
        correctAnswer === undefined
      ) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }

      const question = this.questionRepository.create({
        text,
        options,
        correctAnswer,
        quiz,
      });

      await this.questionRepository.save(question);
      res.status(201).json(question);
    } catch (error) {
      console.error("Error creating question:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add other question-related methods as needed
}
