import type { RequestHandler } from "express";
import todoServices from "../services/todoServices";
import type TodoItemType from "../types/TodoItemType";

type ListResBody = { results: TodoItemType[] };

type CreateReqBody = Omit<TodoItemType, "id">;
type CreateResBody = TodoItemType;

type UpdateReqParams = { id: string };
type UpdateReqBody = CreateReqBody;
type UpdateResBody = CreateResBody;

type DeleteReqParams = UpdateReqParams;
type DeleteResBody = Pick<TodoItemType, "id">;

const listTodos: RequestHandler<{}, ListResBody> = async (req, res, next) => {
  try {
    const todos = await todoServices.listTodos();
    res.json({ results: todos });
  } catch (error) {
    next(error);
  }
};

const createTodo: RequestHandler<{}, CreateResBody, CreateReqBody> = async (
  req,
  res,
  next
) => {
  const { name } = req.body;
  try {
    const todoCreated = await todoServices.createTodo(name);
    res.status(201).json(todoCreated);
  } catch (error) {
    next(error);
  }
};

const updateTodo: RequestHandler<
  UpdateReqParams,
  UpdateResBody,
  UpdateReqBody
> = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const todoUpdated = await todoServices.updateTodo(id, name);
    res.json(todoUpdated);
  } catch (error) {
    next(error);
  }
};

const deleteTodo: RequestHandler<DeleteReqParams, DeleteResBody> = async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  try {
    const todoDeleted = await todoServices.deleteTodo(id);
    res.json(todoDeleted);
  } catch (error) {
    next(error);
  }
};

export default {
  listTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
