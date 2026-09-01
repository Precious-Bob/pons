import { Module } from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import { WalletsController } from "./wallets.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WalletEntity } from "../entities/wallet.entity";
import { CustomersModule } from "../customers/customers.module";
import { BusinessesModule } from "../businesses/businesses.module";
import { TransactionsModule } from "../transactions/transactions.module";

@Module({
  controllers: [WalletsController],
  providers: [WalletsService],
  imports: [
    CustomersModule,
    BusinessesModule,
    TransactionsModule,
    TypeOrmModule.forFeature([WalletEntity]),
  ],
})
export class WalletsModule {}
