class AppError extends Error {
  constructor({ statusCode, code, message, details, cause }) {
    super(message);

    this.name = 'AppError';
    // This overrides the default name "Error" from the parent Error class.
    // When you console.error an error created with this class,
    // it would show something like "AppError: Resource not found."
    // instead of "Error: Resource not found."
    this.statusCode = statusCode;
    this.code = code;

    if (details !== undefined) {
      this.details = details;
    }

    if (cause !== undefined) {
      this.cause = cause;
    } // use when for example you are translating db errors and you want to log the error
  }

  static validation(message, { details, cause } = {}) {
    const errorData = {
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message,
    };

    if (details !== undefined) {
      errorData.details = details;
    }

    if (cause !== undefined) {
      errorData.cause = cause;
    }

    return new AppError(errorData);
  }

  static badRequest(message, { code = 'BAD_REQUEST', details, cause } = {}) {
    const errorData = {
      statusCode: 400,
      code,
      message,
    };

    if (details !== undefined) {
      errorData.details = details;
    }

    if (cause !== undefined) {
      errorData.cause = cause;
    }

    return new AppError(errorData);
  }

  static notFound(message, { code = 'NOT_FOUND', details, cause } = {}) {
    // It needs to default to {} otherwise js would try to destructure undefined if the second argument is missing, which would result in an error
    const errorData = {
      statusCode: 404,
      code,
      message,
    };

    if (details !== undefined) {
      errorData.details = details;
    }

    if (cause !== undefined) {
      errorData.cause = cause;
    }

    return new AppError(errorData);
  }

  static conflict(message, { code = 'CONFLICT', details, cause } = {}) {
    const errorData = {
      statusCode: 409,
      code,
      message,
    };

    if (details !== undefined) {
      errorData.details = details;
    }

    if (cause !== undefined) {
      errorData.cause = cause;
    }

    return new AppError(errorData);
  }
}

export default AppError;
