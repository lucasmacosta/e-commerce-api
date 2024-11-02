import { Service } from "typedi";

import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { LineItem } from "../models/LineItem";
import { CreateOrderDto, GetOrdersDto } from "../controllers/dtos/orders";
import ApiError from "../lib/api-error";
import sequelize from "../db";

const PER_PAGE_DEFAULT = 100;
const SHIPPING_FEE_DEFAULT = 5.99;

@Service()
export class OrderService {
  constructor() {}

  public async search(query: GetOrdersDto) {
    const {
      page = 1,
      perPage = PER_PAGE_DEFAULT,
      fields,
      lineItemFields,
      productFields,
      orderBy = "createdAt",
      orderDir = "desc",
    } = query;

    return Order.findAll({
      attributes: fields && [orderBy, ...fields],
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [[orderBy, orderDir === "desc" ? "DESC" : "ASC"]],
      include: {
        model: LineItem,
        attributes: lineItemFields,
        include: [
          {
            model: Product,
            attributes: productFields,
          },
        ],
      },
    });
  }

  public async create(params: CreateOrderDto) {
    const order = new Order(
      {
        total: SHIPPING_FEE_DEFAULT,
        shippingFee: SHIPPING_FEE_DEFAULT,
        lineItems: [],
      },
      { include: LineItem }
    );

    for (const { productId, quantity } of params.lineItems) {
      const product = await Product.findByPk(productId);

      if (product === null) {
        throw new ApiError("Not Found", "notFound");
      }

      const lineItemTotal = quantity * product.price;

      order.lineItems.push(
        new LineItem({
          quantity,
          productId,
          text: product.title,
          unitPrice: product.price,
          total: lineItemTotal,
        })
      );

      order.total += lineItemTotal;
    }

    return await sequelize.transaction(async (t) => {
      return order.save();
    });
  }
}
