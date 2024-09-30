import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AppDataSource } from "./data-source.js";
import { User } from "./entity/User.js";
import { Routes } from "./routes.js";
AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();

    dotenv.config();

    app.use(
      express.json({
        urlencoded: true,
      })
    );

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here

    // register routes
    app.get("/users", async function (req: Request, res: Response) {
      const users = await AppDataSource.getRepository(User).find();
      res.json(users);
    });

    app.get("/users/:id", async function (req: Request, res: Response) {
      const results = await AppDataSource.getRepository(User).findOneBy({
        id: req.params.id,
      });
      return res.send(results);
    });

    app.post("/users", async function (req: Request, res: Response) {
      const user = await AppDataSource.getRepository(User).create(req.body);
      const results = await AppDataSource.getRepository(User).save(user);
      return res.send(results);
    });

    app.put("/users/:id", async function (req: Request, res: Response) {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: req.params.id,
      });
      AppDataSource.getRepository(User).merge(user, req.body);
      const results = await AppDataSource.getRepository(User).save(user);
      return res.send(results);
    });

    app.delete("/users/:id", async function (req: Request, res: Response) {
      const results = await AppDataSource.getRepository(User).delete(
        req.params.id
      );
      return res.send(results);
    });
    // ...

    // start express server

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log(error));
