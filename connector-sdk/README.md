# Camunda 8 Connector SDK for Node.js

[![](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community)
![Compatible with: Camunda Platform 8](https://img.shields.io/badge/Compatible%20with-Camunda%20Platform%208-0072Ce)
[![](https://img.shields.io/badge/Lifecycle-Incubating-blue)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#incubating-)

This a pure Node.js implementation of the Camunda 8 Connector SDK. It is designed to follow the official Java SDK API ergonomics as closely as possible.

Supports secret replacement and non-nullable (required) input process variables.

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
export class Connector implements OutboundConnectorFunction {
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

To use the Node.js Job Worker Connector Runtime, you need to export your Connector Class as the named export `Connector` from your package. The Connector Runtime uses this as a convention for discovering and loading your connector.