// src/routes/quiz.ts
import { NextFunction, Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import { Question } from "../entity/Question";
import { Quiz } from "../entity/Quiz";

const router = Router();

interface QuizRequest {
  title: string;
  description: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: number;
  }[];
}

router.post(
  "/quizzes",
  async (req: Request<{}, {}, QuizRequest>, res: Response) => {
    const { title, description, questions } = req.body;

    const quizRepository = AppDataSource.getRepository(Quiz);
    const questionRepository = AppDataSource.getRepository(Question);

    const quiz = new Quiz();
    quiz.title = title;
    quiz.description = description;

    const savedQuiz = await quizRepository.save(quiz);

    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new Question();
        question.text = q.text;
        question.options = q.options;
        question.correctAnswer = q.correctAnswer;
        question.quiz = savedQuiz;
        return await questionRepository.save(question);
      })
    );

    res.json({ ...savedQuiz, questions: savedQuestions });
  }
);

router.post(
  "/quizzes/:quizId",
  async (req: Request, res: Response): Promise<void | any> => {
    const { questions } = req.body;

    const quizRepository = AppDataSource.getRepository(Quiz);
    const questionRepository = AppDataSource.getRepository(Question);

    const foundQuiz = await quizRepository.findOne({
      where: {
        id: parseInt(req.params.quizId),
      },
    });

    if (!foundQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const savedQuestions = await Promise.all(
      questions.map(
        async (q: {
          text: string;
          options: string[];
          correctAnswer: number;
        }) => {
          const question = new Question();
          question.text = q.text;
          question.options = q.options;
          question.correctAnswer = q.correctAnswer;

          question.quiz = foundQuiz;

          return await questionRepository.save(question);
        }
      )
    );

    res.json({ questions: savedQuestions });
  }
);

router.put(
  "/quizzes/:quizId",
  async (req: Request, res: Response): Promise<void | any> => {
    const { questions } = req.body;

    const quizRepository = AppDataSource.getRepository(Quiz);
    const questionRepository = AppDataSource.getRepository(Question);

    const ExistingQuiz = await quizRepository.findOne({
      where: {
        id: parseInt(req.params.quizId),
      },
    });

    if (!ExistingQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quiz = new Quiz();

    const savedQuestions = await Promise.all(
      questions.map(
        async (q: {
          text: string;
          options: string[];
          correctAnswer: number;
        }) => {
          const question = new Question();
          question.text = q.text;
          question.options = q.options;
          question.correctAnswer = q.correctAnswer;
          question.quiz = ExistingQuiz;
          return await questionRepository.save(question);
        }
      )
    );

    res.json({ ...ExistingQuiz, questions: savedQuestions });
  }
);

router.get("/quizzes", async (_req: Request, res: Response) => {
  const quizRepository = AppDataSource.getRepository(Quiz);
  const quizzes = await quizRepository.find({
    select: ["id", "title", "description"],
  });
  res.json(quizzes);
});

router.get(
  "/quizzes/:id",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id) || id <= 0) {
      res.status(400).json({ message: "Invalid quiz ID" });
      return;
    }

    try {
      const quizRepository = AppDataSource.getRepository(Quiz);
      const quiz = await quizRepository.findOne({
        where: { id },
        relations: ["questions"],
      });

      if (!quiz) {
        res.status(404).json({ message: "Quiz not found" });
        return;
      }

      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);
export default router;
