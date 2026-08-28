import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessEntity } from "../entities/business.entity";
import { Repository } from "typeorm";
import { CreateBusinessDto } from "../../data/dto/create-business.dto";
import { BusinessStatus } from "../enums/business-status.enum";
import { randomBytes } from "crypto";

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepo: Repository<BusinessEntity>,
  ) {}

  async create({ email, name }: CreateBusinessDto) {
    const existingBusiness = await this.businessRepo.findOne({
      where: { email },
    });

    if (existingBusiness) {
      throw new ConflictException({
        code: "BUSINESS_ALREADY_EXISTS",
        message: "A business with this email already exists",
      });
    }

    const business = this.businessRepo.create({
      name,
      email,
      apiKey: this.generateApiKey(),
      status: BusinessStatus.ACTIVE,
    });

    return this.businessRepo.save(business);
  }

  // Helper Methods
  private generateApiKey() {
    return `pk_test_${randomBytes(32).toString("hex")}`;
  }
}
