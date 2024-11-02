import { ErrorRequestHandler } from "express";
import Container from "typedi";

import ApiError, { API_ERRORS } from "../lib/api-error";
import { LOGGER } from "../lib/logger";

const logger = Container.get(LOGGER);

const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
  if (error instanceof ApiError) {
    res
      .status(error.statusCode)
      .json({ error: error.errorName, message: error.message });

    return;
  }

  logger.error(error);

  const serverError = API_ERRORS.internalServerError;

  res
    .status(serverError.statusCode)
    .json({ error: serverError.errorName, message: "Unexpected error" });
};

export default errorHandler;
