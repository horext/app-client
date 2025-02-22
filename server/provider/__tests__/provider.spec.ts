import { describe, it, expect } from 'vitest';
import { createLazySingleton } from '../provider';

describe('createLazySingleton', () => {
    it('should create a singleton instance', () => {
        const creator = (ctx: number) => ({ value: ctx });
        const getInstance = createLazySingleton(creator);

        const instance1 = getInstance(1);
        const instance2 = getInstance(2);

        expect(instance1).toBe(instance2);
        expect(instance1.value).toBe(1);
        expect(instance2.value).toBe(1);
    });

    it('should call the creator function only once', () => {
        let callCount = 0;
        const creator = (ctx: number) => {
            callCount++;
            return { value: ctx };
        };
        const getInstance = createLazySingleton(creator);

        getInstance(1);
        getInstance(2);

        expect(callCount).toBe(1);
    });

    it('should return the same instance for different contexts', () => {
        const creator = (ctx: number) => ({ value: ctx });
        const getInstance = createLazySingleton(creator);

        const instance1 = getInstance(1);
        const instance2 = getInstance(2);

        expect(instance1).toBe(instance2);
    });

    it('should create a singleton instance with promises', async () => {
        const creator = async (ctx: number) => ({ value: ctx });
        const getInstance = createLazySingleton(creator);

        const instance1 = await getInstance(1);
        const instance2 = await getInstance(2);

        expect(instance1).toBe(instance2);
        expect(instance1.value).toBe(1);
        expect(instance2.value).toBe(1);
    });

    it('should call the async creator function only once', async () => {
        let callCount = 0;
        const creator = async (ctx: number) => {
            callCount++;
            return Promise.resolve({ value: ctx });
        };
        const getInstance = createLazySingleton(creator);

        await getInstance(1);
        await getInstance(2);

        expect(callCount).toBe(1);
    });

    it('should return the same instance for different contexts with promises', async () => {
        const creator = async (ctx: number) => (
            Promise.resolve({ value: ctx })
        );
        const getInstance = createLazySingleton(creator);

        const instance1 = await getInstance(1);
        const instance2 = await getInstance(2);

        expect(instance1).toBe(instance2);
    });

    it('should return the same instance when called parallelly with promises', async () => {
        let callCount = 0;
        const creator = async (ctx: number) =>
            new Promise<{ value: number }>((resolve) => {
                setTimeout(() => {
                    callCount++;
                    resolve({ value: ctx });
                }, 100);
            });

        const getInstance = createLazySingleton(creator);
        const promises = [getInstance(1), getInstance(2)];

        const [instance1, instance2] = await Promise.all(promises);

        expect(instance1).toBe(instance2);

        expect(callCount).toBe(1);
    })

    it('should return the same instance when called after resolve the promise', async () => {
        console.time('🔄 Creator Function');
        console.time('📦 Result Value');
        console.time('⏳ Delayed Instance');
        console.time('✨ First Instance');
        let callCount = 0;
        const creator = async (ctx: number) => {
            console.timeLog('🔄 Creator Function', `Starting with context: ${ctx}`);
            const result = await new Promise<{ value: number; }>((resolve) => {
                setTimeout(() => {
                    callCount++;
                    console.timeLog('🔄 Creator Function', `Resolving with context: ${ctx}`);
                    resolve({ value: ctx });
                }, 300);
            });
            console.timeLog('📦 Result Value', `Created object: { value: ${result.value} }`);
            return result;
        };
        const delayedInstance = () => new Promise<{
            value: number;
        }>((resolve) => {
            setTimeout(async () => {
                console.timeLog('⏳ Delayed Instance', 'Waiting for instance with context: 2');
                const instance = await getInstance(2);
                console.timeLog('⏳ Delayed Instance', 'Received: { value: 2 }');
                resolve(instance);
            }, 200);
        });
        const getInstance = createLazySingleton(creator);


        let instance1
        let instance2
        console.timeLog('✨ First Instance', 'Requesting instance with context: 1');
        await Promise.all([
            getInstance(1).then((instance) => {
                console.timeLog('✨ First Instance', `Received: { value: ${instance.value} }`);
                instance1 = instance;
            }),
            delayedInstance().then((instance) => {
                instance2 = instance;
            })
        ]);

        expect(instance1).toBe(instance2);
        expect(callCount).toBe(1);

        console.timeEnd('🔄 Creator Function');
        console.timeEnd('📦 Result Value');
        console.timeEnd('⏳ Delayed Instance');
        console.timeEnd('✨ First Instance');
    })
});