import AppError from '../errors/AppError.js';
import ERROR_CODES from '../errors/errorCodes.js';

export default function requireRole(allowedRoles) {
  return function requireRoleMiddleware(req, res, next) {
    if (req.auth === undefined) {
      throw new Error(
        'requireRole must be placed after requireAuth and loadCurrentStateOfAuthUser.',
      );
    }

    if (!allowedRoles.includes(req.auth.role)) {
      throw AppError.forbidden('Forbidden.');
    }

    return next();
  };
}
