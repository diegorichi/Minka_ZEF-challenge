import { injectable } from "inversify";
import { FindOneOptions, Repository } from "typeorm";
import connectDB from "../utils/db.connection";
import { Transaction, TransactionType } from "../models/transaction.entity";
import { Project } from "../models/project.entity";
import { User } from "../models/user.entity";
import { Account } from "../models/account.entity";
import { Currency } from "../models/currency.entity";

@injectable()
export class TransactionService {
  public async getBalanceFor(userId: number): Promise<any> {
    const result = {
      projects: await this.transactionRepository
        .createQueryBuilder("transaction")
        .innerJoin(Project, "project", "transaction.projectId = project.id")
        .innerJoin(Currency, "currency", "project.currencyId = currency.id")
        .select("transaction.projectId", "projectId")
        .addSelect("currency.name", "name")
        .addSelect(
          "SUM(CASE WHEN transaction.type = 'investment' THEN transaction.amount / currency.parity ELSE 0 END) + SUM(CASE WHEN transaction.type = 'earning' THEN -transaction.amount  ELSE 0 END)",
          "balance"
        )
        .where("transaction.projectId IS NOT NULL")
        .andWhere("transaction.userId = :userId", { userId })
        .groupBy("transaction.projectId, currency.name, currency.id")
        .setParameter("investment", TransactionType.INVESTMENT)
        .setParameter("earning", TransactionType.EARNING)
        .getRawMany(),
    };

    result.balance = await this.transactionRepository
      .createQueryBuilder("transaction")
      .select("SUM(CASE WHEN transaction.type = 'deposit' THEN transaction.amount WHEN transaction.type = 'withdraw' THEN -transaction.amount WHEN transaction.type = 'earning' THEN transaction.amount * currency.parity WHEN transaction.type = 'investment' THEN -transaction.amount ELSE 0 END)", "balance")
      .leftJoin("transaction.project", "project")
      .leftJoin("project.currency", "currency")
      .where("transaction.userId = :userId", { userId: 1 })
      .getRawOne();

    return result;
  }

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

  private transactionRepository: Repository<Transaction> =
    connectDB.getRepository(Transaction);
  private userRepository: Repository<User> = connectDB.getRepository(User);
  private projectRepository: Repository<Project> =
    connectDB.getRepository(Project);
  private accountRepository: Repository<Account> =
    connectDB.getRepository(Account);

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
    userId: number
  ): Promise<Transaction> {
    const transaction = new Transaction();

    const userFinded = await this.userRepository.findOneByOrFail({
      id: userId,
    });
    if (!userFinded) throw new Error("Invalid paramater");
    transaction.user = userFinded;
    const accountFinded = await this.accountRepository.findOneByOrFail({
      user: { id: userId },
    });

    transaction.account = accountFinded;
    if (project) {
      const projectFinded = await this.projectRepository.findOneBy({
        id: project,
      });
      transaction.project = projectFinded!;
    }
    transaction.type = type;
    transaction.amount = amount;
    transaction.execute();

    return await this.transactionRepository.save(transaction);
  }
}
