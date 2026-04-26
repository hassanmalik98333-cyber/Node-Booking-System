import ERROR_CODES from '../errors/errorCodes.js';
import { error } from '../utils/response.js';

function notFound(req, res) {
  return res.status(404).json(error(ERROR_CODES.NOT_FOUND, 'Not Found'));
}

export default notFound;
