import type { Request, Response, NextFunction, RequestHandler } from "express";

const validatorTester = async (
  req: Request,
  res: Response,
  next: NextFunction,
  ...validators: Array<RequestHandler>
) => {
  for (let i = 0; i < validators.length - 1; i++) {
    // Need to await here because middlewares from "express-validator" are async functions
    await validators[i](req, res, next);
  }

  validators[validators.length - 1](req, res, next);
};

export default validatorTester;
