import { z } from "zod";
import { operatorMap } from "./getPaginatedResultsWithFilter";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getALlItemsValidationWithPagination = (schema: any) => {
  return z.object({
    query: z
      .object({
        page: z
          .number({
            invalid_type_error: "page must be a number"
          })
          .positive({ message: "page must be a positive number" })
          .optional(),
        limit: z
          .number({
            invalid_type_error: "limit must be a number"
          })
          .positive({ message: "limit must be a positive number" })
          .optional(),
        search_text: z.string().optional(),
        sort_by: z
          .enum(Object.keys(schema) as [string, ...string[]], {
            invalid_type_error: `sort_by must be one of these keys ${Object.keys(schema).join(", ")}`
          })
          .optional(),
        sort_direction: z
          .enum(["ASC", "DESC"], {
            invalid_type_error: "sort_direction must be ASC or DESC"
          })
          .optional(),
        filter_by: z
          .enum(Object.keys(schema) as [string, ...string[]], {
            invalid_type_error: `filter_by must be one of these keys ${Object.keys(schema).join(", ")}`
          })
          .optional(),
        filter_operator: z
          .enum(Object.keys(operatorMap) as [string, ...string[]], {
            invalid_type_error: `filter_operator must be one of these keys ${Object.keys(
              operatorMap
            ).join(", ")}`
          })
          .optional(),
        filter_value: z.union([z.string(), z.array(z.string())]).optional()
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .superRefine((val: any, ctx) => {
        const filterOperator = val.filter_operator;
        if (filterOperator === "between" || filterOperator === "in") {
          if (!Array.isArray(JSON.parse(val.filter_value))) {
            ctx.addIssue({
              code: z.ZodIssueCode.invalid_type,
              message: `filter_value must be an array of numbers when filter_operator is '${filterOperator}'`,
              expected: "array",
              received: typeof val
            });
          }
        }
      })
  });
};
