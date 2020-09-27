import { HttpError } from "./httpError";

export class NotFound extends HttpError {
  public statusCode: number = 404;
}
