export const strictValidationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
  convert: true,
};

// abortEarly: true stops at the first error, it is better to send every error to the client not just the first