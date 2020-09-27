export abstract class HttpError implements Error {
  public name: string;
  public message: string;
  public stack?: string;
  public abstract statusCode: number;

  constructor(message: string) {
    this.message = message;
  }
}
