// src/index.ts
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { AppDataSource } from "./data-source";
// import quizRoutes from "./routes/quiz";
import appsRouter from "./app";
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// app.use("/api", quizRoutes);

app.use("/api", appsRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
