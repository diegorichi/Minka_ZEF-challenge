import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
} from "typeorm";

import crypto from 'crypto';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ select: false })
  password!: string;

  @BeforeInsert()
  hashPassword() {
    const md5 = crypto.createHash('md5');
    this.password = md5.update(this.password).digest('hex');
  }
}
