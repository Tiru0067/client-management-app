const sendResponse = (
  res,
  statusCode,
  message,
  data = null,
  extraFields = {}
) => {
  const response = {
    status: statusCode,
    message: typeof message === "string" ? message : JSON.stringify(message),
    ...extraFields,
  };

  // Only include data if it's provided
  if (data !== null && data !== undefined) response.data = data;

  res.status(statusCode).json(response);
};

module.exports = sendResponse;
