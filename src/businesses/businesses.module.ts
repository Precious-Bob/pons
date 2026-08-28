import { Module } from "@nestjs/common";
import { BusinessesService } from "./businesses.service";
import { BusinessesController } from "./businesses.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BusinessEntity } from "../entities/business.entity";

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService],
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
})
export class BusinessesModule {}
