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
import { CreateWalletDto } from "../../data/dto/create-wallet.dto";
import { TransactionEntity } from "../entities/transaction.entity";
import { WalletStatus } from "../enums";
import { FundWalletDto } from "../../data/dto/fund-wallet.dto";
import { TransactionType } from "../enums/transaction-type.enum";

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,

    private readonly customersService: CustomersService,
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

    return this.dataSource.transaction(async (manager) => {
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
}
