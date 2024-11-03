import request from "supertest";

import app from "../src/app";
import sequelize from "../src/db";
import { Product } from "../src/models/Product";

describe("Orders E2E", () => {
  let product1: Product;
  let product2: Product;
  let product3: Product;

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    [product1, product2, product3] = await Product.bulkCreate([
      {
        title: "title 1",
        description: "desc 1",
        price: 123.45,
      },
      {
        title: "title 2",
        description: "desc 2",
        price: 543.21,
      },
      {
        title: "title 3",
        description: "desc 3",
        price: 111.22,
      },
    ]);
  });

  describe("Create order", () => {
    test("should create an order", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          lineItems: [
            { productId: product1.id, quantity: 1 },
            { productId: product2.id, quantity: 2 },
            { productId: product3.id, quantity: 3 },
          ],
        });

      const expectedTotal =
        5.99 + product1.price + product2.price * 2 + product3.price * 3;

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        total: expectedTotal,
        shippingFee: 5.99,
        lineItems: expect.arrayContaining([
          expect.objectContaining({
            quantity: 1,
            productId: product1.id,
            text: product1.title,
            unitPrice: product1.price,
            total: product1.price,
          }),
          expect.objectContaining({
            quantity: 2,
            productId: product2.id,
            text: product2.title,
            unitPrice: product2.price,
            total: product2.price * 2,
          }),
          expect.objectContaining({
            quantity: 3,
            productId: product3.id,
            text: product3.title,
            unitPrice: product3.price,
            total: product3.price * 3,
          }),
        ]),
      });
    });

    test("should preserve line items status even when products are updated", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          lineItems: [{ productId: product1.id, quantity: 2 }],
        });

      const expectedTotal = 5.99 + product1.price * 2;

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        total: expectedTotal,
        shippingFee: 5.99,
        lineItems: expect.arrayContaining([
          expect.objectContaining({
            quantity: 2,
            productId: product1.id,
            text: product1.title,
            unitPrice: product1.price,
            total: product1.price * 2,
          }),
        ]),
      });

      const prevProductValues = product1.dataValues;

      await request(app).put(`/products/${product1.id}`).send({
        title: "title updated",
        price: 222.22,
      });

      const { body } = await request(app).get("/orders").send();

      expect(body[0]).toMatchObject({
        total: expectedTotal,
        shippingFee: 5.99,
        lineItems: expect.arrayContaining([
          expect.objectContaining({
            quantity: 2,
            productId: product1.id,
            text: prevProductValues.title,
            unitPrice: prevProductValues.price,
            total: prevProductValues.price * 2,
            product: expect.objectContaining({
              title: "title updated",
              price: 222.22,
            }),
          }),
        ]),
      });
    });

    test("should not allow to delete products with existing orders", async () => {
      const response = await request(app)
        .post("/orders")
        .send({
          lineItems: [{ productId: product1.id, quantity: 2 }],
        });

      expect(response.status).toBe(201);

      const deleteRes = await request(app)
        .delete(`/products/${product1.id}`)
        .send();

      expect(deleteRes.status).toBe(409);
      expect(deleteRes.body).toMatchObject({ error: "Conflict" });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .post("/orders")
        .send({ lineItems: [] });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });
  });

  describe("Search orders", () => {
    let order1: any;
    let order2: any;
    let order3: any;

    beforeEach(async () => {
      ({ body: order1 } = await request(app)
        .post("/orders")
        .send({
          lineItems: [{ productId: product1.id, quantity: 1 }],
        }));
      ({ body: order2 } = await request(app)
        .post("/orders")
        .send({
          lineItems: [{ productId: product2.id, quantity: 1 }],
        }));
      ({ body: order3 } = await request(app)
        .post("/orders")
        .send({
          lineItems: [{ productId: product3.id, quantity: 1 }],
        }));
    });

    test("should get a list of orders", async () => {
      const response = await request(app).get("/orders").query({}).send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            id: order1.id,
            total: order1.total,
            shippingFee: 5.99,
            lineItems: [
              expect.objectContaining({
                total: order1.lineItems[0].total,
                quantity: order1.lineItems[0].quantity,
                product: expect.objectContaining({
                  title: product1.title,
                  price: product1.price,
                }),
              }),
            ],
          }),
          expect.objectContaining({
            id: order2.id,
            total: order2.total,
            shippingFee: 5.99,
            lineItems: [
              expect.objectContaining({
                total: order2.lineItems[0].total,
                quantity: order2.lineItems[0].quantity,
                product: expect.objectContaining({
                  title: product2.title,
                  price: product2.price,
                }),
              }),
            ],
          }),
          expect.objectContaining({
            id: order3.id,
            total: order3.total,
            shippingFee: 5.99,
            lineItems: [
              expect.objectContaining({
                total: order3.lineItems[0].total,
                quantity: order3.lineItems[0].quantity,
                product: expect.objectContaining({
                  title: product3.title,
                  price: product3.price,
                }),
              }),
            ],
          }),
        ])
      );
    });

    test("should get a list of products using custom query params", async () => {
      const response = await request(app)
        .get("/orders")
        .query({
          page: 2,
          perPage: 2,
          orderBy: "total",
          orderDir: "asc",
          fields: ["id", "total"],
          lineItemFields: ["id", "total"],
          productFields: ["id", "title"],
        })
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            id: order2.id,
            total: order2.total,
            lineItems: [
              expect.objectContaining({
                total: order2.lineItems[0].total,
                product: expect.objectContaining({
                  title: product2.title,
                }),
              }),
            ],
          }),
        ])
      );
      expect(response.body[0]).not.toHaveProperty("shippingFee");
      expect(response.body[0].lineItems[0]).not.toHaveProperty("quantity");
      expect(response.body[0].lineItems[0].product).not.toHaveProperty("price");
    });
  });
});
