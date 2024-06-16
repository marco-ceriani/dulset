
interface WheelItem {
    index: number
    weight: number
}

export class Wheel<T> {
    values: T[]
    wheel: WheelItem[]
    total: number
    options: { distinct: boolean }

    constructor(values: T[], options={}) {
        this.values = values
        this.wheel = values.map((_, i) => ({index: i, weight: 1}))
        this.total = this.wheel.reduce((t, item) => t + item.weight, 0)
        this.options = {
            distinct : false,
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

        const index = this.wheel[i].index
        const item = this.values[index]

        if (this.options.distinct) {
            const last = this.wheel.pop()
            if (last && i < last_index) {
                this.wheel[i] = last
            }
        }

        return item
    }
}

