import { Router } from "express";
import Container from "typedi";

import buildValidator from "../middlewares/build-validator";
import { OrderController } from "../controllers/orders";

const ordersController = Container.get(OrderController);

import { createOrderSchema, getOrdersSchema } from "../controllers/dtos/orders";

const orders = Router();

orders.get(
  "/",
  buildValidator("query", getOrdersSchema),
  ordersController.search.bind(ordersController)
);
orders.post(
  "/",
  buildValidator("body", createOrderSchema),
  ordersController.create.bind(ordersController)
);

export default orders;
