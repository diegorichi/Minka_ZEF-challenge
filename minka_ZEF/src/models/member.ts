import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "./user";
import { Project } from "./project";
import { Account } from "./account";


@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // 'individual' or 'company'

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