import express from "express";
import todoRouter from "./routes/todoRoute";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/todo", todoRouter);

export default app;
