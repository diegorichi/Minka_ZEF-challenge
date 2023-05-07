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
import { User } from "./user.entity";
import { Project } from "./project.entity";
import { Account } from "./account.entity";

export enum MemberType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

@Entity()
export class Member extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: MemberType; // 'individual' or 'company'

  @ManyToOne(() => Account, { eager: true })
  account!: Account;

  @OneToMany(() => Project, (project) => project.owner)
  projects!: Project[];

  @OneToMany(() => Project, (project) => !project.owner)
  investments!: Project[];

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user!: User;
}
