// src/data-source.ts
import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Question } from "./entity/Question";
import { Quiz } from "./entity/Quiz";
import { Score } from "./entity/Score";
import { User } from "./entity/User";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [Quiz, Question, User, Score],
  migrations: [],
  subscribers: [],
});
