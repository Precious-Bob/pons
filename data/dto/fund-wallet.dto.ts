import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class FundWalletDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;
}
