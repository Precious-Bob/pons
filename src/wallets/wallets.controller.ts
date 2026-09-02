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
import { ApiKeyGuard } from "../guards/api-key.guard";
import { CreateWalletDto } from "../dto/wallet/create-wallet.dto";
import { FundWalletDto } from "../dto/wallet/fund-wallet.dto";
import { DebitWalletDto } from "../dto/wallet/debit-wallet.dto";
import { TransferWalletDto } from "../dto/wallet/transfer-wallet.dto";

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

  @Post(":id/debit")
  debit(
    @Req() request: AuthenticatedReq,
    @Param("id") id: string,
    @Body() dto: DebitWalletDto,
  ) {
    return this.walletsService.debit(request.business, id, dto);
  }

  @Get(":id/transactions")
  findTransactions(@Req() request: AuthenticatedReq, @Param("id") id: string) {
    return this.walletsService.findTransactions(request.business, id);
  }

  @Post(":id/transfer")
  transfer(
    @Req() request: AuthenticatedReq,
    @Param("id") id: string,
    @Body() dto: TransferWalletDto,
  ) {
    return this.walletsService.transfer(request.business, id, dto);
  }
}
