import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from "class-validator";

export class TransferWalletDto {
  @IsUUID()
  destinationWalletId: string;

  @IsInt()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;
}
