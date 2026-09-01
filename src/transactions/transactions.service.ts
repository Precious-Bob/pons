import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionEntity } from "../entities/transaction.entity";
import { Repository } from "typeorm";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepo: Repository<TransactionEntity>,
  ) {}

  async findByWallet(walletId: string) {
    return this.transactionRepo.find({
      where: {
        wallet: {
          id: walletId,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });
  }
}
