import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user";
import { Transaction } from "./transaction";


@Entity()
export class Account  extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({type:"bigint"})
  balance!: number;

  @OneToMany(() => Transaction, transaction => transaction.id)
  transations!: Transaction[];

  @OneToOne(() => User)
  @JoinColumn()
  user!: User;
  
}