import { missingResource } from '../errors/errorCodes.js';
import { error } from '../utils/response.js';

function notFound(req, res) {
  return res.status(404).json(error(missingResource, 'Not Found'));
}

export default notFound;
