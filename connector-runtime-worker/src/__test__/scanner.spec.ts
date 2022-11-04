import { ConnectorScanner } from "../lib/ConnectorScanner"
import { ConnectorRuntimeMock } from "./ConnectorRuntimeMock"

test('ConnectorScanner can detect and load connectors', () => {
    const runtime = new ConnectorRuntimeMock()
    const s = new ConnectorScanner({
        dir: `${process.cwd()}/src/__test__/connectors`,
        runtime 
    })
    s.scan()
    expect(s.seenConnectors.has('camunda-8-connector-openweather-api')).toBe(true)
    expect(runtime.outboundConnectors.length).toBe(1)
})