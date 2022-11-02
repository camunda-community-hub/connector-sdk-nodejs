import { ZBClient, ZBWorker, ZBWorkerTaskHandler } from "zeebe-node";
import { BPMNError, getOutboundConnectorDescription, OutboundConnectorContext, OutboundConnectorFunction } from "camunda-connector-sdk"

type OutboundConnectorCtor = new (...args: any[]) => OutboundConnectorFunction

export interface IZBWorkerMock { close: Function }
export interface ICreateWorkerSig { taskType: string, fetchVariable: string[], taskHandler: ZBWorkerTaskHandler }
type createWorkerMock = (arg: ICreateWorkerSig) => IZBWorkerMock
export interface IZBClientMock { createWorker: createWorkerMock }

export interface IWorkerConnectorRuntime {
    addOutboundConnector(connector: OutboundConnectorCtor): void
    removeOutboundConnector(name: string): void
}

export class WorkerConnectorRuntime implements IWorkerConnectorRuntime {
    zbc: ZBClient | IZBClientMock;
    outboundConnectors: Set<string> = new Set()
    outboundWorkers: { [key: string]: ZBWorker<any, any, any> | IZBWorkerMock }  = {}

    constructor(zbClient: ZBClient | IZBClientMock) {
        this.zbc = zbClient || new ZBClient()
    }

    async addOutboundConnector(connectorConstructor: OutboundConnectorCtor) {
        const md = getOutboundConnectorDescription(connectorConstructor)
        const handler = new connectorConstructor();
        const w = this.zbc.createWorker({
            taskType: md.type,
            fetchVariable: md.inputVariables,
            taskHandler: (job) => {
                const ctx = new OutboundConnectorContext({ job })
                try {
                    return job.complete(handler.execute(ctx) ?? undefined)
                } catch (e: any) {
                    if (e instanceof BPMNError) {
                        return job.error(e.message)
                    }
                    return job.fail(e.message)
                }
            }
        })
        this.outboundWorkers[md.name] = w
        this.outboundConnectors.add(md.name)
    }

    async removeOutboundConnector(name: string) {
        if (this.outboundConnectors.has(name)) {
            return this.outboundWorkers[name].close().then(() => {
                this.outboundConnectors.delete(name)
                delete this.outboundWorkers[name]
            })
        }
    }

    stop(): Promise<any>[] {
        return Object.values(this.outboundWorkers).map(w => w.close())
    }
}