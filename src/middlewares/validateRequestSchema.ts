import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError, ZodIssue } from "zod";
import { BadRequestError } from "../utils/errors";

// ** arg => schema
export function validateRequestSchema(schema: AnyZodObject) {
  // ** returns a middleware
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log({
        body: req.body,
        query: req.query,
        params: req.params
      });
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params
      });

      // Update the request object properties without reassigning
      if (parsedData.body) Object.assign(req.body, parsedData.body);
      if (parsedData.query) Object.assign(req.query, parsedData.query);
      if (parsedData.params) Object.assign(req.params, parsedData.params);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Create a structured validation errors object
        const validationErrors = error.errors.map((err: ZodIssue) => {
          const fieldPath =
            err.path.join(".").split("body.")[1] || err.path.join(".");
          return {
            field: fieldPath,
            message: err.message
          };
        });

        console.log(
          "Validation Errors:",
          JSON.stringify(validationErrors, null, 2)
        );
        next(new BadRequestError("Validation Failed", validationErrors));
      } else {
        console.log(error);
        next(error);
      }
    }
  };
}
