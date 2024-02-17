import type { RequestHandler } from "express";
import todoService from "../services/todoService";
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
    const todos = await todoService.listTodos();
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
    const todoCreated = await todoService.createTodo(name);
    if (!todoCreated) {
      throw new Error("Something went wrong when creating To-Do");
    }
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
    const todoUpdated = await todoService.updateTodo(id, name);
    if (!todoUpdated) {
      throw new Error("Something went wrong when updating To-Do");
    }
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
    const todoDeleted = await todoService.deleteTodo(id);
    if (!todoDeleted) {
      throw new Error("Something went wrong when deleting To-Do");
    }
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
