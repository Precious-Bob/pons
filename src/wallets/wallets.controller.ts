import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { WalletsService } from "./wallets.service";
import type { AuthenticatedReq } from "../types/authenticated-req";
import { CreateWalletDto } from "../../data/dto/wallet/create-wallet.dto";
import { ApiKeyGuard } from "../guards/api-key.guard";
import { FundWalletDto } from "../../data/dto/wallet/fund-wallet.dto";

@Controller("wallets")
@UseGuards(ApiKeyGuard)
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Post()
  create(@Req() request: AuthenticatedReq, @Body() dto: CreateWalletDto) {
    return this.walletsService.create(request.business, dto);
  }

  @Post(":id/fund")
  fund(
    @Req() request: AuthenticatedReq,
    @Param("id") id: string,
    @Body() dto: FundWalletDto,
  ) {
    return this.walletsService.fund(request.business, id, dto);
  }

  @Get(":id/transactions")
  findTransactions(@Req() request: AuthenticatedReq, @Param("id") id: string) {
    return this.walletsService.findTransactions(request.business, id);
  }
}
