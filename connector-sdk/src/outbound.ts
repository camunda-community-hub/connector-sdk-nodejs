import "reflect-metadata";
import { OutboundConnectorContext } from "./outbound-context";

interface OutboundConnectorDefinition {
    name: string;
    type: string;
    inputVariables: string[]
}

const metadata = {
    name: "connector:name",
    type: "connector:type",
    inputVariables: "connector:inputVariables"
}

/**
 * OutboundConnector class decorator
 * @param constructor 
 */
export function OutboundConnector(definition: OutboundConnectorDefinition) {
    return (constructor: Function) => {
        Reflect.defineMetadata(metadata.name, definition.name, constructor)
        Reflect.defineMetadata(metadata.type, definition.type, constructor)
        Reflect.defineMetadata(metadata.inputVariables, definition.inputVariables ? definition.inputVariables.join(",") : undefined, constructor)
    }
}

export abstract class OutboundConnectorFunction {
    abstract execute(context: OutboundConnectorContext): Promise<{[key:string]: any}> | {[key: string]: any} | void
}

export function getOutboundConnectorDescription(connector: Function): OutboundConnectorDefinition {
    const name = Reflect.getMetadata(metadata.name, connector)
    const type = Reflect.getMetadata(metadata.type, connector)
    const inputVariables = (Reflect.getMetadata(metadata.inputVariables, connector) || '').split(',').filter((k: string) => k !== '')
    return {
        name,
        type,
        inputVariables
    }
}