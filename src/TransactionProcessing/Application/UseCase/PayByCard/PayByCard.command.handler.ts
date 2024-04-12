import { PayByCardCommand } from "./PayByCard.command";
import { TransactionRepository } from "../../../Domain/Gateway/Transaction.repository";
import { AccountRepository } from "../../../Domain/Gateway/Account.repository";
import { InMemoryDataBase } from "../../../Infrastructure/Gateway/InMemoryDataBase";
import { TransactionLog } from "../../../Domain/Model/TransactionLog";

export class PayByCardCommandHandler {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  public handle(command: PayByCardCommand) {
    /*
    Your turn :)
    À vous de jouer !
    */

    const customer = this.accountRepository.loadByNumber(
      command.details.clientAccountNumber
    );
    const merchant = this.accountRepository.loadByNumber(
      command.details.merchantAccountNumber
    );

    if (!customer || !merchant) {
      throw Error(`Login account not exist`);
    }

    if (customer.balance.value < command.details.amount) {
      throw Error(`Customer balance not enough`);
    }

    if (customer.balance.currency != command.details.currency) {
      throw Error("Noe the same currency");
    }

    if (merchant.balance.currency != command.details.currency) {
      throw Error("Noe the same currency");
    }

    const _amount = {
      value: command.details.amount,
      currency: command.details.currency,
    };

    const transactionResult = this.transactionRepository.newTransaction(
      _amount,
      customer,
      merchant
    );
    const newTransaction =
      this.transactionRepository.loadByTransactionId(transactionResult);

    return newTransaction;
  }
}
