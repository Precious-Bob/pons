import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessesModule } from "./businesses/businesses.module";
import { CustomersModule } from "./customers/customers.module";
import { WalletsModule } from "./wallets/wallets.module";
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "better-sqlite3",
        database: configService.get<string>("DB_PATH"),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    BusinessesModule,

    CustomersModule,

    WalletsModule,

    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
