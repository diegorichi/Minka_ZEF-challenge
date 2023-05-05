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
import { Member } from "./member";
import { Transaction } from "./transaction";
import { Currency } from "./currency";




@Entity()
export class Project  extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string

  @Column({nullable : true})
  description!: string

  @OneToOne(() => Member, { nullable: false })
  @JoinColumn()
  owner!: Member;

  @ManyToOne(() => Currency, { nullable: false })
  @JoinColumn()
  currency!: Currency

  @Column({ type: "numeric", precision: 10, scale: 2})
  balance!: number;

  @OneToMany(() => Transaction, transaction => transaction.project)
  transations!: Transaction[];

}