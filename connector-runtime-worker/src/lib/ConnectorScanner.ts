import { IWorkerConnectorRuntime } from "./ConnectorRuntime";
import fs from "fs"

interface IConnectorScannerConfig {
    dir: string;
    runtime: IWorkerConnectorRuntime
}

export class ConnectorScanner {
    dir: string;
    runtime: IWorkerConnectorRuntime;
    seenConnectors: Set<string> = new Set();

    constructor(config: IConnectorScannerConfig) {
        this.dir = config.dir
        this.runtime = config.runtime
        module.paths.push(this.dir)
    }

    scan() {
        // scan a directory to find connectors
        const pkgFile = `${this.dir}/package.json`
        const exists = fs.existsSync(pkgFile);
        if (exists) {
            const pkg = JSON.parse(fs.readFileSync(pkgFile).toString())
            const deps: {[key: string]: string} = pkg.dependencies
            Object.keys(deps).forEach(key => {
                const code = require(`${this.dir}/node_modules/${key}`)
                const connector = code.Connector
                this.runtime.addOutboundConnector(connector)
                this.seenConnectors.add(key)
            })
        }
    }
}