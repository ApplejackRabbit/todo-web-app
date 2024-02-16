import express from "express";
import todoController from "../controllers/todoController";
import todoValidator from "../middlewares/todoValidator";

const router = express.Router();

router.get("/", todoController.listTodos);

router.post("/", todoValidator.createTodo, todoController.createTodo);

router.put("/:id", todoValidator.updateTodo, todoController.updateTodo);

router.delete("/:id", todoController.deleteTodo);

export default router;
