# Backend challenge: eCommerce API

This file documents the proposed solution for the "eCommerce API" take home challenge.

# Configuration

Run the `npm install` command to install dependencies. On Linux it works out of the box, on MacOS I had to use Node.js 20 and run the `npm config set python "$(which python3)"` command first before I was able to compile the sqlite dependency. In order to install that Node.js version the command `nvm install` can be used at the root of the repo, provided you are using `nvm` to manage Node.js versions.

# Quickstart

- Run `npm install` to install dependencies.
- Copy the `.env.sample` file into `.env` and make changes if needed.
- Run the `npm run start:dev` to start the server in development mode.
- The API will now be available on http://localhost:3000
- Use the provided postman collection on `doc/eCommerce API.postman_collection.json` to perform requests to the available endpoints.

# Running the API in dev mode

When the API is started with the `npm run start:dev`, it will reload automatically when sources are updated.

# Building the API

The API can be built with the `npm run build` command, which will generate the target javascript files.

# Starting the API

After build, the API can be started with the `npm start` command.

# Running tests

Tests are ran with the `npm run test` command. For now only E2E are implemented, using the same in-memory sqlite DB than when running the API in development mode.

# Using docker

The API can be built as a container using the docker command as follows to build the `e-commerce-api:latest` tag:

```shell
docker buildx build . -t e-commerce-api:latest
```

Once the image is built, a container can be run using this command to expose the API on port 3000:

```shell
docker run --rm --publish 3000:3000 e-commerce-api:latest
```

# Using a different database

Since the API uses the sequelize library, using another database should as simple as installing the necessary modules and then setting the `DB_URI` env var appropriately. A `docker-compose` file is provided that allows to use a postgresql database, it can be used with the `docker-compose up -d`, which will take care of setting up the DB and running the API using it. The API can then be accessed through port 3000. The `docker-compose down` will take care of bringing the services down.

# Further improvements:

Here's a list of things that are left pending for future improvements to the API in terms of architecture:

- Add unit tests, currently only E2E are implemented using the API endpoints.
- Use the repository pattern to talk with the DB.
- Add proper API documentation, using swagger or similar.
- If all endpoints require to select the attributes to be returned, then most likely GraphQL would be a better option.

Regarding the actual eCommerce functionality, there are lots of things to be done:

- Add ability to control products stock.
- Allow to set different statuses for orders.
- If orders are able to be on different states, then a mechanism to update line items must be implemented.
- Move the logic to calculate the order price into model/repository
