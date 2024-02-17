import { Pool } from "pg";
import dbConfig from "../config/dbConfig";
import type TodoItemType from "../types/TodoItemType";

const pool = new Pool(dbConfig);

const listTodos = async (): Promise<TodoItemType[]> => {
  const { rows } = await pool.query<TodoItemType>(
    "SELECT id::text, name FROM todo ORDER BY id DESC"
  );
  return rows;
};

const getTodo = async (id: string): Promise<TodoItemType | undefined> => {
  const { rows } = await pool.query<TodoItemType, [string]>(
    "SELECT id::text, name FROM todo WHERE id = $1",
    [id]
  );
  return rows[0];
};

const createTodo = async (name: string): Promise<TodoItemType> => {
  const { rows } = await pool.query<TodoItemType, [string]>(
    "INSERT INTO todo (name) VALUES ($1) RETURNING id::text, name",
    [name]
  );
  return rows[0];
};

const updateTodo = async (id: string, name: string): Promise<TodoItemType> => {
  const { rows } = await pool.query<TodoItemType, [string, string]>(
    "UPDATE todo SET name = $1 WHERE id = $2 RETURNING id::text, name",
    [name, id]
  );
  return rows[0];
};

const deleteTodo = async (id: string): Promise<Pick<TodoItemType, "id">> => {
  const { rows } = await pool.query<Pick<TodoItemType, "id">, [string]>(
    "DELETE FROM todo WHERE id = $1 RETURNING id::text",
    [id]
  );
  return rows[0];
};

export default {
  listTodos,
  getTodo,
  createTodo,
  updateTodo,
  deleteTodo,
};
