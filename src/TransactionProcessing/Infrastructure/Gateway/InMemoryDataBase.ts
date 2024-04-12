import { AccountRepository } from "../../Domain/Gateway/Account.repository";
import { TransactionRepository } from "../../Domain/Gateway/Transaction.repository";
import { Account } from "../../Domain/Model/Account";
import { Amount } from "../../Domain/Model/Amount";
import { TransactionLog } from "../../Domain/Model/TransactionLog";
import { cloneDeep } from "lodash";

export class InMemoryDataBase
  implements AccountRepository, TransactionRepository
{
  private transactions: Map<string, TransactionLog> = new Map<
    string,
    TransactionLog
  >();
  private accounts: Map<string, Account> = new Map<string, Account>();

  constructor(accounts: Account[], transactions: TransactionLog[]) {
    accounts.forEach((account) => this.accounts.set(account.number, account));
    transactions.forEach((transaction) =>
      this.transactions.set(transaction.id, transaction)
    );
  }

  loadByNumber(accountNumber: string): Account | null {
    if (this.accounts.get(accountNumber)) {
      return cloneDeep(this.accounts.get(accountNumber));
    }
    return null;
  }

  getTransactions(): Map<string, TransactionLog> {
    return this.transactions;
  }

  getAccounts(): Map<string, Account> {
    return this.accounts;
  }

  loadByTransactionId(transactionId: string): TransactionLog | null {
    return this.transactions.get(transactionId) || null;
  }

  saveTransaction(transaction: TransactionLog): void {
    this.transactions.set(transaction.id, transaction);
  }

  saveAccount(account: Account) {
    this.accounts.set(account.number, account);
  }

  newTransaction(_amount: Amount, customer: Account, merchant: Account) {
    const transactionId = Math.random().toString();
    const transaction: TransactionLog = {
      id: transactionId,
      date: new Date(Date.now()),
      accounting: [
        {
          accountNumber: merchant.number,
          amount: _amount,
          newBalance: {
            value: merchant.balance.value + _amount.value,
            currency: _amount.currency,
          },
        },
        {
          accountNumber: customer.number,
          amount: _amount,
          newBalance: {
            value: customer.balance.value - _amount.value,
            currency: _amount.currency,
          },
        },
      ],
    };

    this.saveTransaction(transaction);
    return transactionId
  }
}
