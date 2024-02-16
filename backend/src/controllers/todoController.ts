import type { RequestHandler } from "express";
import type TodoItemType from "../types/TodoItemType";

type CreateReqBody = Omit<TodoItemType, "id">;

type UpdateReqParams = { id: string };
type UpdateReqBody = CreateReqBody;

type DeleteReqParams = UpdateReqParams;

const listTodos: RequestHandler = (req, res) => {
  res.send("List To-Dos");
};

const createTodo: RequestHandler<{}, any, CreateReqBody> = (req, res) => {
  const { name } = req.body;
  res.send(`Create To-Do with name "${name}"`);
};

const updateTodo: RequestHandler<UpdateReqParams, any, UpdateReqBody> = (
  req,
  res
) => {
  const { id } = req.params;
  const { name } = req.body;
  res.send(`Update To-Do #${id} with name "${name}"`);
};

const deleteTodo: RequestHandler<DeleteReqParams> = (req, res) => {
  const { id } = req.params;
  res.send(`Delete To-Do #${id}`);
};

export default {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
