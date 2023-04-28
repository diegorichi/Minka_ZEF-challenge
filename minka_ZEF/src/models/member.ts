import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  BaseEntity,
} from "typeorm";
import { User } from "./user";
import { Project } from "./project";
import { Account } from "./account";

type UserType = "individual" | "company";

@Entity()
export class Member extends BaseEntity{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: UserType; // 'individual' or 'company'

  @ManyToOne(() => Account, { eager: true })
  account!: Account;

  @OneToMany(() => Project, project => project.owner)
  projects!: Project[];

  @OneToMany(() => Project, project => !project.owner)
  investments!: Project[];

  @OneToOne(() => User,  {eager: true})
  @JoinColumn()
  user!: User;
}