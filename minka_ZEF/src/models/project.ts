import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Member } from "./member";
import { Transaction } from "./transaction";
import { Currency } from "./currency";


enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  INVESTMENT = 'investment',
  EARNING = 'earning'
}


@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Member)
  @JoinColumn()
  owner!: Member;

  @Column()
  date!: Date;

  @ManyToOne(() => Currency)
  currency!: Currency

  @Column({type:"bigint", precision: 30, scale: 4 })
  balance!: number;

  @OneToMany(() => Transaction, transaction => transaction.project)
  transations!: Transaction[];

}