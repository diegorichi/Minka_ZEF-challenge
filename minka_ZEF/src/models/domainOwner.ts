import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "./user";
import { Currency } from "./currency";


@Entity()
export class DomainOwner {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Currency, currency => currency.owner)
  currencies!: Currency[];

  @OneToOne(() => User,  {eager: true})
  @JoinColumn()
  user!: User;
}