import { IWorkerConnectorRuntime } from "./ConnectorRuntime";
import fs from "fs"
import { log } from "./log";

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
        log(`Scanning for: ${pkgFile}`)
        const exists = fs.existsSync(pkgFile);
        if (!exists) {
            log(`File not found.`)
        }
        log(`Found package.json`)
        const pkg = JSON.parse(fs.readFileSync(pkgFile).toString())
        const deps: {[key: string]: string} = pkg.dependencies
        Object.keys(deps).forEach(key => {
            const packagePath = `${this.dir}/node_modules/${key}`
            log(`Loading ${key} from ${packagePath}`)
            const code = require(packagePath)
            const connector = code.Connector
            this.runtime.addOutboundConnector(connector)
            this.seenConnectors.add(key)
        })
    
    }
}