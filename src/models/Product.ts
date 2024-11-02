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
  Min,
  Length,
  Unique,
} from "sequelize-typescript";

import { LineItem } from "./LineItem";

interface ProductAttributes {
  id: number;
  title: string;
  description?: string;
  price: number;
  lineItems: LineItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface ProductCreationAttributes
  extends Optional<
    ProductAttributes,
    "id" | "lineItems" | "createdAt" | "updatedAt"
  > {}

@Table({
  timestamps: true,
  tableName: "products",
  underscored: true,
})
export class Product extends Model<
  ProductAttributes,
  ProductCreationAttributes
> {
  @Length({ min: 1, max: 128 })
  @AllowNull(false)
  @Unique
  @Column
  title!: string;

  @Length({ min: 1, max: 128 })
  @Column
  description?: string;

  @Min(0)
  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  price!: number;

  @HasMany(() => LineItem)
  lineItems!: LineItem[];

  @CreatedAt
  @AllowNull(false)
  @Column
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column
  updatedAt!: Date;
}
