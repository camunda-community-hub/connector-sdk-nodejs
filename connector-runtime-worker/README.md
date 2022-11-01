# Camunda 8 Connector Job Worker Runtime for Node.js

This is a job worker runtime for Node.js Connectors for Camunda 8. 

To run your connectors using this runtime you have two options: 

* Wrapping your connector in code
* Mounting your connector(s) into a Docker image

## Wrapping your connector in code

Install the connector runtime to your connector project:

```bash
npm i camunda-connector-runtime-worker
```

Now, wrap your connector with the runtime:

```typescript
import { WorkerConnectorRuntime } from "camunda-connector-runtime-worker"
import { Connector } from "./lib/connector"

const runtime = new WorkerConnectorRuntime()

runtime.addOutboundConnector(Connector)
```

Put your Camunda 8 Connection credentials in the environment. The runtime uses the ZBClient zero-conf constructor.

