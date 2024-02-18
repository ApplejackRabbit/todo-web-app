import request from "supertest";
import app from "../src/app";
import todoService from "../src/services/todoService";
import type TodoItemType from "../src/types/TodoItemType";

jest.mock("../src/services/todoService", () => {
  let sequenceNum = 1;
  const todoData: TodoItemType[] = [{ id: "1", name: "Test" }];
  return {
    __esModule: true,
    default: {
      listTodos: jest.fn(async () => todoData),
      getTodo: async (id: string) => todoData.find((item) => item.id === id),
      createTodo: async (name: string) => {
        const newItem = { id: (++sequenceNum).toString(), name };
        todoData.push(newItem);
        return newItem;
      },
      updateTodo: async (id: string, name: string) => {
        const index = todoData.findIndex((item) => item.id === id);
        if (index > -1) {
          todoData[index] = { ...todoData[index], name };
          return todoData[index];
        }
        return undefined;
      },
      deleteTodo: async (id: string) => {
        const index = todoData.findIndex((item) => item.id === id);
        if (index > -1) {
          todoData.splice(index, 1);
          return { id };
        }
        return undefined;
      },
    },
  };
});

describe("app", () => {
  it("should return 200 with list of todos for GET /todo", async () => {
    const response = await request(app).get("/todo");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ results: [{ id: "1", name: "Test" }] });
  });

  it("should return 201 with a created todo for POST /todo", async () => {
    const response = await request(app)
      .post("/todo")
      .send({ name: "Test Create" })
      .set("Accept", "application/json");
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "2", name: "Test Create" });
  });

  it("should return 200 with an updated todo for PUT /todo/:id", async () => {
    const response = await request(app)
      .put("/todo/1")
      .send({ name: "Test Update" })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1", name: "Test Update" });
  });

  it("should return 200 with a deleted id for DELETE /todo/:id", async () => {
    const response = await request(app).delete("/todo/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "1" });
  });

  it("should return 404 for unknown route", async () => {
    const response = await request(app).get("/unknown");
    expect(response.status).toBe(404);
  });

  it("should return 500 with an error message if error is thrown", async () => {
    if (jest.isMockFunction(todoService.listTodos)) {
      todoService.listTodos.mockRejectedValueOnce(new Error("Test Error"));
    }
    const response = await request(app).get("/todo");
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Test Error" });
  });
});
