import { Sequelize } from "sequelize-typescript";
import { LOGGER } from "./lib/logger";
import Container from "typedi";

import config from "./config";

const logger = Container.get(LOGGER);

const sequelize = new Sequelize(config.db.uri, {
  models: [__dirname + "/models"],
  logging: config.db.logging ? console.log : false,
});

export default sequelize;
