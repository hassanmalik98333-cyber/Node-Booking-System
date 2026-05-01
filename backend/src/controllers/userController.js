import * as userServices from '../services/userService.js';
import * as userSchemas from '../validators/userSchemas.js';
import { success } from '../utils/response.js';
import validateWithJoi from '../utils/validateWithJoi.js';

export async function listActiveUsersController(req, res) {
  const queryParams = validateWithJoi({
    errorMessage: 'Invalid query parameters',
    schema: userSchemas.listActiveUsersQuerySchema,
    values: req.query,
  });

  const result = await userServices.listActiveUsersService(queryParams);

  return res.status(200).json(success(result.data, result.pagination));
} // for GET '/api/users'

export async function getActiveUserByIdController(req, res) {
  const params = validateWithJoi({
    errorMessage: 'Invalid userId parameter',
    schema: userSchemas.getActiveUserByIdParamsSchema,
    values: req.params,
  });

  const result = await userServices.getActiveUserByIdService(params.userId);

  return res.status(200).json(success(result.data));
} // for GET '/api/users/:userId'

export async function createUserController(req, res) {
  const userData = validateWithJoi({
    errorMessage: 'Invalid request body',
    schema: userSchemas.createUserBodySchema,
    values: req.body,
  });

  const result = await userServices.createUserService(userData);

  return res
    .status(201)
    .location(`/api/users/${result.data.id}`)
    .json(success(result.data));
}

export async function updateUserController(req, res) {
  const params = validateWithJoi({
    errorMessage: 'Invalid user id',
    schema: userSchemas.getActiveUserByIdParamsSchema,
    values: req.params,
  });

  const patchFields = validateWithJoi({
    errorMessage: 'Invalid request body',
    schema: userSchemas.updateUserBodySchema,
    values: req.body,
  });

  const userData = {
    userId: params.userId,
    ...patchFields,
  };

  const result = await userServices.updateUserService(userData);

  return res.status(200).json(success(result.data));
}
