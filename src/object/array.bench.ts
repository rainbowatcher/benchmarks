import { bench, describe } from "vitest"
import {
    forOf,
    fromEntriesMap,
    getItems,
    reduceAssignMap,
    reduceImmer,
    reduceImmutable,
    reduceImmutableWithMutation,
    reduceMutate,
    reduceObjectAssign,
    reduceSpread,
} from "./array"

const groups = [
    { num: 100 },
    { num: 1000 },
    { num: 10_000 },
]

describe.each(groups)("$num", () => {
    bench("reduceAssignMap", () => { reduceAssignMap(getItems(10)) })
    bench("reduceAssignMap", () => { reduceAssignMap(getItems(10)) })
    bench("reduceImmer", () => { reduceImmer(getItems(10)) })
    bench("reduceImmutable", () => { reduceImmutable(getItems(10)) })
    bench("reduceImmutableWithMutation", () => { reduceImmutableWithMutation(getItems(10)) })
    bench("reduceSpread", () => { reduceSpread(getItems(10)) })
    bench("reduceMutate", () => { reduceMutate(getItems(10)) })
    bench("reduceObjectAssign", () => { reduceObjectAssign(getItems(10)) })
    bench("fromEntriesMap", () => { fromEntriesMap(getItems(10)) })
    bench("forOf", () => { forOf(getItems(10)) })
})
