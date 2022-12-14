# Camunda 8 Connector SDK for Node.js

[![](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community)
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)
[![](https://img.shields.io/badge/Lifecycle-Incubating-blue)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#incubating-)

**Note**: This is ***EXPERIMENTAL***. The [official Camunda (Java) SDK](https://github.com/camunda/connector-sdk) is still in active development, and this community SDK follows it. 

This a community project - a pure Node.js implementation of the official Camunda 8 Connector SDK. It is designed to follow the official Java SDK API ergonomics as closely as possible. 

Supports secret replacement and non-nullable (required) input process variables.

For a tutorial in using this SDK to write a connector for Camunda 8, see [this article](https://medium.com/@sitapati/how-to-build-a-camunda-8-connector-using-the-node-js-sdk-5eb3d798f9ff).

# Outbound Connector

To create an outbound connector:

Scaffold a new project and add the Node.js Connector SDK:

```bash
mkdir my-outbound-connector
cd my-outbound-connector
npm init --yes
tsc --init
npm i camunda-connector-sdk
```

Edit the `tsconfig.json` and enable the following two options:

```json
"experimentalDecorators": true,                
"emitDecoratorMetadata": true,       
```

Here is an example Outbound connector:

```typescript
import {
    BPMNError,
    Secret,
    OutboundConnector,
    OutboundConnectorFunction,
    OutboundConnectorContext,
    NotNull
} from 'camunda-connector-sdk'

class myDTO {
    @NotNull @Secret auth!: string
    @NotNull lat!: string
    @NotNull long!: string
    mightbe?: number
}

@OutboundConnector({
    name: "Test Connector",
    type: "io.camunda:connector-1",
    inputVariables: ["auth", "lat", "long", "mightbe"]
})
export class MyConnector implements OutboundConnectorFunction {
    async execute(context: OutboundConnectorContext) {
        const vars = context.getVariablesAsType(myDTO)
        context.validate(vars)
        context.replaceSecrets(vars)

        try {
            const outcome = await this.businessLogic(vars)
            
            // How to signal success, failure, or error

            if (outcome.status === 'OK') {
                // any return value is added to the process variables
                return { result: outcome.result }
            }

            if (outcome.status === 'BUSINESS_ERROR') {
                // Throw a BPMNError to raise a BPMN Error in the engine
                throw new BPMNError(outcome.message)
            }
        } catch (e: any) {
            // Throw to fail the job
            throw new Error('Technical error: ' + e.message)
        }
    }

    async businessLogic(vars: myDTO): string {
        // some business logic here
        // throw here to bubble up technical failure to the execute method
        return worked ? {
            status: 'OK',
            result
         } : {
            status: 'BUSINESS_ERROR'
            message
         }
    }
}
```
To expose your connector for Connector Runtimes, in the `index.ts` of your module, export your connector class as `Connector`, like this:

```typescript
import { MyConnector } from "./lib/MyConnector"
const Connector = MyConnector
export Connector
```

This provides a normalised interface for Connector Runtimes to be able to load your connector by convention.

For the Job Worker Connector Runtime see [connector-runtime-worker](./connector-runtime-worker/).