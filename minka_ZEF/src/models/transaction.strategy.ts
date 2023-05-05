import { Transaction } from "./transaction";

export interface TransactionStrategy {
  execute(transaction: Transaction): void;
}


export class DepositStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    transaction.account.balance += transaction.amount;
  }
}

export class WithdrawStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if ((transaction.account.balance - transaction.amount) < 0) {
      throw new Error('Insufficient funds.');
    }
    transaction.account.balance -= transaction.amount;
  }
}

export class InvestmentStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if ((transaction.account.balance - transaction.amount) < 0) {
      throw new Error('Insufficient funds.');
    }
    transaction.account.balance -= transaction.amount;
    transaction.project!.balance += transaction.amount / transaction.project!.currency.parity;
  }
}

export class EarningStrategy implements TransactionStrategy {
  execute(transaction: Transaction): void {
    if ((transaction.project!.balance - transaction.amount * transaction.project!.currency.parity) < 0) {
      throw new Error('Insufficient funds.');
    }
    transaction.project!.balance -= transaction.amount * transaction.project!.currency.parity;
    transaction.account.balance += transaction.amount;
  }
}
