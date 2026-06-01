import Joi from 'joi';
import { commonListFilters } from './commonSchemas.js';

export const listAvailabilityWindowsQuerySchema = Joi.object({
  ...commonListFilters,
  // sortDirection in commonFilters defaults to desc.
  // For listing windows I want startTime asc.
  sortDirection: Joi.string()
    .trim()
    .valid('asc', 'desc')
    .default('asc')
    .messages({
      'string.base': 'Sort direction must be a string.',
      'any.only': 'Sort direction must be either asc or desc.',
    }),

  sortBy: Joi.string()
    .trim()
    .valid('startTime', 'endTime', 'createdAt', 'updatedAt', 'deletedAt')
    .default('startTime')
    .messages({
      'string.base': 'Sort by must be a string.',
      'any.only':
        'Sort by must be one of startTime, endTime, createdAt, updatedAt, or deletedAt.',
    }),

  status: Joi.string()
    .trim()
    .lowercase()
    .valid('active', 'expired', 'deleted', 'all')
    .default('active')
    .messages({
      'string.base': 'Status must be a string.',
      'any.only': 'Status must be one of active, expired, deleted, or all.',
    }),

  resourceId: Joi.number().integer().min(1).messages({
    'number.base': 'Resource id must be a number.',
    'number.integer': 'Resource id must be an integer.',
    'number.min': 'Resource id must be at least 1.',
  }),

  ownerId: Joi.number().integer().min(1).messages({
    'number.base': 'Owner id must be a number.',
    'number.integer': 'Owner id must be an integer.',
    'number.min': 'Owner id must be at least 1.',
  }),
}).messages({ 'object.base': 'Query parameters must be an object.' });

export const getAvailabilityWindowByIdParamsSchema = Joi.object({
  availabilityWindowId: Joi.number().integer().min(1).required().messages({
    'number.base': 'Availability window id must be a number.',
    'number.integer': 'Availability window id must be an integer.',
    'number.min': 'Availability window id must be at least 1.',
    'any.required': 'Availability window id is required.',
  }),
})
  .required()
  .messages({ 'object.base': 'Parameters must be an object.' });
