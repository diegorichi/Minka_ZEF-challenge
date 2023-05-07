import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { Transaction } from "./transaction.entity";

@Entity()
export class Account extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "numeric", precision: 10, scale: 4 })
  balance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.id)
  transactions!: Transaction[];

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
}
