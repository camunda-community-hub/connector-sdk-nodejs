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

@OutboundConnector({
    name: "Test Connector",
    type: "io.camunda:connector-1",
})
class MyNoVarsFunction implements OutboundConnectorFunction {
    execute(context: OutboundConnectorContext) {
        const vars = context.getVariablesAsType(Data)
        context.validate(vars)
        return { vars }
    }
}

test('getOutboundConnectorDescription correctly retrieves Connector metadata', () => {
    const md = getOutboundConnectorDescription(MyFunction)
    expect(md.name).toEqual('Test Connector')
    expect(md.type).toEqual('io.camunda:connector-1')
    expect(Array.isArray(md.inputVariables)).toBe(true)
    expect(md.inputVariables?.length).toBe(4)
    expect(md.inputVariables?.includes('auth')).toBe(true)
    expect(md.inputVariables?.includes('lat')).toBe(true)
    expect(md.inputVariables?.includes('long')).toBe(true)
    expect(md.inputVariables?.includes('mightbe')).toBe(true)
})

test('getOutboundConnectorDescription returns array when ', () => {
    const md = getOutboundConnectorDescription(MyNoVarsFunction)
    expect(md.name).toEqual('Test Connector')
    expect(md.type).toEqual('io.camunda:connector-1')
    expect(Array.isArray(md.inputVariables)).toBe(true)
    expect(md.inputVariables?.length).toBe(0)
})