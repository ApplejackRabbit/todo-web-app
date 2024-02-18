import express from "express";
import type { ErrorRequestHandler } from "express";
import todoRouter from "./routes/todoRoute";

const jsonErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).send({ message: err.message });
};

const app = express();

app.use(express.json());

app.use("/todo", todoRouter);

app.get("*", (req, res) => {
  res
    .status(404)
    .json({ message: `Request path '${req.baseUrl}${req.path}' not found` });
});

app.use(jsonErrorHandler);

export default app;
