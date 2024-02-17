import type { PoolConfig } from "pg";

const {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
} = process.env;

const dbConfig: PoolConfig = {
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT || "5432"),
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,

  connectionTimeoutMillis: 2000,
};

export default dbConfig;
