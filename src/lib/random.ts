
export type Weighted<T> = [T, number]

export class WeightedWheel<T> {
    wheel: { item: T, weight: number }[]
    total: number
    options: { distinct: boolean }

    constructor(values: Weighted<T>[], options = {}) {
        this.wheel = values.map(value => ({ item: value[0], weight: value[1] }))
        this.total = this.wheel.reduce((total, item) => total + item.weight, 0)
        this.options = {
            distinct: false,
            ...options
        }
    }

    getItem() {
        if (this.wheel.length == 0) {
            throw new RangeError("Not enough values");
        }
        const random = Math.random() * this.total
        const last_index = this.wheel.length - 1
        let i = 0;
        let weight = 0;
        while (i < this.wheel.length && weight < random) {
            weight += this.wheel[i].weight;
            i += 1;
        }
        i -= 1

        const item = this.wheel[i].item

        if (this.options.distinct) {
            const last = this.wheel.pop()
            if (last && i < last_index) {
                this.wheel[i] = last
            }
        }

        return item
    }
}

export class Wheel<T> extends WeightedWheel<T> {
    constructor(values: T[], options = {}) {
        super(values.map(item => [item, 1]), options)
    }
}

export function random_item<T>(items: T[]) {
    return items[Math.floor(Math.random() * items.length)]
}

export function shuffle<T>(items: T[]) {
    const array = [...items]
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
