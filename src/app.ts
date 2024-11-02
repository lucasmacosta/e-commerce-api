import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import "express-async-errors";

import products from "./routes/products";
import orders from "./routes/orders";
import errorHandler from "./middlewares/error-handler";

export const app = express();

// middleware for json body parsing
app.use(bodyParser.json({ limit: "5mb" }));

app.use("/products", products);
app.use("/orders", orders);

app.use(errorHandler);

export default app;
