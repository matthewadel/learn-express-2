import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { initializeDB } from "./models/data-source";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

initializeDB();

app.get("/", (req, res) => {
  res.send("api");
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
