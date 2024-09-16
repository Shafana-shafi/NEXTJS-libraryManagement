import dotenv from "dotenv";
dotenv.config();

interface AppEnv {
  DATABASE_URL: string;
}

export const AppEnvs: AppEnv = {
  DATABASE_URL: process.env.DATABASE_URL as string,
};
console.log(AppEnvs);
if (!AppEnvs.DATABASE_URL) {
  throw new Error("Missing required environment variable: DATABASE_URL");
}
