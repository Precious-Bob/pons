import { IsEmail, IsString, Length } from "class-validator";

export class CreateCustomerDto {
  @IsString()
  @Length(1, 100)
  externalId: string;

  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;
}
