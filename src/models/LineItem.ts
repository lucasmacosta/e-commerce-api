import { Optional } from "sequelize";
import {
  Column,
  CreatedAt,
  Model,
  Table,
  UpdatedAt,
  DataType,
  ForeignKey,
  BelongsTo,
  AllowNull,
} from "sequelize-typescript";

import { Product } from "./Product";
import { Order } from "./Order";

interface LiteItemAttributes {
  id: number;
  quantity: number;
  product: Product;
  productId: number;
  order: Order;
  orderId: number;
  text: string;
  unitPrice: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

interface LineItemCreationAttributes
  extends Optional<
    LiteItemAttributes,
    | "id"
    | "product"
    | "order"
    | "orderId"
    | "text"
    | "unitPrice"
    | "total"
    | "createdAt"
    | "updatedAt"
  > {}

@Table({
  timestamps: true,
  tableName: "line_items",
  underscored: true,
})
export class LineItem extends Model<
  LiteItemAttributes,
  LineItemCreationAttributes
> {
  @AllowNull(false)
  @Column(DataType.INTEGER)
  quantity!: number;

  @ForeignKey(() => Product)
  @AllowNull(false)
  @Column
  productId!: number;

  @BelongsTo(() => Product)
  product!: Product;

  @ForeignKey(() => Order)
  @AllowNull(false)
  @Column
  orderId!: number;

  @BelongsTo(() => Order)
  order!: Order;

  @AllowNull(false)
  @Column
  text!: string;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  unitPrice!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  total!: number;

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
