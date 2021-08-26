export const error = (response, errorCode, errors) => {
  response.status(400);
  response.send({
    code: errorCode,
    message: errors[errorCode],
  });
};
