import { IsEmail, IsString, Length } from "class-validator";

export class CreateBusinessDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsEmail()
  email: string;
}
