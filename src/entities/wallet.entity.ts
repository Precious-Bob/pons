import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Currency } from "../enums/currency.enum";
import { WalletStatus } from "../enums/wallet-status.enum";
import { CustomerEntity } from "./customer.entity";
import { AbstractEntity } from "./abstract.entity";

@Entity("wallets")
@Unique(["customer", "currency"])
export class WalletEntity extends AbstractEntity {
  @ManyToOne(() => CustomerEntity, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "customer_id" })
  customer: CustomerEntity;

  @Column({
    type: "integer",
    default: 0,
  })
  balance: number;

  @Column({
    type: "text",
  })
  currency: Currency;

  @Column({
    type: "text",
    default: WalletStatus.ACTIVE,
  })
  status: WalletStatus;
}
