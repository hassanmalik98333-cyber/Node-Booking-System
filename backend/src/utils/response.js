function error(code, message) {
  return { success: false, error: { code, message } };
}

function success(data) {
  return { success: true, data };
}

export { error, success };

// these are helper function to reduce repetition and to have consistent response envelops
