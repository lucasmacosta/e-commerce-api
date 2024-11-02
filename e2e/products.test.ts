import request from "supertest";

import app from "../src/app";
import sequelize from "../src/db";
import { Product } from "../src/models/Product";

describe("Products E2E", () => {
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

  describe("Create product", () => {
    test("should create a product", async () => {
      const response = await request(app)
        .post("/products")
        .send({ title: "title", description: "description", price: 123.45 });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        title: "title",
        description: "description",
        price: 123.45,
      });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .post("/products")
        .send({ title: "", description: "description" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if product already exists", async () => {
      const response = await request(app)
        .post("/products")
        .send({ title: "title 1", description: "description", price: 123.45 });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: "Internal Server Error" });
    });
  });

  describe("Update product", () => {
    test("should update a product", async () => {
      const response = await request(app).put(`/products/${product1.id}`).send({
        title: "title updated",
        description: "description updated",
        price: 222.22,
      });

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: "title updated",
        description: "description updated",
        price: 222.22,
      });
    });

    test("should fail if product does not exist", async () => {
      const response = await request(app)
        .put(`/products/999`)
        .send({ title: "title" });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });

    test("should fail if request is invalid", async () => {
      const response = await request(app)
        .put(`/products/${product1.id}`)
        .send({ title: "" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({ error: "Bad Request" });
    });

    test("should fail if product already exists", async () => {
      const response = await request(app)
        .put(`/products/${product1.id}`)
        .send({ title: "title 2" });

      expect(response.status).toBe(500);
      expect(response.body).toMatchObject({ error: "Internal Server Error" });
    });
  });

  describe("Delete product", () => {
    test("should delete a product", async () => {
      const response = await request(app)
        .delete(`/products/${product1.id}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: product1.title,
        description: product1.description,
        price: product1.price,
      });
    });

    test("should fail if product does not exist", async () => {
      const response = await request(app).delete(`/products/999`).send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });
  });

  describe("Get product", () => {
    test("should get a product", async () => {
      const response = await request(app)
        .get(`/products/${product1.id}`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        title: product1.title,
        description: product1.description,
        price: product1.price,
      });
    });

    test("should fail if product does not exist", async () => {
      const response = await request(app).get(`/products/999`).send();

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({ error: "Not Found" });
    });
  });

  describe("Search products", () => {
    test("should get a list of products", async () => {
      const response = await request(app).get("/products").query({}).send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            title: product1.title,
            description: product1.description,
            price: product1.price,
          }),
          expect.objectContaining({
            title: product2.title,
            description: product2.description,
            price: product2.price,
          }),
          expect.objectContaining({
            title: product3.title,
            description: product3.description,
            price: product3.price,
          }),
        ])
      );
    });

    test("should get a list of products using custom query params", async () => {
      const response = await request(app)
        .get("/products")
        .query({
          page: 2,
          perPage: 2,
          orderBy: "price",
          orderDir: "asc",
          fields: ["id", "title"],
        })
        .send();

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body).toMatchObject(
        expect.arrayContaining([
          expect.objectContaining({
            title: product2.title,
            price: product2.price,
          }),
        ])
      );
      expect(response.body[0]).not.toHaveProperty("description");
    });
  });
});
