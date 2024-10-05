import bcrypt from "bcrypt";
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Quiz } from "./Quiz";
import { Score } from "./Score";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  @OneToMany(() => Score, (score) => score.user, { onDelete: "CASCADE" })
  scores: Score[];

  @OneToMany(() => Quiz, (quiz) => quiz.creator, { onDelete: "CASCADE" })
  quizzes: Quiz[];
}
