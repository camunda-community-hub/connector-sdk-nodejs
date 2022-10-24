import * as ZB from "zeebe-node";
import { JSONDoc } from "zeebe-node";
import { EnvironmentSecretStore, isSecret } from "./secret";
import { getRequiredKeys } from "./validation";

type ReplaceSecretImplementation = (key: string) => string | undefined;

export function createOutboundConnectorContext() {
    return new OutboundConnectorContext({job: {variables: {}} as any})
}

export class OutboundConnectorContext {
  variables: Readonly<ZB.IInputVariables>;
    private replaceSecretImplementation: ReplaceSecretImplementation;

  constructor({
    job,
    replaceSecretImplementation
  }: {
    job?: ZB.ZeebeJob;
    replaceSecretImplementation?: ReplaceSecretImplementation;
  }) {
    this.variables = job?.variables || {};
    this.replaceSecretImplementation = replaceSecretImplementation || EnvironmentSecretStore;
  }

  replaceSecrets<T extends { [key: string]: any }>(variables: T) {
    // @TODO - parse deep
    Object.keys(variables).forEach((key) => {
      if (isSecret(variables, key)) {
        (variables as any)[key] = this.replaceSecretImplementation(variables[key])
      }
    });
    return variables;
  }

  getVariablesAsType<T>(constructor: new () => T) {
    // @TODO - parse deep, to not reassign objects.
    // This is required to make sure that secret annotations are preserved in-depth
    const vars = new constructor();
    Object.keys(this.variables).forEach(
      (key) => ((vars as any)[key] = this.variables[key])
    );
    return vars
  }

  validate<T extends {[key: string]: any}>(vars: T) {
    const requiredKeys = getRequiredKeys(vars)
    const errors = requiredKeys.reduce((prev, curr) => {
      const isMissingKey = !vars[curr]
      return isMissingKey ? [...prev, curr] : prev
    }, [] as string[])
    if (errors.length > 0) {
      throw new Error(`Missing required variables: ${JSON.stringify(errors)}`) 
    }
    return true
  }

  setVariables(vars: JSONDoc) {
    this.variables = vars
  }
}
