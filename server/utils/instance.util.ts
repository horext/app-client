export function getInstance<T>(instance: T | null, createInstance: () => T): T {
    if (instance) {
        return instance
    }
    return createInstance()
}
