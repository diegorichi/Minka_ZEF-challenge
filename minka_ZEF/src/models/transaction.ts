import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { User } from "./user";
import { Account } from "./account";
import { Project } from "./project";


enum TransactionType {
  DEPOSIT = 'deposit', // related to account
  WITHDRAW = 'withdraw',  // related to account
  INVESTMENT = 'investment', // related to project
  EARNING = 'earning' // related to project
}


@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;

  @Column()
  date!: Date;

  @Column({ type: 'enum', enum: TransactionType })
  type!: string;

  @Column()
  amount!: number;

  @ManyToOne(() => Account)
  account!: Account

  @ManyToOne(() => Project)
  project?: Project

}