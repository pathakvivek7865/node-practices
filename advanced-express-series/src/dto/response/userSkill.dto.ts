import { Expose, Exclude } from "class-transformer";

@Exclude()
export class UserSkillDTO {
  @Expose()
  id: number;
  @Expose()
  name: string;
}
