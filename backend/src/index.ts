import "dotenv/config";
import app from "./app";

const port = 8080;

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
