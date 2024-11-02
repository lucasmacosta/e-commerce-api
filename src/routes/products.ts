import { Router } from "express";
import Container from "typedi";

import buildValidator from "../middlewares/build-validator";
import { ProductController } from "../controllers/products";

const productsController = Container.get(ProductController);

import {
  createProductSchema,
  getProductsSchema,
  productParamsSchema,
  updateProductSchema,
} from "../controllers/dtos/products";

const products = Router();

products.get(
  "/",
  buildValidator("query", getProductsSchema),
  productsController.search.bind(productsController)
);
products.get(
  "/:id",
  buildValidator("params", productParamsSchema),
  productsController.get.bind(productsController)
);
products.post(
  "/",
  buildValidator("body", createProductSchema),
  productsController.create.bind(productsController)
);
products.put(
  "/:id",
  buildValidator("params", productParamsSchema),
  buildValidator("body", updateProductSchema),
  productsController.update.bind(productsController)
);
products.delete(
  "/:id",
  buildValidator("params", productParamsSchema),
  productsController.delete.bind(productsController)
);

export default products;
