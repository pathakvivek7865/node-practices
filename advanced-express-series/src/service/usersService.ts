import { RegisterDTO } from "../dto/request/register.dto";
import { User } from "../entity/User";
import { Database } from "../database";
import { plainToClass } from "class-transformer";
import { UserDTO } from "../dto/response/user.dto";
import { BadRequest } from "../error/badRequest";
import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { JWT } from "../security/jwt";
import { PasswordHash } from "../security/passwordHash";

export interface UsersService {
  register(body: RegisterDTO);
  getMe(user: User);
}

export class UsersServiceImpl implements UsersService {
  public async getMe(user: User) {
    const userDTO = plainToClass(UserDTO, user);

    return userDTO;
  }

  public async register(body: RegisterDTO) {
    // validate the body
    if (body.password !== body.repeatPassword)
      throw new BadRequest("Repeat password does not match the password");

    // validate if the email is already being used
    if (await Database.userRepository.findOne({ email: body.email }))
      throw new BadRequest("E-Mail is already being used");

    // store the user
    const user = new User();
    user.username = body.username;
    user.email = body.email;
    user.password = await PasswordHash.hashPassword(body.password);
    user.age = body.age;

    await Database.userRepository.save(user);

    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    const userDTO: UserDTO = plainToClass(UserDTO, user);

    // implement token generation and refresh token
    const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(user);
    authenticationDTO.user = userDTO;
    authenticationDTO.token = tokenAndRefreshToken.token;
    authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;

    return authenticationDTO;
  }
}
