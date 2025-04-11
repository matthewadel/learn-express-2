import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { initializeDB } from "./models/data-source";
import rootRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

// this block must be in the same order
const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", rootRouter);

app.use(errorHandler);
/**
 * express.json to ensure that body reaches correctly to routes
 * morgan must be before routes to ensure that logs are created
 * routes must be before error handler
 */
initializeDB();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
