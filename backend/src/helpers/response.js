export const error = (response, errorCode, errors) => {
  response.status(400);
  return response.send({
    code: errorCode,
    message: errors[errorCode],
  });
};

export const success = (response, data) => {
  response.status(200);
  return response.send({
    data,
  });
};
