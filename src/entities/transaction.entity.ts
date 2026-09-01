import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { TransactionType } from "../enums/transaction-type.enum";
import { WalletEntity } from "./wallet.entity";
import { AbstractEntity } from "./abstract.entity";

@Entity("transactions")
export class TransactionEntity extends AbstractEntity {
  @ManyToOne(() => WalletEntity, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "wallet_id" })
  wallet: WalletEntity;

  @Column({
    type: "integer",
  })
  amount: number;

  @Column({
    type: "text",
  })
  type: TransactionType;

  @Column({
    length: 100,
    unique: true,
  })
  reference: string;

  @Column({
    length: 255,
    nullable: true,
  })
  description: string | null;
}
