import { Exclude, Expose } from "class-transformer";

@Exclude()
export class UserDTO {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  email: string;
  @Expose()
  age: number;
}
