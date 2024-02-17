import type { Request, Response, NextFunction } from "express";
import todoController from "../../src/controllers/todoController";
import todoService from "../../src/services/todoService";

jest.mock("../../src/services/todoService", () => {
  return {
    __esModule: true,
    default: {
      listTodos: jest.fn(async () => [{ id: "1", name: "Test" }]),
      createTodo: jest.fn(async (name: string) => ({ id: "2", name })),
      updateTodo: jest.fn(async (id: string, name: string) => ({ id, name })),
      deleteTodo: jest.fn(async (id: string) => ({ id })),
    },
  };
});

describe("todoController", () => {
  let mockRequest: Request<{ id: string }>;
  let mockResponse: Response;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {} as Request<{ id: string }>;

    mockResponse = {} as Response;
    mockResponse.status = jest.fn().mockReturnThis();
    mockResponse.json = jest.fn().mockReturnThis();

    mockNext = jest.fn();
  });

  describe("listTodos", () => {
    it("should respond with data if no errors", async () => {
      await todoController.listTodos(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({
        results: [{ id: "1", name: "Test" }],
      });
    });

    it("should pass error to next function if error is thrown from DAO", async () => {
      if (jest.isMockFunction(todoService.listTodos)) {
        todoService.listTodos.mockRejectedValueOnce(new Error("Test Error"));
      }
      await todoController.listTodos(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Test Error" })
      );
    });
  });

  describe("createTodo", () => {
    beforeEach(() => {
      mockRequest.body = { name: "Test Create" };
    });

    it("should respond with 201 and created item if no errors", async () => {
      await todoController.createTodo(mockRequest, mockResponse, mockNext);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: "2",
        name: "Test Create",
      });
    });

    it("should pass error to next function if error is thrown from DAO", async () => {
      if (jest.isMockFunction(todoService.createTodo)) {
        todoService.createTodo.mockRejectedValueOnce(new Error("Test Error"));
      }
      await todoController.createTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Test Error" })
      );
    });

    it("should pass error to next function if DAO returns undefined", async () => {
      if (jest.isMockFunction(todoService.createTodo)) {
        todoService.createTodo.mockResolvedValueOnce(undefined);
      }
      await todoController.createTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Something went wrong when creating To-Do",
        })
      );
    });
  });

  describe("updateTodo", () => {
    beforeEach(() => {
      mockRequest.params = { id: "1" };
      mockRequest.body = { name: "Test Update" };
    });

    it("should respond with updated item if no errors", async () => {
      await todoController.updateTodo(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({
        id: "1",
        name: "Test Update",
      });
    });

    it("should pass error to next function if error is thrown from DAO", async () => {
      if (jest.isMockFunction(todoService.updateTodo)) {
        todoService.updateTodo.mockRejectedValueOnce(new Error("Test Error"));
      }
      await todoController.updateTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Test Error" })
      );
    });

    it("should pass error to next function if DAO returns undefined", async () => {
      if (jest.isMockFunction(todoService.updateTodo)) {
        todoService.updateTodo.mockResolvedValueOnce(undefined);
      }
      await todoController.updateTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Something went wrong when updating To-Do",
        })
      );
    });
  });

  describe("deleteTodo", () => {
    beforeEach(() => {
      mockRequest.params = { id: "1" };
    });

    it("should respond with deleted id if no errors", async () => {
      await todoController.deleteTodo(mockRequest, mockResponse, mockNext);
      expect(mockResponse.json).toHaveBeenCalledWith({ id: "1" });
    });

    it("should pass error to next function if error is thrown from DAO", async () => {
      if (jest.isMockFunction(todoService.deleteTodo)) {
        todoService.deleteTodo.mockRejectedValueOnce(new Error("Test Error"));
      }
      await todoController.deleteTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Test Error" })
      );
    });

    it("should pass error to next function if DAO returns undefined", async () => {
      if (jest.isMockFunction(todoService.deleteTodo)) {
        todoService.deleteTodo.mockResolvedValueOnce(undefined);
      }
      await todoController.deleteTodo(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Something went wrong when deleting To-Do",
        })
      );
    });
  });
});
