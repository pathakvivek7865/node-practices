import { Request, Response, NextFunction } from "express";
import { Unauthorized } from "../error/unauthorized";
import { JWT } from "./jwt";
import { BaseController } from "../controller/baseController";
import { Express } from "express";
import { Database } from "../database";
import { User } from "../entity/User";
import { NotFound } from "../error/notFound";

export class HttpExpress {
  public static retrieveBearerTokenFromRequest(req: Request) {
    let authoriziationHeader = req.headers.authorization;

    if (!authoriziationHeader)
      throw new Unauthorized("Authorization Header is not set");

    if (authoriziationHeader.startsWith("Bearer "))
      authoriziationHeader = authoriziationHeader.substring(
        "Bearer ".length,
        authoriziationHeader.length
      );

    return authoriziationHeader;
  }

  /**
   * Returns the user by the request
   * @param req Request object
   * @throws NotFound, if user does not exist
   */
  public static async getUserByRequest(req: Request) {
    const userId = this.getUserIdByRequest(req);

    const user = await Database.getRepository(User).findOne(userId);

    if(!user) throw new NotFound(`User with the id ${userId} was not found`);

    return user;
  }

  public static getUserIdByRequest(req: Request) {
    const token = this.retrieveBearerTokenFromRequest(req);

    return this.getUserIdByBearerToken(token);
  }

  public static getUserIdByBearerToken(token: string) {
    return JWT.getJwtPayloadValueByKey(token, "id");
  }

  public static wrapAsync(
    fn: (req: Request, resp: Response, next?: NextFunction) => any
  ) {
    return function (req: Request, resp: Response, next?: NextFunction) {
      fn(req, resp, next).catch(next);
    };
  }
}
