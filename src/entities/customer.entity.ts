import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { BusinessEntity } from "./business.entity";

@Entity("customers")
@Unique(["business", "externalId"])
export class CustomerEntity extends AbstractEntity {
  @ManyToOne(() => BusinessEntity, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "business_id" })
  business: BusinessEntity;

  @Column({ length: 100 })
  externalId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 255 })
  email: string;
}
