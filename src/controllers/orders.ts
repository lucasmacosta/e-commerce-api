import { Service } from "typedi";
import { RequestHandler } from "express";

import { OrderService } from "../services/orders";
import { CreateOrderDto, GetOrdersDto } from "./dtos/orders";

@Service()
export class OrderController {
  constructor(private orderService: OrderService) {}

  search: RequestHandler = async (req, res) => {
    const query = res.locals.validated.query as GetOrdersDto;

    const products = await this.orderService.search(query);

    res.status(200).json(products);
  };

  create: RequestHandler = async (req, res) => {
    const body = res.locals.validated.body as CreateOrderDto;

    const product = await this.orderService.create(body);

    res.status(201).json(product);
  };
}
