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
  createTodo,
  updateTodo,
  deleteTodo,
};
