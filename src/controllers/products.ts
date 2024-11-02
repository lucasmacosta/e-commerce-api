import { Service } from "typedi";
import { RequestHandler } from "express";

import { ProductService } from "../services/products";
import {
  CreateProductDto,
  GetProductsDto,
  ProductParamsDto,
  UpdateProductDto,
} from "./dtos/products";

@Service()
export class ProductController {
  constructor(private productService: ProductService) {}

  search: RequestHandler = async (req, res) => {
    const query = res.locals.validated.query as GetProductsDto;

    const products = await this.productService.search(query);

    res.status(200).json(products);
  };

  get: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as ProductParamsDto;

    const product = await this.productService.get(params.id);

    res.status(200).json(product);
  };

  create: RequestHandler = async (req, res) => {
    const body = res.locals.validated.body as CreateProductDto;

    const product = await this.productService.create(body);

    res.status(201).json(product);
  };

  update: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as ProductParamsDto;
    const body = res.locals.validated.body as UpdateProductDto;

    const product = await this.productService.update(params.id, body);

    res.status(200).json(product);
  };

  delete: RequestHandler = async (req, res) => {
    const params = res.locals.validated.params as ProductParamsDto;

    const product = await this.productService.delete(params.id);

    res.status(200).json(product);
  };
}
