import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "../../data/dto";
import { BusinessEntity } from "../entities/business.entity";

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepo: Repository<CustomerEntity>,
  ) {}

  async create(
    business: BusinessEntity,
    { name, email, externalId }: CreateCustomerDto,
  ) {
    const existingCustomer = await this.customerRepo.findOne({
      where: { externalId, business: { id: business.id } },
    });

    if (existingCustomer) {
      throw new ConflictException({
        code: "CUSTOMER_ALREADY_EXISTS",
        message: `Customer with externalId ${externalId} already exists for this business`,
      });
    }

    const customer = this.customerRepo.create({
      business,
      name,
      email,
      externalId,
    });

    return await this.customerRepo.save(customer);
  }
}
