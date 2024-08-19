import { produce } from "immer"
import { Map } from "immutable"
import _ from "lodash"

// ref to: <https://gist.github.com/snapwich/7604b2d827f320e470a07e088e0293f3>
type Item = {
    name: `city${number}`
    visited: boolean
}

export function getItems(count: number) {
    let id = 1
    // eslint-disable-next-line ts/no-unsafe-return
    return _.times<Item>(count, () => ({
        name: `city${id++}`,
        visited: true,
    }))
}

export function assert(val: boolean) {
    if (!val) {
        console.log("assertion failed")
        throw new Error("assertion failed")
    }
}

export function reduceSpread(items: Item[]) {
    const initial = {}
    // eslint-disable-next-line unicorn/no-array-reduce
    const result = items.reduce((accumulator, item) => ({
        ...accumulator,
        [item.name]: item.visited,
    }), initial)
    assert(Object.keys(result).length === items.length)
    assert(Object.keys(initial).length === 0)
}

export function reduceObjectAssign(items: Item[]) {
    const initial = {}
    // eslint-disable-next-line unicorn/no-array-reduce
    const result = items.reduce(
        (accumulator, item) => Object.assign({}, accumulator, { [item.name]: item.visited }),
        initial,
    )
    assert(Object.keys(result).length === items.length)
    assert(Object.keys(initial).length === 0)
}

export function reduceMutate(items: Item[]) {
    const initial = {}
    // eslint-disable-next-line unicorn/no-array-reduce
    const result = items.reduce<Record<string, boolean>>((accumulator, item) => {
        accumulator[item.name] = item.visited
        return accumulator
    }, initial)
    assert(Object.keys(result).length === items.length)
    assert(Object.keys(initial).length === items.length) // mutated
}

export function reduceAssignMap(items: Item[]) {
    const result = Object.assign(
        {},
        ...items.map(i => ({
            [i.name]: i.visited,
        })),
    )
    assert(Object.keys(result).length === items.length)
}

export function fromEntriesMap(items: Item[]) {
    const entries = items.map(({ name, visited }) => [name, visited])
    const result = Object.fromEntries(entries)
    assert(Object.keys(result).length === items.length)
}

export function reduceImmutable(items: Item[]) {
    const initial = Map<string, boolean>({
        city0: true,
    })
    // eslint-disable-next-line unicorn/no-array-reduce
    const result = items.reduce((accumulator, item) => {
        // eslint-disable-next-line ts/no-unsafe-return
        return accumulator.set(item.name, item.visited)
    }, initial)
    assert(result.size === items.length + 1)
    assert(initial.size === 1) // not mutated
}

export function reduceImmutableWithMutation(items: Item[]) {
    const initial = Map<string, boolean>({
        city0: true,
    })
    const result = initial.withMutations((initial) => {
        // eslint-disable-next-line ts/no-unsafe-return, unicorn/no-array-reduce
        return items.reduce(
            // eslint-disable-next-line ts/no-unsafe-return
            (accumulator, item) => accumulator.set(item.name, item.visited),
            initial,
        )
    })
    assert(result.size === items.length + 1)
    assert(initial.size === 1) // not mutated
}

export function reduceImmer(items: Item[]) {
    const initial: Record<string, boolean> = {
        city0: true,
    }
    const result = produce(initial, (initial) => {
        // eslint-disable-next-line unicorn/no-array-reduce
        return items.reduce<Record<string, boolean>>(
            (accumulator, item) => {
                accumulator[item.name] = item.visited
                return accumulator
            },
            initial,
        )
    })
    assert(Object.keys(result).length === items.length + 1)
    assert(Object.keys(initial).length === 1) // not mutated
}

export function forOf(items: Item[]) {
    const result: Record<string, boolean> = {}
    for (const item of items) {
        result[item.name] = item.visited
    }
    assert(Object.keys(result).length === items.length)
}
