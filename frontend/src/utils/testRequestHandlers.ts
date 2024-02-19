import { http, HttpResponse } from "msw";
import fakeTodoData from "../fake-data/fakeTodo";
import type TodoItemType from "../types/TodoItemType";

type ListResBody = { results: TodoItemType[] };

type CreateReqBody = Omit<TodoItemType, "id">;
type CreateResBody = TodoItemType;

type UpdateReqParams = { id: string };
type UpdateReqBody = CreateReqBody;
type UpdateResBody = CreateResBody;

type DeleteReqParams = UpdateReqParams;
type DeleteResBody = Pick<TodoItemType, "id">;

type ErrorResBody = { message: string };

let sequenceNum = 1;
let todoData: TodoItemType[] = [...fakeTodoData];

export const resetData = () => {
  sequenceNum = 1;
  todoData = [...fakeTodoData];
};

const listTodos = http.get<{}, {}, ListResBody>("/todo/all", async () => {
  return HttpResponse.json({
    results: todoData,
  });
});

const createTodo = http.post<{}, CreateReqBody, CreateResBody>(
  "/todo",
  async ({ request }) => {
    const { name } = await request.json();
    const newItem = { id: (++sequenceNum).toString(), name };
    todoData.push(newItem);
    return HttpResponse.json(newItem);
  }
);

const updateTodo = http.put<
  UpdateReqParams,
  UpdateReqBody,
  UpdateResBody | ErrorResBody
>("/todo/:id", async ({ params, request }) => {
  const { id } = params;
  const { name } = await request.json();
  const index = todoData.findIndex((item) => item.id === id);
  if (index > -1) {
    todoData[index] = { ...todoData[index], name };
    return HttpResponse.json(todoData[index]);
  }
  return HttpResponse.json(
    { message: `id '${id}' does not exist` },
    { status: 404 }
  );
});

const deleteTodo = http.delete<
  DeleteReqParams,
  {},
  DeleteResBody | ErrorResBody
>("/todo/:id", ({ params }) => {
  const { id } = params;
  const index = todoData.findIndex((item) => item.id === id);
  if (index > -1) {
    todoData.splice(index, 1);
    return HttpResponse.json({ id });
  }
  return HttpResponse.json(
    { message: `id '${id}' does not exist` },
    { status: 404 }
  );
});

export const handlers = [listTodos, createTodo, updateTodo, deleteTodo];
