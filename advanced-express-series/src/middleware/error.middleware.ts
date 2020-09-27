import { Request, Response, NextFunction } from "express";
import { HttpError } from "../error/httpError";

export const errorMiddleware = (
  err,
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) {
    const httpError: HttpError = <HttpError>err;

    resp.status(httpError.statusCode).json({
      statusCode: httpError.statusCode,
      message: httpError.message,
    });

    return;
  }

  resp.status(500).json({
    statusCode: 500,
    message: err.message,
  });
};
