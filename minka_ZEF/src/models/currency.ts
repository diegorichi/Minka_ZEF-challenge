import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { User } from "./user";

@Entity()
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;  
  
  @Column()
  code!: string;

  @Column({type:"bigint"})
  totalQuantity!: number;

  @Column({type:"bigint"})
  totalAvailable!: number;

  @Column({ type: "numeric", precision: 14, scale: 4 })
  parity!: number;

  @ManyToOne(() => User)
  owner!: User;

}
