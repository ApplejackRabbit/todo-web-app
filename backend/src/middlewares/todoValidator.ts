import { body, param, validationResult } from "express-validator";
import type { ValidationChain, ValidationError } from "express-validator";
import type { RequestHandler, Response } from "express";
import todoService from "../services/todoService";

const nameValidationRule = (): ValidationChain =>
  body("name")
    .notEmpty()
    .escape()
    .withMessage("name is required")
    .bail({ level: "request" });

const idValidationRule = (): ValidationChain =>
  param("id")
    .escape()
    .custom(async (id: string) => {
      const result = await todoService.getTodo(id);
      if (!result) {
        throw new Error(`id '${id}' does not exist`);
      }
    })
    .bail({ level: "request" });

const isIdNotExistError = (error: ValidationError): boolean =>
  error.type === "field" && error.location === "params" && error.path === "id";

const processError = (error: ValidationError, res: Response) => {
  if (isIdNotExistError(error)) {
    res.status(404).json({ message: error.msg });
  } else {
    res.status(400).json({ message: error.msg });
  }
};

const validationHandler = (): RequestHandler => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    processError(firstError, res);
  } else {
    next();
  }
};

const createTodo: RequestHandler[] = [
  nameValidationRule(),
  validationHandler(),
];

const updateTodo: RequestHandler[] = [
  nameValidationRule(),
  idValidationRule(),
  validationHandler(),
];

const deleteTodo: RequestHandler[] = [idValidationRule(), validationHandler()];

export default {
  createTodo,
  updateTodo,
  deleteTodo,
};
