// src/entity/Quiz.ts
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Question } from "./Question";
import { Score } from "./Score";
import { User } from "./User";

@Entity()
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    length: 100,
  })
  title: string;

  @Column({
    nullable: false,
    length: 1000,
  })
  description: string;

  @OneToMany(() => Question, (question) => question.quiz)
  questions: Question[];

  @ManyToOne(() => User, (user) => user.quizzes)
  creator: User;

  @OneToMany(() => Score, (score) => score.quiz, {
    onDelete: "CASCADE",
  })
  scores: Score[];
}
