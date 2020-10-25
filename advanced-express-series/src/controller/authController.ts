import { BaseController } from "./baseController";
import { Request, NextFunction, Response } from "express";
import { LoginDTO } from "../dto/request/login.dto";
import { Database } from "../database";
import { NotFound } from "../error/notFound";
import { BadRequest } from "../error/badRequest";
import { JWT } from "../security/jwt";
import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { HttpExpress } from "../security/httpExpress";
import { Unauthorized } from "../error/unauthorized";
import { RefreshTokenDTO } from "../dto/request/refreshToken.dto";
import { plainToClass } from "class-transformer";
import { AuthService, AuthServiceImpl } from "../service/authService";

export class AuthController extends BaseController {
  private readonly authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthServiceImpl();
  }

  public initializeEndpoints() {
    this.addAsyncEndpoint("POST", "/login", this.login);
    this.addAsyncEndpoint("POST", "/logout", this.logout);
    this.addAsyncEndpoint("POST", "/refresh/token", this.refreshToken);
  }

  public login = async (req: Request, resp: Response, next: NextFunction) => {
    const body: LoginDTO = req.body;

    const authenticationDTO = await this.authService.login(body);

    resp.json(authenticationDTO);
  };

  public logout = async (req: Request, resp: Response) => {
    // retrieve the jwt token from the request header (authorization header)
    const token = HttpExpress.retrieveBearerTokenFromRequest(req);

    await this.authService.logout(token);

    resp.json({ message: "Logout successfully" });
  };

  public refreshToken = async (req: Request, resp: Response) => {
    const body: RefreshTokenDTO = req.body;

    const authenticationDTO = await this.authService.refreshToken(body);

    resp.json(authenticationDTO);
  };
}
