const ERROR_CODES = {
  INVALID_JSON: 'INVALID_JSON',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  UNSUPPORTED_MEDIA_TYPE: 'UNSUPPORTED_MEDIA_TYPE',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  AVAILABILITY_WINDOW_NOT_FOUND: 'AVAILABILITY_WINDOW_NOT_FOUND',
  RESERVATION_NOT_FOUND: 'RESERVATION_NOT_FOUND',
};
// enum-like style for common error codes

Object.freeze(ERROR_CODES);

export default ERROR_CODES;

// used to avoid hard coding the error codes.
// this way I can avoid inconsistent error codes, and accidental miss spelling
// The error codes are in an object to make it cleaner and more centralized so that I dont have to export multiple variables.
// This object is for error codes that are used multiple times, not one time use error codes
