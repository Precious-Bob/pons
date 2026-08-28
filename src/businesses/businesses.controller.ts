import { Body, Controller, Post } from "@nestjs/common";
import { BusinessesService } from "./businesses.service";
import { CreateBusinessDto } from "../../data/dto/create-business.dto";

@Controller("businesses")
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() dto: CreateBusinessDto) {
    return this.businessesService.create(dto);
  }
}
