import { UserDTO } from "./user.dto";

export class AuthenticationDTO {
  token: string;
  refreshToken: string;
  user: UserDTO;
}
