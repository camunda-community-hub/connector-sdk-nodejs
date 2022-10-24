import {Secret, OutboundConnector, OutboundConnectorFunction, OutboundConnectorContext, NotNull, BPMNError} from './index'

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
class myFunction implements OutboundConnectorFunction {
    execute(context: OutboundConnectorContext) {
        const vars = context.getVariablesAsType(Data)
        context.validate(vars)
        context.replaceSecrets(vars)
        return { vars }
    }
}

beforeAll(() => {
    process.env.__LLCOOLJJ__ = "A_SECRET"
})
test('testing', () => {
    const context = new OutboundConnectorContext({})
    context.setVariables({auth: "secrets.__LLCOOLJJ__", lat: "33"})
    const v = context.getVariablesAsType(Data)

    expect(true).toBe(true)
})