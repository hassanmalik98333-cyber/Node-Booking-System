import Joi from 'joi';

export const commonListFilters = {
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().min(1).max(100),
  sortDirection: Joi.string().trim().valid('asc', 'desc').default('desc'),
};
