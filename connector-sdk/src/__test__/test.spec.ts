import {Secret, OutboundConnector, OutboundConnectorFunction, OutboundConnectorContext, NotNull, BPMNError} from '../index'

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


test('OutboundConnectorContext.replaceSecrets replaces secrets from environment by default', () => {
    process.env.__LLCOOLJJ__ = "A_SECRET"
    const context = new OutboundConnectorContext({})
    context.setVariables({auth: "secrets.__LLCOOLJJ__", lat: "33"})
    const v = context.getVariablesAsType(Data)
    context.replaceSecrets(v)
    expect(v.auth).toEqual("A_SECRET")
    delete process.env.__LLCOOLJJ__
})

test('OutboundConnectorContext.replaceSecrets uses a custom replaceSecretImplementation when one is provided', () => {
    const context = new OutboundConnectorContext({
        replaceSecretImplementation: () => "hardcoded"
    })
    context.setVariables({auth: "secrets.anyKey", lat: "33"})
    const v = context.getVariablesAsType(Data)
    context.replaceSecrets(v)
    expect(v.auth).toEqual("hardcoded")
})

test('OutboundConnectorContext.validate will throw if a required variable is missing', () => {
    const context = new OutboundConnectorContext({})
    context.setVariables({auth: "secrets.anyKey", lat: "33"})
    const v = context.getVariablesAsType(Data)
    let err: string = ""
    try {
        context.validate(v)
    } catch (e: any) {
        err = e.message
    }
    expect(err).toEqual(`Missing required variables: ["long"]`)
})

test('OutboundConnectorContext.validate will not throw if all required variables are present', () => {
    const context = new OutboundConnectorContext({})
    context.setVariables({auth: "secrets.anyKey", lat: "33", long: "45"})
    const v = context.getVariablesAsType(Data)
    let err: string = ""
    try {
        context.validate(v)
    } catch (e: any) {
        err = e.message
    }
    expect(err).toEqual("")
})