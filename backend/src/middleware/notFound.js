import errCodes from '../errors/errorCodes.js';
import { error } from '../utils/response.js';

function notFound(req, res) {
  return res.status(404).json(error(errCodes.NOT_FOUND, 'Not Found'));
}

export default notFound;
