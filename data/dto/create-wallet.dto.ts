import { IsEnum, IsUUID } from "class-validator";
import { Currency } from "../../src/enums";

export class CreateWalletDto {
  @IsUUID()
  customerId: string;

  @IsEnum(Currency)
  currency: Currency;
}
