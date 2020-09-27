import { BaseController } from "./baseController";
import { Request, Response } from "express";
import { RegisterDTO } from "../dto/request/register.dto";

import { HttpExpress } from "../security/httpExpress";
import jwtMiddleware from "../middleware/jwt.middleware";
import { UsersService, UsersServiceImpl } from "../service/usersService";

export class UsersController extends BaseController {
  private readonly usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersServiceImpl();
  }

  public initializeEndpoints() {
    this.addAsyncEndpoint("POST", "/register", this.register);
    this.addAsyncEndpoint("GET", "/users/me", this.getMe, jwtMiddleware);
  }

  public register = async (req: Request, resp: Response) => {
    const body: RegisterDTO = req.body;

    const authenticationDTO = await this.usersService.register(body);

    resp.json(authenticationDTO);
  };

  public getMe = async (req: Request, resp: Response) => {
    // fetch the user by this id
    const user = await HttpExpress.getUserByRequest(req);

    const userDTO = await this.usersService.getMe(user);

    resp.json(userDTO);
  };
}
