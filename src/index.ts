import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { initializeDB } from "./models/data-source";
import rootRouter from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

// this block must be in the same order
const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", rootRouter);
app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
  next({ success: false, message: "Route not found" });
});

// handle express errors
app.use(globalErrorHandler);

// handle not express errors like db connection errors
process.on("unhandledRejection", (error: Error) => {
  console.log("unhandled error happened", error);
  process.exit();
});

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
