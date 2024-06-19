import { describe, test, expect } from 'vitest';
import { Wheel, WeightedWheel, Weighted } from './random.ts'

describe('infinite wheel', () => {
    const values = ['A', 'D', 'E', 'M', 'R']

    test('returns items from the list', () => {
        const wheel = new Wheel(values)
        for (let i = 0; i < values.length; i++) {
            expect(wheel.getItem() in values)
        }
    })

    test('returns more items than the list size', () => {
        const wheel = new Wheel(values)
        for (let i = 0; i < values.length * 5; i++) {
            expect(wheel.getItem() in values)
        }
    })

    test('returns items with close frequency', () => {
        const wheel = new Wheel(values)
        const counts = new Map(values.map(item => [item, 0]))
        const scale = 10_000

        for (let i = 0; i < scale * values.length; i++) {
            const value = wheel.getItem()
            counts.set(value, counts.get(value)! + 1)
        }

        for (let [_, count] of counts) {
            expect(count / scale).toBeCloseTo(1, 1)
        }
    })
})

describe('wheel producing distinct values', () => {
    const values = ['A', 'D', 'E', 'M', 'R']

    test('returns at most N items', () => {
        const wheel = new Wheel(values, {distinct: true})
        values.forEach(_ => wheel.getItem())

        expect(() => wheel.getItem()).toThrow(RangeError)
    })

    test('each value returned once', () => {
        const wheel = new Wheel(values, {distinct: true})
        const returned = values.map(_ => wheel.getItem())
        expect(returned.sort()).toEqual(values.sort())
    })

    test("doesn't change the original list", () => {
        const original_length = values.length
        const wheel = new Wheel(values, {distinct: true})
        values.forEach(_ => wheel.getItem())

        expect(values.length).toEqual(original_length)
    })
})

describe('Weighted Wheel', () => {

    const values: Weighted<'D'|'C'>[] = [['D', 1], ['C', 99]]

    test('returns items with proportional frequency', () => {
        const wheel = new WeightedWheel(values)
        const counts = new Map(values.map(item => [item[0], 0]))
        const num_generations = 10_000

        for (let i = 0; i < num_generations; i++) {
            const value = wheel.getItem()
            counts.set(value, counts.get(value)! + 1)
        }

        expect(counts.get('D')! / num_generations).toBeCloseTo(0.01)
        expect(counts.get('C')! / num_generations).toBeCloseTo(0.99)

    })
})
