import axios from "axios";
import type { AxiosResponse } from "axios";
import TodoItemType from "../types/TodoItemType";

type ListResBody = { results: TodoItemType[] };

type CreateReqBody = Omit<TodoItemType, "id">;
type CreateResBody = TodoItemType;

type UpdateReqBody = CreateReqBody;
type UpdateResBody = CreateResBody;

type DeleteResBody = Pick<TodoItemType, "id">;

const instance = axios.create({
  timeout: 2000,
});

const listTodos = async () => {
  const { data } = await instance.get<ListResBody>("/todo/all");
  return data;
};

const createTodo = async (name: string) => {
  const { data } = await instance.post<
    CreateResBody,
    AxiosResponse<CreateResBody>,
    CreateReqBody
  >("/todo", { name });
  return data;
};

const updateTodo = async (id: string, name: string) => {
  const { data } = await instance.put<
    UpdateResBody,
    AxiosResponse<UpdateResBody>,
    UpdateReqBody
  >(`/todo/${id}`, { name });
  return data;
};

const deleteTodo = async (id: string) => {
  const { data } = await instance.delete<DeleteResBody>(`/todo/${id}`);
  return data;
};

export default {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
