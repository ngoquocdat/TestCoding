import { Account } from "../Model/Account";
import { Amount } from "../Model/Amount";
import { TransactionLog } from "../Model/TransactionLog";

export interface TransactionRepository {
  saveTransaction(transaction: TransactionLog): void;

  newTransaction(_amount: Amount, customer: Account, merchant: Account): string;

  loadByTransactionId(transactionId: string): TransactionLog;
}
