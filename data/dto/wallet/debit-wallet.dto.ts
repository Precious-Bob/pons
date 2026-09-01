import { IsInt, IsNotEmpty, IsPositive, IsString } from "class-validator";

export class DebitWalletDto {
  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;
}
