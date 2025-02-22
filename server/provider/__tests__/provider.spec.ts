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
        let callCount = 0;
        const creator = async (ctx: number) => {
            console.timeLog('creator', ctx);
            const result = await new Promise<{ value: number; }>((resolve) => {
                setTimeout(() => {
                    console.log('resolve', ctx);
                    callCount++;
                    resolve({ value: ctx });
                }, 300);
            });
            console.timeLog('result', result);
            return result;
        };

        const getInstance = createLazySingleton(creator);

        const delayedInstance = new Promise((resolve) => {
            setTimeout(() => {
                console.timeLog('delayedInstance');
                resolve(getInstance(2));
            }, 100);
        });
        let instance1
        getInstance(1).then((instance) => {
            console.timeLog('instance', instance);
            instance1 = instance;
        });
        const instance2 = await delayedInstance;

        expect(instance1).toBe(instance2);

        expect(callCount).toBe(1);
    })
});