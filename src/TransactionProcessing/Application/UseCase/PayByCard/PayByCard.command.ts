import { AccountRepository } from "../../../Domain/Gateway/Account.repository";

interface PayByCardCommandDetails {
  clientAccountNumber: string;
  merchantAccountNumber: string;
  amount: number;
  currency: string; 
}

export class PayByCardCommand {
  constructor(public readonly details: PayByCardCommandDetails) {}
}
