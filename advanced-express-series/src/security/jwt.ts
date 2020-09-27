import * as jwt from "jsonwebtoken";
import { User } from "../entity/User";
import { v4 as uuidv4 } from "uuid";
import { RefreshToken } from "../entity/RefreshToken";
import * as moment from "moment";
import { Database } from "../database";
import { RefreshTokenDTO } from "../dto/request/refreshToken.dto";

export class JWT {
  // specify a secret key for jwt generation
  private static JWT_SECRET = "123456";

  public static async generateTokenAndRefreshToken(user: User) {
    // specify a payload thats holds the users id (and) email
    const payload = {
      id: user.id,
      email: user.email,
    };

    const jwtId = uuidv4();

    const token = jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: "1h", // specify when does the token expires 1hour
      jwtid: jwtId, // specify jwtid (an id of that token) (needed for the refresh token, as a refresh token only points to one single unique token)
      subject: user.id.toString(), // the subject should be the users id (primary key)
    });

    // create a refresh token
    const refreshToken = await this.generateRefreshTokenForUserAndToken(
      user,
      jwtId
    );

    // link that token with the refresh token

    return { token, refreshToken };
  }

  private static async generateRefreshTokenForUserAndToken(
    user: User,
    jwtId: string
  ) {
    // create a new record of refresh token
    const refreshToken = new RefreshToken();
    refreshToken.user = user;
    refreshToken.jwtId = jwtId;
    // set the expiry date of the refresh token for example 10 days
    refreshToken.expiryDate = moment().add(10, "d").toDate();

    // store this refresh token
    await Database.refreshTokenRepository.save(refreshToken);

    return refreshToken.id;
  }

  public static isTokenValid(token: string, ignoreExpiration: boolean = false) {
    try {
      jwt.verify(token, this.JWT_SECRET, {
        ignoreExpiration: ignoreExpiration,
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  public static getJwtId(token: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken["jti"];
  }

  public static async isRefreshTokenLinkedToToken(
    refreshToken: RefreshToken,
    jwtId: string
  ) {
    if (!refreshToken) return false;

    if (refreshToken.jwtId !== jwtId) return false;

    return true;
  }

  public static async isRefreshTokenExpired(refreshToken: RefreshToken) {
    if (moment().isAfter(refreshToken.expiryDate)) return true;

    return false;
  }

  public static async isRefreshTokenUsedOrInvalidated(
    refreshToken: RefreshToken
  ) {
    return refreshToken.used || refreshToken.invalidated;
  }

  public static getJwtPayloadValueByKey(token: string, key: string) {
    const decodedToken = jwt.decode(token);
    return decodedToken[key];
  }

  public static async getRefreshTokenByJwtToken(token: string) {
    // retrieve the jti/jwt-id from that token
    const jti = this.getJwtId(token);

    // retrieve the refresh token that points to this jwt-id
    const refreshToken = await Database.refreshTokenRepository.findOne({
      jwtId: jti,
    });

    if (!refreshToken) throw new Error("Refresh token does not exist");

    return refreshToken;
  }

  public static async invalidateRefreshToken(refreshToken: RefreshToken) {
    refreshToken.invalidated = true;

    await Database.refreshTokenRepository.save(refreshToken);
  }
}
