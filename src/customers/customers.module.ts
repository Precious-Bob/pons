import { Module } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CustomersController } from "./customers.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { BusinessesModule } from "../businesses/businesses.module";

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  imports: [BusinessesModule, TypeOrmModule.forFeature([CustomerEntity])],
  exports: [CustomersService],
})
export class CustomersModule {}
