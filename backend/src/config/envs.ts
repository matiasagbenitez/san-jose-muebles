import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),

  // Database
  DB_USERNAME: get('DB_USERNAME').required().asString(),
  DB_PASSWORD: get('DB_PASSWORD').required().asString(),
  DB_DATABASE: get('DB_DATABASE').required().asString(),
}