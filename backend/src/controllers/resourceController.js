import * as resourceServices from '../services/resourceService.js';
import * as resourceSchemas from '../validators/resourceSchemas.js';
import { success } from '../utils/response.js';
import validateWithJoi from '../utils/validateWithJoi.js';

export async function listActiveResourcesController(req, res) {
  const queryParams = validateWithJoi({
    errorMessage: 'Invalid query params',
    schema: resourceSchemas.listActiveResourcesQuerySchema,
    values: req.query,
  });

  const result = await resourceServices.listActiveResourcesService(queryParams);

  return res.status(200).json(success(result.data, result.pagination));
}

export async function getActiveResourceByIdController(req, res) {
  const params = validateWithJoi({
    errorMessage: 'Invalid resourceId parameter',
    schema: resourceSchemas.getActiveResourceByIdParamsSchema,
    values: req.params,
  });

  const result = await resourceServices.getActiveResourceByIdService(
    params.resourceId,
  );

  return res.status(200).json(success(result.data));
}
