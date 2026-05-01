import Joi from 'joi';
import { commonListFilters } from './commonSchemas.js';

export const listActiveResourcesQuerySchema = Joi.object({
  ...commonListFilters,
  sortBy: Joi.string().trim().valid('createdAt', 'name').default('createdAt'),
});

export const getActiveResourceByIdParamsSchema = Joi.object({
  resourceId: Joi.number().integer().min(1).required(),
});