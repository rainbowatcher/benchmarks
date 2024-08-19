import { bench, describe } from "vitest"
import {
    arrayJoin,
    stringAppend,
    stringConcat,
    stringReduce,
} from "./string"

describe.each([
    { round: 1000 },
    { round: 10_000 },
    { round: 100_000 },
])("string append for round: $round", ({ round }) => {
    bench("String Apppend", () => {
        stringAppend(round)
    })

    bench("Array Join", () => {
        arrayJoin(round)
    })

    bench("String Concat", () => {
        stringConcat(round)
    })

    bench("Array Reduce", () => {
        stringReduce(round)
    })
})
