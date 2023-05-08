import "reflect-metadata";
//import bodyParser from "body-parser";
import request from "supertest";
import { InversifyExpressServer } from "inversify-express-utils";
import { Container } from "inversify";
import "../src/controllers/users.controller";

import { UserService } from "../src/services/user.service";
import express from "express";


describe("UserController", () => {
  let container: Container;
  let server: InversifyExpressServer;

  beforeAll(async () => {
    container = new Container();

    const mockUserService: any = {
      createUser: jest.fn().mockResolvedValue({
        id: 1,
        name: "Peter",
        email: "individual@dr.com",
        role: "member",
        type: "individual",
      }),
    };

    container.bind<UserService>(UserService).toConstantValue(mockUserService);

    server = new InversifyExpressServer(container);
    server.setConfig((app) => {
      app.use(express.json());
    });
    server.setErrorConfig((app) => {
      // configura el manejo de errores
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const response = await request(server.build())
        .post("/users")
        .send({
          name: "Peter",
          email: "individual@dr.com",
          password: "123456",
        })
        .expect(201);

      const expectedUser: any = {
        id: 1,
        name: "Peter",
        email: "individual@dr.com",
      };
      expect(response.body).toEqual(expectedUser);
    });
  });
});
