import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Database } from "./database";
import { UsersController } from "./controller/usersController";
import { AuthController } from "./controller/authController";
import { errorMiddleware } from "./middleware/error.middleware";
import { AppBuilder } from "./appBuilder";
import { SkillsController } from "./controller/skillsController";

const app = express();
const appBuilder = new AppBuilder(app);
Database.initialize();

appBuilder
  .addMiddleware(express.json())
  .addController(new UsersController())
  .addController(new AuthController())
  .addController(new SkillsController())
  .addMiddleware(errorMiddleware)
  .build(4000, () => console.log("Listening on port", 4000));
