import todoValidator from "../../src/middlewares/todoValidator";
import validatorTester from "../../src/utils/validatorTester";
import type { Request, Response, NextFunction } from "express";

describe("todoValidator", () => {
  let mockRequest: Request;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {} as Request;

    mockResponse = {} as Response;
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn().mockReturnThis();

    mockNext = jest.fn();
  });

  xit("should respond 400 with error msg if creating To-Do with name missing", async () => {
    mockRequest.body = {};

    await validatorTester(
      mockRequest,
      mockResponse,
      mockNext,
      ...todoValidator.createTodo
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "name is required",
    });
  });

  xit("should proceed to next middleware if creating To-Do with name", async () => {
    mockRequest.body = { name: "Test" };

    await validatorTester(
      mockRequest,
      mockResponse,
      mockNext,
      ...todoValidator.createTodo
    );

    expect(mockNext).toHaveBeenCalledTimes(todoValidator.createTodo.length);
  });

  it("should respond 400 with error msg if updating To-Do with name missing", async () => {
    mockRequest.body = {};

    await validatorTester(
      mockRequest,
      mockResponse,
      mockNext,
      ...todoValidator.updateTodo
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "name is required",
    });
  });

  it("should proceed to next middleware if updating To-Do with name", async () => {
    mockRequest.body = { name: "Test" };

    await validatorTester(
      mockRequest,
      mockResponse,
      mockNext,
      ...todoValidator.updateTodo
    );

    expect(mockNext).toHaveBeenCalledTimes(todoValidator.updateTodo.length);
  });
});
