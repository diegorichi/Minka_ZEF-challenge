import { Transaction } from "./transaction.entity";

export interface TransactionStrategy {
  execute(transaction: Transaction): void;
}

export class DepositStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    transaction.account.balance =
      Number(transaction.account.balance) + Number(transaction.amount);
  }
}

export class WithdrawStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if (Number(transaction.account.balance) - transaction.amount < 0) {
      throw new Error("Insufficient funds.");
    }
    transaction.account.balance =
      Number(transaction.account.balance) - transaction.amount;
  }
}

export class InvestmentStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if (!transaction.project)
      throw new Error("invalid paramters");

    // if account does not have money
    if (Number(transaction.account.balance) - transaction.amount < 0) {
      throw new Error("Insufficient accound funds.");
    }
    // I can invest only the available currency within the project
    if (
      Number(transaction.project?.currency?.totalAvailable) <
      transaction.amount / Number(transaction.project!.currency.parity)
    )
      throw new Error("Insufficient currency available.");

    transaction.account.balance =
      Number(transaction.account.balance) - transaction.amount;

    transaction.project!.balance =
      Number(transaction.project!.balance) +
      transaction.amount / Number(transaction.project!.currency.parity);
    transaction.project!.currency.totalAvailable =
      Number(transaction.project!.currency.totalAvailable) -
      transaction.amount / Number(transaction.project!.currency.parity);
  }
}

export class EarningStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if (!transaction.project)
      throw new Error("invalid paramters");

    if (
      Number(transaction.project!.balance) -
        transaction.amount <
      0
    ) 
      throw new Error("Insufficient project funds.");

    transaction.project!.balance = Number(transaction.project!.balance) -
      transaction.amount;
    transaction.account.balance = Number(transaction.account.balance) + transaction.amount * Number(transaction.project!.currency.parity);
      transaction.project!.currency.totalAvailable = Number(transaction.project!.currency.totalAvailable) + transaction.amount;
  }
}
