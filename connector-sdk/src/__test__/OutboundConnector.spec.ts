import {Secret, OutboundConnector, OutboundConnectorFunction, OutboundConnectorContext, NotNull} from '../index'
import { getOutboundConnectorDescription } from '../outbound'

class Data {
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
class MyFunction implements OutboundConnectorFunction {
    execute(context: OutboundConnectorContext) {
        const vars = context.getVariablesAsType(Data)
        context.validate(vars)
        context.replaceSecrets(vars)
        return { vars }
    }
}

test('getOutboundConnectorDescription correctly retrieves Connector metadata', () => {
    const md = getOutboundConnectorDescription(MyFunction)
    expect(md.name).toEqual('Test Connector')
    expect(md.type).toEqual('io.camunda:connector-1')
    expect(md.inputVariables).toEqual('auth,lat,long,mightbe')
})