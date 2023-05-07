import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user.entity";
import { Account } from "./account.entity";
import { Project } from "./project.entity";
import {
  DepositStrategy,
  EarningStrategy,
  InvestmentStrategy,
  WithdrawStrategy,
} from "./transaction.strategy";

export enum TransactionType {
  DEPOSIT = "deposit", // to account
  WITHDRAW = "withdraw", // from account
  INVESTMENT = "investment", // from account to project
  EARNING = "earning", // from project to account
}

export const transactionStrategies = {
  [TransactionType.DEPOSIT]: new DepositStrategy(),
  [TransactionType.WITHDRAW]: new WithdrawStrategy(),
  [TransactionType.INVESTMENT]: new InvestmentStrategy(),
  [TransactionType.EARNING]: new EarningStrategy(),
};

type TransactionTypeKey = keyof typeof transactionStrategies;

@Entity()
export class Transaction extends BaseEntity {
  execute(): void {
    const strategy = transactionStrategies[this.type as TransactionTypeKey];

    if (!strategy) {
      throw new Error("Invalid transaction type.");
    }

    strategy.execute(this);
  }

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  user!: User;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  date!: Date;

  @Column({ type: "enum", enum: TransactionType })
  type!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  amount!: number;

  @ManyToOne(() => Account, {cascade:["update"]})
  account!: Account;

  @ManyToOne(() => Project, {cascade:["update"]})
  project?: Project;
}
