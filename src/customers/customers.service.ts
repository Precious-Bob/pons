import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerEntity } from "../entities/customer.entity";
import { Repository } from "typeorm";
import { BusinessEntity } from "../entities/business.entity";
import { CreateCustomerDto } from "../dto";

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

  async findOne(business: BusinessEntity, id: string) {
    const customer = await this.customerRepo.findOne({
      where: { id, business: { id: business.id } },
    });

    if (!customer) {
      throw new NotFoundException({
        code: "CUSTOMER_NOT_FOUND",
        message: `Customer with id ${id} not found`,
      });
    }

    return customer;
  }

  async findByExternalId(business: BusinessEntity, externalId: string) {
    const customer = await this.customerRepo.findOne({
      where: { externalId, business: { id: business.id } },
    });

    if (!customer) {
      throw new NotFoundException({
        code: "CUSTOMER_NOT_FOUND",
        message: `Customer with externalId ${externalId} not found`,
      });
    }

    return customer;
  }
}
