import { injectable } from "inversify";
import { FindOneOptions, Repository } from "typeorm";
import connectDB from "../utils/db.connection";
import { Transaction, TransactionType } from "../models/transaction.entity";
import { Project } from "../models/project.entity";
import { User } from "../models/user.entity";
import { Account } from "../models/account.entity";

@injectable()
export class TransactionService {
 
  public async findOne(options: FindOneOptions<Transaction>) {
    return await this.transactionRepository.findOne(options);
  }

  public async deleteTransaction(id: string) {
    const options: FindOneOptions<Transaction> = {
      where: { id: parseInt(id) },
    };
    const transaction = await this.findOne(options);
    if (!transaction) {
      return;
    }
    return await this.transactionRepository.delete({ id: parseInt(id) });
  }


  private transactionRepository: Repository<Transaction> = connectDB.getRepository(Transaction);
  private userRepository: Repository<User> = connectDB.getRepository(User);
  private projectRepository: Repository<Project> = connectDB.getRepository(Project);
  private accountRepository: Repository<Account> = connectDB.getRepository(Account);

  public async getTransaction(id: number) {
    return await this.transactionRepository.findOneBy({ id });
  }

  public async getTransactions(): Promise<Transaction[]> {
    return await this.transactionRepository.find();
  }

  public async createTransaction(
    type: TransactionType,
    amount: number,
    project: number,
    userId: number,
  ): Promise<Transaction> {

    const transaction = new Transaction();

    const userFinded = await this.userRepository.findOneByOrFail({id:userId});
    if (!userFinded)
      throw new Error("Invalid paramater");
    transaction.user = userFinded;
    const accountFinded = await this.accountRepository.findOneByOrFail({user:{id:userId}});

    transaction.account = accountFinded;
    if (project){
      const projectFinded = await this.projectRepository.findOneBy({id:project});
      transaction.project = projectFinded!;
    }
    transaction.type = type;
    transaction.amount = amount;
    transaction.execute();

    return await this.transactionRepository.save(transaction);
    
  }
}

