import { injectable } from "inversify";
import { Repository } from "typeorm";
import { User } from "../models/user.entity";
import connectDB from "../utils/db.connection";
import { Member, MemberType } from "../models/member.entity";
import { Account } from "../models/account.entity";
import { DomainOwner } from "../models/domainOwner.entity";

@injectable()
export class UserService {
  public async findOneBy(params: { email: any; password: string }) {
    return await this.userRepository.findOneBy(params);
  }

  public async deleteUser(id: string) {
    // TODO:
    // * delete from member
    // * delete from account
    // * soft delete transactions and anonymate them
    return await this.userRepository.delete({ id: parseInt(id) });
  }

  private userRepository: Repository<User> = connectDB.getRepository(User);

  public async getUser(id: string) {
    return await this.userRepository.findOneBy({ id: parseInt(id) });
  }

  public async getUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users;
  }

  public async createUser(
    name: string,
    email: string,
    password: string,
    role: string,
    type: string
  ): Promise<User> {
    const userFinded = await this.userRepository.findOneBy({ email });
    if (userFinded) {
      return userFinded;
    } else {
      const user = new User();
      user.name = name;
      user.email = email;
      user.password = password;

      const savedUser = await this.userRepository.save(user);

      if (role === "member") {
        const member = new Member();
        member.user = savedUser;
        const account = new Account();
        account.balance = 0;
        account.user = savedUser;
        member.account = account;
        member.type =
          MemberType.COMPANY == type
            ? MemberType.COMPANY
            : MemberType.INDIVIDUAL;
        account.save();
        await member.save();
      }
      if (role === "domainOwner") {
        const domainOwner = new DomainOwner();
        domainOwner.user = savedUser;
        await domainOwner.save();
      }
      
      delete savedUser.password;

      return savedUser;
    }
  }
}
