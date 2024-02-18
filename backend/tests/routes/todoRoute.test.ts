import express from "express";
import type { Express, Request, Response, NextFunction } from "express";
import request from "supertest";
import todoRouter from "../../src/routes/todoRoute";
import todoController from "../../src/controllers/todoController";
import todoValidator from "../../src/middlewares/todoValidator";

jest.mock("../../src/controllers/todoController", () => {
  const makeMiddlewareMock = () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
      next();
    });
  return {
    __esModule: true,
    default: {
      listTodos: makeMiddlewareMock(),
      createTodo: makeMiddlewareMock(),
      updateTodo: makeMiddlewareMock(),
      deleteTodo: makeMiddlewareMock(),
    },
  };
});

jest.mock("../../src/middlewares/todoValidator", () => {
  const originalModule = jest.requireActual<
    typeof import("../../src/middlewares/todoValidator")
  >("../../src/middlewares/todoValidator");

  const makeMiddlewareMock = () =>
    jest.fn((req: Request, res: Response, next: NextFunction) => {
      next();
    });
  return {
    __esModule: true,
    default: {
      createTodo: originalModule.default.createTodo.map((_) =>
        makeMiddlewareMock()
      ),
      updateTodo: originalModule.default.updateTodo.map((_) =>
        makeMiddlewareMock()
      ),
      deleteTodo: originalModule.default.deleteTodo.map((_) =>
        makeMiddlewareMock()
      ),
    },
  };
});

describe("todoRoute", () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(todoRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should run all middlewares for GET /all", async () => {
    await request(app).get("/all");

    expect(todoController.listTodos).toHaveBeenCalled();
  });

  it("should run all middlewares for POST /", async () => {
    await request(app)
      .post("/")
      .send({ name: "Test" })
      .set("Accept", "application/json");

    todoValidator.createTodo.forEach((validator) => {
      expect(validator).toHaveBeenCalled();
    });
    expect(todoController.createTodo).toHaveBeenCalled();
  });

  it("should run all middlewares for PUT /:id", async () => {
    await request(app)
      .put("/123")
      .send({ name: "Test" })
      .set("Accept", "application/json");

    todoValidator.updateTodo.forEach((validator) => {
      expect(validator).toHaveBeenCalled();
    });
    expect(todoController.updateTodo).toHaveBeenCalled();
  });

  it("should run all middlewares for DELETE /:id", async () => {
    await request(app).delete("/123");

    todoValidator.deleteTodo.forEach((validator) => {
      expect(validator).toHaveBeenCalled();
    });
    expect(todoController.deleteTodo).toHaveBeenCalled();
  });
});
