import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  code!: string;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  totalQuantity!: number;

  @Column({ type: "numeric", precision: 10, scale: 2 })
  totalAvailable!: number;

  @Column({ type: "numeric", precision: 10, scale: 4 })
  parity!: number;

  @ManyToOne(() => User, {eager:true})
  owner!: User;
}
