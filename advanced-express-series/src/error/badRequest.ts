import { HttpError } from "./httpError";

export class BadRequest extends HttpError {
    public statusCode: number = 400;
    
}