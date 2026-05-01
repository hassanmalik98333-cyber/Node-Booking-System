import Joi from 'joi';
import { commonListFilters } from './commonSchemas.js';

export const listActiveUsersQuerySchema = Joi.object({
  ...commonListFilters,
  role: Joi.string().trim().valid('user', 'admin'),
  sortBy: Joi.string()
    .trim()
    .valid('createdAt', 'username', 'email', 'role')
    .default('createdAt'),
});

export const getActiveUserByIdParamsSchema = Joi.object({
  userId: Joi.number().integer().min(1).required(),
});

export const createUserBodySchema = Joi.object({
  username: Joi.string().trim().min(1).required(),
  name: Joi.string().trim().min(1).optional(),
  email: Joi.string().trim().lowercase().email().required(),
  role: Joi.string().trim().valid('user', 'admin').default('user'),
});

export const updateUserBodySchema = Joi.object({
  username: Joi.string().trim().min(1).optional(),
  name: Joi.string().trim().min(1).allow(null).optional(), // allow(null) to allow clearing name
  email: Joi.string().trim().lowercase().email().optional(),
})
  .min(1)
  .required();
