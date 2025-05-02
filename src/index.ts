import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { initializeDB } from "./models";
import rootRouter from "./routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import path from "path";
import { getEnv } from "./utils/validateEnv";
import { NotFoundError } from "./utils/errors";

// this block must be in the same order
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (getEnv().NODE_ENV === "development") {
  app.use(morgan("dev"));
}

initializeDB().then(() => {
  app.use("/api", rootRouter);
  app.all("/*splat", (req: Request, res: Response, next: NextFunction) => {
    throw new NotFoundError("Route not found");
    // next({ success: false, message: "Route not found" });
  });

  // handle express errors
  app.use(globalErrorHandler);

  // handle not express errors like db connection errors
  process.on("unhandledRejection", (error: Error) => {
    console.log("unhandled error happened", error);
    process.exit();
  });
});

/**
 * express.json to ensure that body reaches correctly to routes
 * morgan must be before routes to ensure that logs are created
 * routes must be before error handler
 */

const PORT = getEnv().PORT ?? 5001;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
