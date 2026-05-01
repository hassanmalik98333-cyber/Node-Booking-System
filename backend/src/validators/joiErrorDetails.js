function joiErrorDetails(joiError) {
  return joiError.details.map((detail) => {
    return {
      field: detail.path[0], 
      // Update this later if Joi validation is used for arrays or nested objects
      // For now, this project's Joi schemas are flat, so each path should have one value
      message: detail.message,
    };
  });
}
// For each object in the details array, it will put one object
// with field and message into the returned array.
/*
[
  {
    field: detail.path[0],
    message: detail.message,
  },
  {
    field: detail.path[0],
    message: detail.message,
  }
]
*/

export default joiErrorDetails;
