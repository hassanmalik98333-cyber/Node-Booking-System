import { internalErr, invalidJson, badReq } from '../errors/errorCodes.js';
import { error } from '../utils/response.js';

export default function errorHandler(err, req, res, next) {
  
  if (err.type === 'entity.parse.failed') {
    return res.status(err.status).json(error(invalidJson, 'Invalid Json'));
  }

  if (err.code === 'BAD_REQUEST') {
    return res.status(err.status).json(error(badReq, 'Bad Request'));
  } // for client errors, triggered by throwing new BadRequestError(message)

  return res.status(500).json(error(internalErr, 'server error')); 
}   

// I used err.status for invalid json(comes by default) and bad request(from the badRequestError class) because they are available.
// with server error, ther is no err.status to use, so I had to hard code it.

