import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { WalletEntity } from "../entities/wallet.entity";
import { CustomersService } from "../customers/customers.service";
import { BusinessEntity } from "../entities/business.entity";
import { CreateWalletDto } from "../../data/dto/wallet/create-wallet.dto";
import { TransactionEntity } from "../entities/transaction.entity";
import { WalletStatus } from "../enums";
import { FundWalletDto } from "../../data/dto/wallet/fund-wallet.dto";
import { TransactionType } from "../enums/transaction-type.enum";
import { DebitWalletDto } from "../../data/dto/wallet/debit-wallet.dto";
import { TransactionsService } from "../transactions/transactions.service";

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,

    private readonly customersService: CustomersService,
    private readonly transactionsService: TransactionsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    business: BusinessEntity,
    { customerId, currency }: CreateWalletDto,
  ) {
    const customer = await this.customersService.findOne(business, customerId);

    if (!customer) {
      throw new NotFoundException({
        code: "CUSTOMER_NOT_FOUND",
        message: "Customer not found",
      });
    }

    const existingWallet = await this.walletRepository.findOne({
      where: {
        customer: {
          id: customer.id,
        },
        currency,
      },
    });

    if (existingWallet) {
      throw new ConflictException({
        code: "WALLET_ALREADY_EXISTS",
        message: "A wallet for this currency already exists",
      });
    }

    const wallet = this.walletRepository.create({
      customer,
      currency,
      balance: 0,
    });

    const savedWallet = await this.walletRepository.save(wallet);

    return savedWallet;
  }

  async fund(
    business: BusinessEntity,
    walletId: string,
    { amount, reference }: FundWalletDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.walletRepository.findOne({
        where: {
          id: walletId,
          customer: {
            business: {
              id: business.id,
            },
          },
        },
      });

      if (!wallet) {
        throw new NotFoundException({
          code: "WALLET_NOT_FOUND",
          message: `Wallet with id ${walletId} not found`,
        });
      }

      if (wallet.status !== WalletStatus.ACTIVE) {
        throw new ConflictException({
          code: "WALLET_NOT_ACTIVE",
          message: "Wallet is not active",
        });
      }

      const existingTransaction = await manager.findOne(TransactionEntity, {
        where: {
          reference,
        },
      });

      if (existingTransaction) {
        throw new ConflictException({
          code: "DUPLICATE_REFERENCE",
          message: "A transaction with this reference already exists",
        });
      }

      wallet.balance += amount;

      await manager.save(WalletEntity, wallet);

      const transaction = manager.create(TransactionEntity, {
        wallet,
        amount,
        type: TransactionType.CREDIT,
        reference,
        description: "Wallet funding",
      });

      await manager.save(TransactionEntity, transaction);

      return {
        walletId: wallet.id,
        balance: wallet.balance,
        transactionId: transaction.id,
        reference: transaction.reference,
      };
    });
  }

  async debit(
    business: BusinessEntity,
    walletId: string,
    { amount, reference }: DebitWalletDto,
  ) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await this.walletRepository.findOne({
        where: {
          id: walletId,
          customer: {
            business: {
              id: business.id,
            },
          },
        },
      });

      if (!wallet) {
        throw new NotFoundException({
          code: "WALLET_NOT_FOUND",
          message: `Wallet with id ${walletId} not found`,
        });
      }

      if (wallet.status !== WalletStatus.ACTIVE) {
        throw new ConflictException({
          code: "WALLET_NOT_ACTIVE",
          message: "Wallet is not active",
        });
      }

      const existingTransaction = await manager.findOne(TransactionEntity, {
        where: {
          reference,
        },
      });

      if (existingTransaction) {
        throw new ConflictException({
          code: "DUPLICATE_REFERENCE",
          message: "A transaction with this reference already exists",
        });
      }

      if (wallet.balance < amount) {
        throw new ConflictException({
          code: "INSUFFICIENT_FUNDS",
          message: "Insufficient wallet balance",
        });
      }

      wallet.balance -= amount;

      await manager.save(WalletEntity, wallet);

      const transaction = manager.create(TransactionEntity, {
        wallet,
        amount: amount,
        type: TransactionType.DEBIT,
        reference,
        description: "Wallet debit",
      });

      await manager.save(TransactionEntity, transaction);

      return {
        walletId: wallet.id,
        balance: wallet.balance,
        transactionId: transaction.id,
        reference: transaction.reference,
      };
    });
  }

  async findOne(business: BusinessEntity, id: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        id,
        customer: {
          business: {
            id: business.id,
          },
        },
      },
    });

    if (!wallet) {
      throw new NotFoundException({
        code: "WALLET_NOT_FOUND",
        message: `Wallet with id ${id} not found`,
      });
    }

    return wallet;
  }

  async findTransactions(business: BusinessEntity, walletId: string) {
    await this.findOne(business, walletId);

    return this.transactionsService.findByWallet(walletId);
  }
}
