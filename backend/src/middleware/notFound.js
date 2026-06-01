import AppError from '../errors/AppError.js';

function notFound(req, res) {
  throw AppError.notFound('Not found');
}

export default notFound;

// the point of this file is to be a general not found
