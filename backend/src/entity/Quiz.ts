// src/entity/Quiz.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question";

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
}
