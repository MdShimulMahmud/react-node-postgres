// src/entity/Score.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { User } from "./User";

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("float", {
    nullable: false,
  })
  percentageScore: number;

  @Column()
  totalMarks: number;

  @Column()
  totalQuestions: number;

  @ManyToOne(() => User, (user) => user.scores, {
    onDelete: "CASCADE",
  })
  user: User;

  @ManyToOne(() => Quiz, (quiz) => quiz.scores, {
    onDelete: "CASCADE",
  })
  quiz: Quiz;

  @CreateDateColumn()
  createdAt: Date;
}
