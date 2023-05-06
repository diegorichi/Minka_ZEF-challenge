import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { Currency } from "./currency.entity";

@Entity()
export class DomainOwner extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Currency, (currency) => currency.owner)
  currencies!: Currency[];

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;
}
