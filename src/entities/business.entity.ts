import { Column, Entity } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { BusinessStatus } from "../enums/business-status.enum";

@Entity("businesses")
export class BusinessEntity extends AbstractEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ unique: true, length: 100 })
  apiKey: string;

  @Column({
    type: "text",
    default: BusinessStatus.ACTIVE,
  })
  status: BusinessStatus;
}
