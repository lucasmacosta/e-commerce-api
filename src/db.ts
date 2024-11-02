import { Sequelize } from "sequelize-typescript";

import config from "./config";

const sequelize = new Sequelize(config.db.uri, {
  models: [__dirname + "/models"],
  logging: config.db.logging ? console.log : false,
});

export default sequelize;
