import { BaseController } from "./baseController";
import { Request, Response } from "express";
import { CreateSkillDTO } from "../dto/request/createSkill.dto";
import { BadRequest } from "../error/badRequest";
import jwtMiddleware from "../middleware/jwt.middleware";
import { UserSkill } from "../entity/UserSkill";
import { HttpExpress } from "../security/httpExpress";
import { Database } from "../database";
import { plainToClass } from "class-transformer";
import { UserSkillDTO } from "../dto/response/userSkill.dto";
import { HttpError } from "../error/httpError";
import { NotFound } from "../error/notFound";
import { UpdateSkillDTO } from "../dto/request/updateSkill.dto";
import { SkillsService, SkillsServiceImpl } from "../service/skillsService";

export class SkillsController extends BaseController {
  private readonly skillsService: SkillsService;

  constructor() {
    super();
    this.skillsService = new SkillsServiceImpl();
  }

  protected initializeEndpoints() {
    this.addAsyncEndpoint(
      "POST",
      "/users/skills",
      this.createSkill,
      jwtMiddleware
    );
    this.addAsyncEndpoint("GET", "/users/skills", this.getAll, jwtMiddleware);
    this.addAsyncEndpoint(
      "GET",
      "/users/skills/:id",
      this.getOne,
      jwtMiddleware
    );

    this.addAsyncEndpoint(
      "DELETE",
      "/users/skills/:id",
      this.deleteOne,
      jwtMiddleware
    );

    this.addAsyncEndpoint(
      "PUT",
      "/users/skills/:id",
      this.updateOne,
      jwtMiddleware
    );
  }

  public createSkill = async (req: Request, resp: Response) => {
    // CreateSkillDTO
    const body: CreateSkillDTO = req.body;
    const user = await HttpExpress.getUserByRequest(req);

    const skillDTO = await this.skillsService.createSkill(body, user);

    resp.json(skillDTO);
  };

  public getAll = async (req: Request, resp: Response) => {
    // get the user
    const user = await HttpExpress.getUserByRequest(req);
    const userSkillsDTO = await this.skillsService.getAll(user);

    // return
    resp.json(userSkillsDTO);
  };

  public getOne = async (req: Request, resp: Response) => {
    const user = await HttpExpress.getUserByRequest(req);
    const skillId = Number(req.params.id);

    const userSkillDTO = await this.skillsService.getOne(user, skillId);

    resp.json(userSkillDTO);
  };

  public deleteOne = async (req: Request, resp: Response) => {
    const user = await HttpExpress.getUserByRequest(req);
    const skillId = Number(req.params.id);

    await this.skillsService.deleteOne(user, skillId);

    // return an empty response, with http status 204 (NO-Content)
    resp.status(204).send();
  };

  public updateOne = async (req: Request, resp: Response) => {
    const body: UpdateSkillDTO = req.body;
    const skillId = Number(req.params.id);
    const user = await HttpExpress.getUserByRequest(req);

    const userSkillDTO = await this.skillsService.updateOne(
      body,
      user,
      skillId
    );

    resp.json(userSkillDTO);
  };
}
