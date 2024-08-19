import { expect, test } from "vitest"

test("any to boolean (truthy)", () => {
    expect(Boolean([])).toBe(true)
    expect(Boolean({})).toBe(true)
    expect(Boolean(-1)).toBe(true)
    expect(Boolean(1)).toBe(true)
    expect(Boolean("not empty")).toBe(true)
    expect(Boolean(Symbol())).toBe(true)
})

test("any to boolean (falsy)", () => {
    expect(Boolean(null)).toBe(false)
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(Boolean(undefined)).toBe(false)
    expect(Boolean(false)).toBe(false)
    expect(Boolean(0)).toBe(false)
    expect(Boolean("")).toBe(false)
    expect(Boolean(Number.NaN)).toBe(false)
})
