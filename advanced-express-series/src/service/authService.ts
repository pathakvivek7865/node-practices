import { LoginDTO } from "../dto/request/login.dto";
import { RefreshTokenDTO } from "../dto/request/refreshToken.dto";
import { Database } from "../database";
import { NotFound } from "../error/notFound";
import { JWT } from "../security/jwt";
import { plainToClass } from "class-transformer";
import { AuthenticationDTO } from "../dto/response/authentication.dto";
import { UserDTO } from "../dto/response/user.dto";
import { BadRequest } from "../error/badRequest";
import { Unauthorized } from "../error/unauthorized";
import { PasswordHash } from "../security/passwordHash";

export interface AuthService {
  login(body: LoginDTO);
  logout(token: string);
  refreshToken(body: RefreshTokenDTO);
}

export class AuthServiceImpl implements AuthService {
  public async login(body: LoginDTO) {
    // check if the email/user exists
    const user = await Database.userRepository.findOne({ email: body.email });
    if (!user) throw new NotFound("E-Mail does not exist");

    // check if the password is valid
    if (!(await PasswordHash.isPasswordValid(body.password, user.password)))
      throw new BadRequest("Password is invalid");

    // retrieve tokens
    const { token, refreshToken } = await JWT.generateTokenAndRefreshToken(
      user
    );

    // generate an authenticationDTO/response
    const authenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = plainToClass(UserDTO, user);
    authenticationDTO.token = token;
    authenticationDTO.refreshToken = refreshToken;

    return authenticationDTO;
  }

  public async logout(token: string) {
    // validate the retrieved jwt token
    if (!JWT.isTokenValid(token, true)) throw new Unauthorized("Unauthorized");

    // retrieve the connected refresh token
    const refreshToken = await JWT.getRefreshTokenByJwtToken(token);

    // update the refresh token and set invalidated to true
    await JWT.invalidateRefreshToken(refreshToken);
  }

  public async refreshToken(body: RefreshTokenDTO) {
    // check if the jwt token is valid & has not expired
    if (!JWT.isTokenValid(body.token))
      throw new Unauthorized("JWT is not valid");

    const jwtId = JWT.getJwtId(body.token);

    const user = await Database.userRepository.findOne(
      JWT.getJwtPayloadValueByKey(body.token, "id")
    );

    // check if the user exists
    if (!user) throw new NotFound("User does not exist");

    // fetch refresh token from db
    const refreshToken = await Database.refreshTokenRepository.findOne(
      body.refreshToken
    );

    // check if the refresh token exists and is linked to that jwt token‚
    if (!(await JWT.isRefreshTokenLinkedToToken(refreshToken, jwtId)))
      throw new Unauthorized("Token does not match with Refresh Token");

    // check if the refresh token has expired
    if (await JWT.isRefreshTokenExpired(refreshToken))
      throw new Unauthorized("Refresh Token has expired");

    // check if the refresh token was used or invalidated
    if (await JWT.isRefreshTokenUsedOrInvalidated(refreshToken))
      throw new Unauthorized("Refresh Token has been used or invalidated");

    refreshToken.used = true;

    await Database.refreshTokenRepository.save(refreshToken);

    // generate a fresh pair of token and refresh token
    const tokenResults = await JWT.generateTokenAndRefreshToken(user);

    // generate an authentication response
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    authenticationDTO.user = plainToClass(UserDTO, user);
    authenticationDTO.token = tokenResults.token;
    authenticationDTO.refreshToken = tokenResults.refreshToken;

    return authenticationDTO;
  }
}
