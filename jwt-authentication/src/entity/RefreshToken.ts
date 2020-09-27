import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne((type) => User, (user) => user.refreshTokens)
  user: User;

  @Column()
  jwtId: string;

  @Column({ default: false })
  used: boolean;

  @Column({ default: false })
  invalidated: boolean;

  @Column()
  expiryDate: Date;

  @CreateDateColumn()
  creationDate: Date;

  @CreateDateColumn()
  updateDate: Date;
}
