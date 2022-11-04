import "reflect-metadata";

export type ReplaceSecretImplementation = (key: string) => string | undefined;

const secret = "connector:secret"

export function Secret(target: any, propertyKey: string) {
    Reflect.defineMetadata(secret, "true", target, propertyKey)
}

export function isSecret(target: any, propertyKey: string) {
    return Reflect.getMetadata(secret, target, propertyKey) === "true"
}

export const EnvironmentSecretStore: ReplaceSecretImplementation = (key: string) => key.indexOf("secrets.") === 0 ? process.env[key.replace("secrets.", "")] : key