import { Request, Response, NextFunction } from "express";
import { JWT } from "../security/jwt";
import { HttpExpress } from "../security/httpExpress";
import { Unauthorized } from "../error/unauthorized";

export default function(req: Request, resp: Response, next: NextFunction) {
    // retrieve the token
    const token = HttpExpress.retrieveBearerTokenFromRequest(req);

    // validate the token, we want to thow an unauthorized error if token was invalid
    if(!JWT.isTokenValid(token)) throw new Unauthorized("JWT is not valid");

    // execute next if the token is valid
    next();
}