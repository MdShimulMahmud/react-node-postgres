// src/entity/Question.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Quiz } from "./Quiz";

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    length: 255,
  })
  text: string;

  @Column("simple-array")
  options: string[];

  @Column({
    nullable: false,
  })
  correctAnswer: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
  })
  quiz: Quiz;
}
