import { Container, Token } from "typedi";
import winston, { Logger } from "winston";

import config from "../config";

const logger = winston.createLogger({
  level: config.logger.level,
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export const LOGGER = new Token<Logger>("LOGGER");

Container.set(LOGGER, logger);
