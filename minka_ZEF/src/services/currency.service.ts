import { injectable } from "inversify";
import { FindOneOptions, Repository } from "typeorm";
import { Currency } from "../models/currency.entity";
import connectDB from "../utils/db.connection";
import { Member, MemberType } from "../models/member.entity";
import { Account } from "../models/account.entity";
import { DomainOwner } from "../models/domainOwner.entity";
import { User } from "../models/user.entity";
import { Transaction } from "../models/transaction.entity";

@injectable()
export class CurrencyService {
  public async findAll() {
    return await this.currencyRepository.find();
  }

  public async findOne(options: FindOneOptions<Currency>) {
    return await this.currencyRepository.findOne(options);
  }

  public async deleteCurrency(id: string) {
    const options: FindOneOptions<Currency> = {
      where: { id: parseInt(id) },
    };
    const currency = await this.findOne(options);
    if (!currency) {
      return;
    }
    return await this.currencyRepository.delete({ id: parseInt(id) });
  }

  private transactionRepository: Repository<Transaction> =
    connectDB.getRepository(Transaction);

  private currencyRepository: Repository<Currency> =
    connectDB.getRepository(Currency);
  private userRepository: Repository<User> = connectDB.getRepository(User);
  private domainOwnerRepository: Repository<DomainOwner> =
    connectDB.getRepository(DomainOwner);

  public async getCurrency(id: string) {
    return await this.currencyRepository.findOneBy({ id: parseInt(id) });
  }

  public async getCurrencys(): Promise<Currency[]> {
    const currencys = await this.currencyRepository.find();
    return currencys;
  }

  public async createCurrency(
    name: string,
    code: string,
    parity: number,
    owner: number
  ): Promise<Currency> {
    const currencyFinded = await this.currencyRepository.findOneBy({
      name,
      owner: { id: owner },
      code,
      parity,
    });
    if (currencyFinded) {
      return currencyFinded;
    } else {
      const aUser = await this.userRepository.findOneByOrFail({ id: owner });

      const currency = new Currency();
      currency.name = name;
      currency.code = code;
      currency.owner = aUser;
      currency.parity = parity;
      currency.totalAvailable = 0;
      currency.totalQuantity = 0;

      return await this.currencyRepository.save(currency);
    }
  }

  public async updateCurrency(
    id: number,
    userId: number,
    name: string,
    code: string,
    quantity: number,
    parity: number
  ) {


    const user = await this.userRepository.findOneBy({ id: userId });

    const currency = await this.currencyRepository.findOneBy({
      id
    });
    if (!currency)
      return;

    if (user == currency.owner){
      currency.name = name ? name : currency.name;
      currency.code = code ? code : currency.code;
      currency.parity = parity ? parity : currency.parity;  
    }

    const domainOwner = await this.domainOwnerRepository.findOneBy({
      user: { id: userId },
    });
    if (domainOwner) {
      // is member or is domainOwner
      const totalQ = Number(currency.totalQuantity);
      const totalA = Number(currency.totalAvailable);

      if (totalQ + quantity >= 0 && totalA + quantity >= 0) {
        currency.totalQuantity = totalQ + quantity;
        currency.totalAvailable = totalA + quantity;
      }
    }

    return await this.currencyRepository.save(currency);
  }
}
