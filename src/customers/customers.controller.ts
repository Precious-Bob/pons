import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "../../data/dto";
import type { AuthenticatedReq } from "../types/authenticated-req";
import { ApiKeyGuard } from "../guards/api-key.guard";

@Controller("customers")
@UseGuards(ApiKeyGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Req() request: AuthenticatedReq, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(request.business, dto);
  }

  @Get("external/:externalId")
  findByExternalId(
    @Req() request: AuthenticatedReq,
    @Param("externalId") externalId: string,
  ) {
    return this.customersService.findByExternalId(request.business, externalId);
  }

  @Get(":id")
  findOne(@Req() request: AuthenticatedReq, @Param("id") id: string) {
    return this.customersService.findOne(request.business, id);
  }
}
