export type LazySingletonCreator<T, C> = (ctx: C) => T

export function createLazySingleton<T, C>(
    creator: LazySingletonCreator<T, C>,
): (ctx: C) => T {
    let instance: T | null = null

    return (ctx: C): T => {
        if (instance !== null) {
            return instance
        }

        instance = creator(ctx)
        return instance
    }
}
