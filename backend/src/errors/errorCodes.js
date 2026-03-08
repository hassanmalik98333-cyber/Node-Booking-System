const errCodes = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_JSON: 'INVALID_JSON',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
};

Object.freeze(errCodes);

export default errCodes;

// used to avoid hard coding the error codes.
// this way I can avoid inconsistent error codes, and accidental miss spelling
// The error codes are in an object to make it cleaner and more centralized so that I dont have to export multiple variables.