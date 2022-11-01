import { OutboundConnectorFunction } from "camunda-connector-sdk"
import { IWorkerConnectorRuntime } from "../lib/ConnectorRuntime"
import { ConnectorScanner } from "../lib/ConnectorScanner"

class ConnectorRuntimeMock implements IWorkerConnectorRuntime {
    outboundConnectors: Set<OutboundConnectorFunction> = new Set()
    addOutboundConnector(connector: new (...args: any[]) => OutboundConnectorFunction): void {
        this.outboundConnectors.add(new connector())
    }
    removeOutboundConnector(name: string): void {
        throw new Error("Method not implemented.")
    }

}

test('ConnectorScanner can detect and load connectors', () => {
    const runtime = new ConnectorRuntimeMock()
    const s = new ConnectorScanner({
        dir: `${process.cwd()}/src/__test__/connectors`,
        runtime 
    })
    s.scan()
    expect(s.seenConnectors.has('camunda-8-connector-openweather-api')).toBe(true)
    expect(runtime.outboundConnectors.size).toBe(1)
})