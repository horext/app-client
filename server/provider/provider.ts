
export function createLazySingleton<T, C>(creator: (ctx: C) => T) {
    let instance: T | null = null;

    return (ctx: C): T => {
        if (instance !== null) {
            return instance;
        }

        instance = creator(ctx);
        return instance;
    };
}