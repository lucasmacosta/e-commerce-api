import { Service } from "typedi";
import { Transaction } from "sequelize";

import { Product } from "../models/Product";
import {
  CreateProductDto,
  GetProductsDto,
  UpdateProductDto,
} from "../controllers/dtos/products";
import ApiError from "../lib/api-error";
import sequelize from "../db";

const PER_PAGE_DEFAULT = 100;

@Service()
export class ProductService {
  constructor() {}

  public async search(query: GetProductsDto) {
    const {
      page = 1,
      perPage = PER_PAGE_DEFAULT,
      fields,
      orderBy = "title",
      orderDir = "desc",
    } = query;

    return Product.findAll({
      attributes: fields && [orderBy, ...fields],
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [[orderBy, orderDir === "desc" ? "DESC" : "ASC"]],
    });
  }

  public async get(id: number, transaction?: Transaction) {
    const product = await Product.findByPk(id, { transaction });

    if (product === null) {
      throw new ApiError("Not Found", "notFound");
    }

    return product;
  }

  public async create(params: CreateProductDto) {
    return Product.create(params);
  }

  public async update(id: number, params: UpdateProductDto) {
    return await sequelize.transaction(async (t) => {
      const product = await this.get(id, t);

      product.set(params);

      await product.save({ transaction: t });

      return product;
    });
  }

  public async delete(id: number) {
    return await sequelize.transaction(async (t) => {
      const product = await this.get(id, t);

      await product.destroy({ transaction: t });

      return product;
    });
  }
}
