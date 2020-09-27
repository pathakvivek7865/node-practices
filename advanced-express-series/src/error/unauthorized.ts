import { HttpError } from "./httpError";

export class Unauthorized extends HttpError {
  public statusCode: number = 401;
}
