import { injectable } from "inversify";
import { Repository } from "typeorm";
import { User } from "../models/user.entity";
import connectDB from "../utils/db.connection";

@injectable()
export class LoginService {
  public async deleteUser(id: string) {
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

  public async createUser(user: User): Promise<User> {
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}
