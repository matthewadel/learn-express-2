import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.string().transform(Number).default("5000"),

  // database config
  DB_TYPE: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  BASE_URL: z.string(),

  // email config
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_SECURE: z.string(),

  // jwt config
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default("24h")
});

let env: z.infer<typeof envSchema>;

const validatedEnv = () => {
  try {
    env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.log(error);
    process.exit();
  }
};

const getEnv = () => {
  if (!env) return validatedEnv();
  return env;
};
export { validatedEnv, getEnv };
