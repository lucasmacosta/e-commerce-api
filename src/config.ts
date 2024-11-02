import "dotenv/config";

const config = {
  env: process.env.NODE_ENV,
  db: {
    uri: process.env.DB_URI || "",
    logging: process.env.DB_LOGGING === "true",
  },
  logger: {
    level: process.env.LOGGER_LEVEL || "info",
  },
};

export default config;
