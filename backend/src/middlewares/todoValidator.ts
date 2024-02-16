import { body, validationResult } from "express-validator";
import type { RequestHandler } from "express";

const nameValidationRule = (): RequestHandler =>
  body("name").notEmpty().escape().withMessage("name is required");

const validationHandler = (): RequestHandler => (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({ message: firstError.msg });
  }
  next();
};

const createTodo: RequestHandler[] = [
  nameValidationRule(),
  validationHandler(),
];

const updateTodo: RequestHandler[] = [
  nameValidationRule(),
  validationHandler(),
];

export default {
  createTodo,
  updateTodo,
};
