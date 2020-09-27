import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { Request, Response } from "express";
import { Database } from "./database";
import { RegisterDTO } from "./dto/request/register.dto";
import { User } from "./entity/User";
import { PasswordHash } from "./security/passwordHash";
import { AuthenticationDTO } from "./dto/response/authentication.dto";
import { UserDTO } from "./dto/response/user.dto";
import { JWT } from "./security/jwt";

const app = express();
app.use(express.json());

Database.initialize();

app.get("/", (req: Request, res: Response) => {
  try {
    res.send("Hello there");
  } catch (error) {
    console.log(error);
  }
});

app.post("/register", async (req: Request, res: Response) => {
  try {
    const body: RegisterDTO = req.body;

    // validate the body
    if (body.password !== body.repeatPassword) {
      throw new Error("Repeat password did't match the password");
    }

    // validate if the email is already being used
    if (await Database.userRepository.findOne({ email: body.email }))
      throw new Error("E-Mail is already being used");

    //store the user
    const user = new User();
    user.username = body.username;
    user.email = body.email;
    user.password = await PasswordHash.hashPassword(body.password);
    user.age = body.age;

    await Database.userRepository.save(user);
    const authenticationDTO: AuthenticationDTO = new AuthenticationDTO();
    const userDTO: UserDTO = new UserDTO();
    userDTO.id = user.id;
    userDTO.username = user.username;
    userDTO.email = user.email;
    userDTO.age = user.age;

    // implement token generation and refresh token
    const tokenAndRefreshToken = await JWT.generateTokenAndRefreshToken(user);
    authenticationDTO.user = userDTO;
    authenticationDTO.token = tokenAndRefreshToken.token;
    authenticationDTO.refreshToken = tokenAndRefreshToken.refreshToken;


    res.json(authenticationDTO);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(3001, () => console.log("listining on port", 3001));

createConnection()
  .then(async (connection) => {})
  .catch((error) => console.log(error));
