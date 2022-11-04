import { getOutboundConnectorDescription, OutboundConnectorFunction } from "camunda-connector-sdk";
import { IWorkerConnectorRuntime } from "../lib/ConnectorRuntime";

export class ConnectorRuntimeMock implements IWorkerConnectorRuntime {
    outboundConnectors: Array<new() => OutboundConnectorFunction> = [];
    addOutboundConnector(connector: new (...args: any[]) => OutboundConnectorFunction): void {
        this.outboundConnectors.push(connector);
    }
    removeOutboundConnector(name: string): void {
        throw new Error("Method not implemented.");
    }
    extractMetadata(){
        return getOutboundConnectorDescription(this.outboundConnectors[0])
    }
}
