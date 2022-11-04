const notnull = "connector:notnull"

export function NotNull(target: any, propertyKey: string) {
    const requiredKeys = JSON.parse(Reflect.getMetadata(notnull, target) ?? '[]')
    requiredKeys.push(propertyKey)
    Reflect.defineMetadata(notnull, JSON.stringify(requiredKeys), target)
}

export function getRequiredKeys(target: any): string[] {
    const requiredKeys = Reflect.getMetadata(notnull, target) ?? '[]'
    return JSON.parse(requiredKeys)
}