import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Quiz } from "../entity/Quiz";

export class QuizController {
  private quizRepository = AppDataSource.getRepository(Quiz);

  async createQuiz(req: Request, res: Response): Promise<void | any> {
    try {
      const { title, description, questions } = req.body;

      // Validate input
      if (!title || !description) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const quiz = this.quizRepository.create({
        title,
        description,
      });
      await this.quizRepository.save(quiz);
      res.status(201).json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getQuiz(req: Request, res: Response): Promise<void | any> {
    try {
      const id = parseInt(req.params.id);
      const quiz = await this.quizRepository.findOne({
        where: { id },
        relations: ["questions"],
      });
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllQuizzes(req: Request, res: Response): Promise<void | any> {
    try {
      const quiz = await this.quizRepository.find({
        relations: ["questions"],
      });
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Add other quiz-related methods as needed
}
