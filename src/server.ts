import { createServer } from "http";
import Container from "typedi";

import { app } from "./app";
import sequelize from "./db";
import { LOGGER } from "./lib/logger";

const port = process.env.PORT || 3000;

(async () => {
  await sequelize.sync({ force: true });

  const logger = Container.get(LOGGER);

  createServer(app).listen(port, () =>
    logger.info(`Server running on port ${port}`)
  );
})();
