import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
  AllowNull,
  HasMany,
} from "sequelize-typescript";

import { LineItem } from "./LineItem";

interface OrderAttributes {
  id: number;
  lineItems: LineItem[];
  total: number;
  shippingFee: number;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderCreationAttributes
  extends Optional<
    OrderAttributes,
    "id" | "lineItems" | "createdAt" | "updatedAt"
  > {}

@Table({
  timestamps: true,
  tableName: "orders",
  underscored: true,
})
export class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  @HasMany(() => LineItem)
  lineItems!: LineItem[];

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  total!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  shippingFee!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
