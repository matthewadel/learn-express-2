import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { initializeDB } from "./models/data-source";
import rootRouter from "./routes";

// app express
const app = express();

// middlewares
app.use(express.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

initializeDB();

// routes
app.use("/api", rootRouter);

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
