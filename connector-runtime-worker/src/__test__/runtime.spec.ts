import { NotNull, Secret, OutboundConnector, OutboundConnectorFunction, OutboundConnectorContext } from "camunda-connector-sdk";
import { IZBClientMock, IZBWorkerMock, ICreateWorkerSig, WorkerConnectorRuntime } from "../lib/ConnectorRuntime";

class ZBClientMock implements IZBClientMock {
    workers: ZBWorkerMock[] = []
    createWorker(arg: ICreateWorkerSig){
        const w = new ZBWorkerMock(arg)
        this.workers.push(w)
        return w
    }
}

class ZBWorkerMock implements IZBWorkerMock {
    fetchVariable: string[];
    taskHandler: Function;
    taskType: string;
    constructor(arg: ICreateWorkerSig) {
        this.fetchVariable = arg.fetchVariable
        this.taskHandler = arg.taskHandler
        this.taskType = arg.taskType
    }

    async close() {
        return
    }

    triggerTaskHandler(job: {variables: any}) {
        return this.taskHandler(job)
    }
}

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
class Connector implements OutboundConnectorFunction {
    execute(context: OutboundConnectorContext) {
        const vars = context.getVariablesAsType(Data)
        return { connectorCalledWith: vars }
    }
}

test('', async () => {
    const zbc = new ZBClientMock()
    const r = new WorkerConnectorRuntime(zbc)
    await r.addOutboundConnector(Connector)
    expect(zbc.workers.length).toBe(1)
    const job = {
        complete: (res: any) => res,
        fail: () => { throw new Error('Should not fail') },
        variables: {
            lat: 22,
            lon: 34,
            auth: 'secrets.API_KEY'
        }

    }
    const res = zbc.workers[0].triggerTaskHandler(job)
    expect(res.connectorCalledWith?.lat).toBe(22)
})