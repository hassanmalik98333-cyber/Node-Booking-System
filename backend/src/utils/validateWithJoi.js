import AppError from '../errors/AppError.js';
import joiErrorDetails from '../validators/joiErrorDetails.js';
import { strictValidationOptions } from '../validators/joiOptions.js';

function validateWithJoi({errorMessage, schema, values, validationOptions = strictValidationOptions}) {
  const { value, error } = schema.validate(values, validationOptions);

  if (error !== undefined) {
    const details = joiErrorDetails(error);

    throw AppError.validation(errorMessage, {
      details,
      cause: error,
    });
  }

  return value;
}

export default validateWithJoi;
