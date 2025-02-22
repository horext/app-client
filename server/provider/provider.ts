export type LazySingleton<T, C> = (ctx: C) => T
export type LazySingletonCreator<T, C> = (ctx: C) => T

export function createLazySingleton<T, C>(
    creator: LazySingletonCreator<T, C>,
): LazySingleton<T, C> {
    let instance: T | null = null

    return (ctx: C): T => {
        if (instance !== null) {
            return instance
        }

        instance = creator(ctx)
        return instance
    }
}
