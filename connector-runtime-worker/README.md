# Camunda 8 Connector Job Worker Runtime for Node.js

This is a job worker runtime for Node.js Connectors for Camunda 8. 

To run your connectors using this runtime you have two options: 

* Wrapping your connector in code
* Mounting your connector(s) into a Docker image

## Option 1: Wrapping your connector in code

Install the connector runtime to your connector project:

```bash
npm i camunda-connector-worker-runtime
```

Now, wrap your connector with the runtime:

```typescript
import { WorkerConnectorRuntime } from "camunda-connector-worker-runtime"
import { Connector } from "./lib/connector"

const runtime = new WorkerConnectorRuntime()

runtime.addOutboundConnector(Connector)
```

Put your Camunda 8 Connection credentials in the environment. The runtime uses the ZBClient zero-conf constructor.

Set the environment variable `LOG_LEVEL=INFO` to get console logging. In a future release the log provider will become injectable.

## Option 2: Mount your connectors into a Docker image

You can use a Docker image of the Connector Runtime to run your connectors. 

- Create a directory for the connectors, and initialise a `package.json`:

```bash
mkdir __connectors__
cd __connectors__
npm init -y
```

- Install any connectors as packages in this project, for example:

```bash
npm i camunda-8-connector-openweather-api
```

- Create a `docker-compose.yml` file in the project with the following content:

```yml
version: '2'

services:
  runtime:
    volumes:
     - .:/opt/connectors
    image: sitapati/c8-connector-worker-runtime-nodejs:latest
    environment:
      - LOG_LEVEL=INFO
      - ZEEBE_ADDRESS
      - ZEEBE_CLIENT_ID
      - ZEEBE_CLIENT_SECRET
      - ZEEBE_AUTHORIZATION_SERVER_URL
```

- Add any environment variables that are needed for your connectors' secrets

- Put your Camunda 8 API credentials and any connector secrets in a file `.env` in the project.

- Run the Docker container with the following command:

```bash
docker compose --env-file .env up
```