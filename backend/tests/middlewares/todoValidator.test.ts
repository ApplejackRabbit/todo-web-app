import type { Request, Response, NextFunction } from "express";
import todoValidator from "../../src/middlewares/todoValidator";
import validatorTester from "../../src/utils/validatorTester";
import type TodoItemType from "../../src/types/TodoItemType";

jest.mock("../../src/services/todoServices", () => {
  const todoData: TodoItemType[] = [{ id: "1", name: "Test" }];
  return {
    __esModule: true,
    default: {
      getTodo: (id: string) => todoData.find((item) => item.id === id),
    },
  };
});

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

  describe("createTodo", () => {
    it("should respond 400 with error msg if creating To-Do with name missing", async () => {
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

    it("should proceed to next middleware if creating To-Do with name", async () => {
      mockRequest.body = { name: "Test" };

      await validatorTester(
        mockRequest,
        mockResponse,
        mockNext,
        ...todoValidator.createTodo
      );

      expect(mockNext).toHaveBeenCalledTimes(todoValidator.createTodo.length);
    });
  });

  describe("updateTodo", () => {
    it("should respond 400 with error msg if updating To-Do with name missing", async () => {
      mockRequest.params = { id: "NOT_EXIST" };
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

    it("should respond 404 with error msg if updating To-Do with non-exist id", async () => {
      mockRequest.params = { id: "NOT_EXIST" };
      mockRequest.body = { name: "Test Update" };

      await validatorTester(
        mockRequest,
        mockResponse,
        mockNext,
        ...todoValidator.updateTodo
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "id 'NOT_EXIST' does not exist",
      });
    });

    it("should proceed to next middleware if updating To-Do with valid id and name", async () => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Test Update" };

      await validatorTester(
        mockRequest,
        mockResponse,
        mockNext,
        ...todoValidator.updateTodo
      );

      expect(mockNext).toHaveBeenCalledTimes(todoValidator.updateTodo.length);
    });
  });

  describe("deleteTodo", () => {
    it("should respond 404 with error msg if deleting To-Do with non-exist id", async () => {
      mockRequest.params = { id: "NOT_EXIST" };

      await validatorTester(
        mockRequest,
        mockResponse,
        mockNext,
        ...todoValidator.deleteTodo
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "id 'NOT_EXIST' does not exist",
      });
    });

    it("should proceed to next middleware if deleting To-Do with valid id", async () => {
      mockRequest.params = { id: "1" };

      await validatorTester(
        mockRequest,
        mockResponse,
        mockNext,
        ...todoValidator.deleteTodo
      );

      expect(mockNext).toHaveBeenCalledTimes(todoValidator.deleteTodo.length);
    });
  });
});
