import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
  OneToMany,
  BaseEntity,
} from "typeorm";
import { Member } from "./member.entity";
import { Transaction } from "./transaction.entity";
import { Currency } from "./currency.entity";

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => Member, { nullable: false, eager: true })
  owner!: Member;

  @ManyToOne(() => Currency, {
    nullable: false,
    cascade: ["update"],
    eager: true,
  })
  @JoinColumn()
  currency!: Currency;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  balance!: number;

  @OneToMany(() => Transaction, (transaction) => transaction.project)
  transactions!: Transaction[];
}
