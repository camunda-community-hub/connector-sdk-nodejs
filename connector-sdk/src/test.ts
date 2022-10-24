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
        // do some business logic
        
        // any return value is added to the process variables
        return { done: true }
    }
}


const f = new myFunction()
const context = new OutboundConnectorContext({})
context.setVariables({auth: "secrets.LOGNAME", lat: "33"})
const v = context.getVariablesAsType(Data)
console.log('v.auth', v.auth)
context.replaceSecrets(v)

console.log('v.auth', v.auth)
// context.validate(v)

const d = new Data()
// console.log(Data.toString())

console.log(Reflect.getMetadataKeys(d))

console.log(Reflect.getMetadataKeys(Data))

const e= new BPMNError('This is a BPMN Error')

console.log(e.toString())
console.log(e instanceof BPMNError)