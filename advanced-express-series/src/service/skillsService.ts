import { plainToClass } from "class-transformer";
import { Database } from "../database";
import { CreateSkillDTO } from "../dto/request/createSkill.dto";
import { UpdateSkillDTO } from "../dto/request/updateSkill.dto";
import { UserSkillDTO } from "../dto/response/userSkill.dto";
import { User } from "../entity/User";
import { UserSkill } from "../entity/UserSkill";
import { BadRequest } from "../error/badRequest";
import { NotFound } from "../error/notFound";

export interface SkillsService {
  createSkill(body: CreateSkillDTO, user: User): Promise<UserSkillDTO>;
  getAll(user: User);
  getOne(user: User, skillId: number);
  deleteOne(user: User, skillId: number);
  updateOne(body: UpdateSkillDTO, user: User, skillId: number);
}

export class SkillsServiceImpl implements SkillsService {
  public async createSkill(
    body: CreateSkillDTO,
    user: User
  ): Promise<UserSkillDTO> {
    // validate
    if (body.name.trim().length === 0)
      throw new BadRequest("The skill name has to be set");

    // store in the database
    const skill = new UserSkill();
    skill.name = body.name;

    skill.user = user;

    await Database.getRepository(UserSkill).save(skill);

    // transform to SkillDTO
    const skillDTO = plainToClass(UserSkillDTO, skill);

    return skillDTO;
  }

  public async getAll(user: User) {
    // fetch all skills of this user
    const userSkills = await Database.getRepository(UserSkill).find({
      user: { id: user.id },
    });

    // transform all skills to SkillsDTO Array
    const userSkillsDTO = plainToClass(UserSkillDTO, userSkills);

    return userSkillsDTO;
  }

  public async getOne(user: User, skillId: number) {
    const userSkill = await this.getSkillByIdAndUserId(skillId, user.id);

    // transform the userSkill to DTO
    const userSkillDTO = plainToClass(UserSkillDTO, userSkill);

    return userSkillDTO;
  }

  public async deleteOne(user: User, skillId: number) {
    // check if the skill exists
    const userSkill = await this.getSkillByIdAndUserId(skillId, user.id);

    // remove the skill
    await Database.getRepository(UserSkill).remove(userSkill);
  }

  public async updateOne(body: UpdateSkillDTO, user: User, skillId: number) {
    // fetch the skill and check if it exists
    const userSkill = await this.getSkillByIdAndUserId(skillId, user.id);

    // check if the skill name is empty
    if (userSkill.name.trim().length === 0)
      throw new BadRequest("Please enter the skill name");

    // update the skill name
    userSkill.name = body.name;
    await Database.getRepository(UserSkill).save(userSkill);

    // return updated dto
    const userSkillDTO = plainToClass(UserSkillDTO, userSkill);

    return userSkillDTO;
  }

  /**
   * @throws NotFound, if user skill does not exist
   * @param skillId Skill ID
   * @param userId User ID
   */
  private async getSkillByIdAndUserId(skillId: number, userId: number) {
    // fetch the skill by user id and skill id
    const userSkill = await Database.getRepository(UserSkill).findOne({
      id: skillId,
      user: { id: userId },
    });

    // check if the skill does not exist
    if (!userSkill)
      throw new NotFound(`This user skill does not exist ${skillId}`);

    return userSkill;
  }
}
