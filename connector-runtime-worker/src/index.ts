import { ZBClient } from "zeebe-node"
import { WorkerConnectorRuntime } from "./lib/ConnectorRuntime"
import { ConnectorScanner } from "./lib/ConnectorScanner"
import { log } from "./lib/log"

export { WorkerConnectorRuntime } from "./lib/ConnectorRuntime"
export { ConnectorScanner } from "./lib/ConnectorScanner"

if (process.env.CONNECTOR_RUNTIME_AUTOSTART === "TRUE") {
    const dir = process.env.CONNECTOR_RUNTIME_SCANDIR || "/opt/connectors"
    log(`Running with scan directory: ${dir}`)
    log("Process environment:")
    log(process.env)
    const zbc = new ZBClient()
    const runtime = new WorkerConnectorRuntime(zbc)
    const scanner = new ConnectorScanner({
        dir,
        runtime,
    })
    scanner.scan()
}