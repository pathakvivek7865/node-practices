import { Express, NextFunction, Request, Response } from "express";
import { BaseController } from "./controller/baseController";

type ErrorMiddlewareHandlerType = (
  err: any,
  req: Request,
  resp: Response,
  next: NextFunction
) => void;

type MiddlewareHandlerType = (
  req: Request,
  resp: Response,
  next: NextFunction
) => void;

export class AppBuilder {
  constructor(private readonly app: Express) {}

  public addController(controller: BaseController) {
    controller.initializeController(this.app);

    return this;
  }

  public addMiddleware(
    middlewareHandler: ErrorMiddlewareHandlerType | MiddlewareHandlerType
  ) {
    this.app.use(middlewareHandler);
    return this;
  }

  public build(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}
