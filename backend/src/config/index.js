import 'dotenv/config';
import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .trim()
    .valid('development', 'test', 'production')
    .default('development'),

  LOG_LEVEL: Joi.string()
    .trim()
    .valid('debug', 'info', 'warn', 'error')
    .default('info'),

  PORT: Joi.number().integer().min(1).max(65535).required(), // 0 is not an appropriate port number

  DATABASE_URL: Joi.string()
    .trim()
    .uri({ scheme: ['postgres', 'postgresql'] }) // scheme is the first part of a url before the ://
    .required(),
});

const rawConfig = {
  NODE_ENV: process.env.NODE_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
};

const { value, error } = envSchema.validate(rawConfig, {
  abortEarly: false,
  convert: true, // default is true, wrote it just to make it explicit
});

if (error) {
  const messages = error.details.map((detail) => detail.message).join('; ');

  throw new Error(`Config validation failed: ${messages}`);
}

const config = {
  port: value.PORT,
  logLevel: value.LOG_LEVEL,
  env: value.NODE_ENV,
  databaseUrl: value.DATABASE_URL,
};

Object.freeze(config);

export default config;
