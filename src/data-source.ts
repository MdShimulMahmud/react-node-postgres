import "reflect-metadata";
import { DataSource } from "typeorm";
import { Comment } from "./entity/Comment.js";
import { Post } from "./entity/Post.js";
import { User } from "./entity/User.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Post, Comment],
  migrations: [],
  subscribers: [],
});
