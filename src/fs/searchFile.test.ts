import { fs, vol } from "memfs"
import {
    describe, expect, it, vi,
} from "vitest"
import {
    searchFileAsync, searchFileAsync1, searchFileAsyncFg, searchFileAsyncTg, searchFileSync, searchFileSyncFg, searchFileSyncTg,
} from "./searchFile"
import { searchFileAsync2 } from "./searchFile2"
import { searchFileAsync3 } from "./searchFile3"

const dir = "/path/to/dir/"
const fileToSearch = "package.json"

vi.mock("node:fs")
vi.mock("node:fs/promises")

// eslint-disable-next-line ts/unbound-method
const mfs = { readdir: fs.readdir, readdirSync: fs.readdirSync }

describe("searchFile", () => {
    // afterEach(() => {
    //     vol.reset()
    // })

    const nested = {
        [dir]: {
            child_0: { "package.json": "" },
            child_1: { "package.json": "" },
            child_10: { "package.json": "" },
            child_2: { "package.json": "" },
            child_3: { "package.json": "" },
            child_4: { "package.json": "" },
            child_5: { "package.json": "" },
            child_6: { "package.json": "" },
            child_7: { "package.json": "" },
            child_8: { "package.json": "" },
            child_9: { "package.json": "" },
            "package.json": "",
            packages: {
                child_0: { "package.json": "" },
                child_1: { "package.json": "" },
                child_10: { "package.json": "" },
                child_2: { "package.json": "" },
                child_3: { "package.json": "" },
                child_4: { "package.json": "" },
                child_5: { "package.json": "" },
                child_6: { "package.json": "" },
                child_7: { "package.json": "" },
                child_8: { "package.json": "" },
                child_9: { "package.json": "" },
                nested: {
                    child_0: { "package.json": "" },
                    child_1: { "package.json": "" },
                    child_10: { "package.json": "" },
                    child_2: { "package.json": "" },
                    child_3: { "package.json": "" },
                    child_4: { "package.json": "" },
                    child_5: { "package.json": "" },
                    child_6: { "package.json": "" },
                    child_7: { "package.json": "" },
                    child_8: { "package.json": "" },
                    child_9: { "package.json": "" },
                },
            },
        },
    }
    const expected = [
        "/path/to/dir/child_0/package.json",
        "/path/to/dir/child_1/package.json",
        "/path/to/dir/child_10/package.json",
        "/path/to/dir/child_2/package.json",
        "/path/to/dir/child_3/package.json",
        "/path/to/dir/child_4/package.json",
        "/path/to/dir/child_5/package.json",
        "/path/to/dir/child_6/package.json",
        "/path/to/dir/child_7/package.json",
        "/path/to/dir/child_8/package.json",
        "/path/to/dir/child_9/package.json",
        "/path/to/dir/package.json",
        "/path/to/dir/packages/child_0/package.json",
        "/path/to/dir/packages/child_1/package.json",
        "/path/to/dir/packages/child_10/package.json",
        "/path/to/dir/packages/child_2/package.json",
        "/path/to/dir/packages/child_3/package.json",
        "/path/to/dir/packages/child_4/package.json",
        "/path/to/dir/packages/child_5/package.json",
        "/path/to/dir/packages/child_6/package.json",
        "/path/to/dir/packages/child_7/package.json",
        "/path/to/dir/packages/child_8/package.json",
        "/path/to/dir/packages/child_9/package.json",
        "/path/to/dir/packages/nested/child_0/package.json",
        "/path/to/dir/packages/nested/child_1/package.json",
        "/path/to/dir/packages/nested/child_10/package.json",
        "/path/to/dir/packages/nested/child_2/package.json",
        "/path/to/dir/packages/nested/child_3/package.json",
        "/path/to/dir/packages/nested/child_4/package.json",
        "/path/to/dir/packages/nested/child_5/package.json",
        "/path/to/dir/packages/nested/child_6/package.json",
        "/path/to/dir/packages/nested/child_7/package.json",
        "/path/to/dir/packages/nested/child_8/package.json",
        "/path/to/dir/packages/nested/child_9/package.json",
    ]

    vol.fromNestedJSON(nested)

    it("searchFileSync", () => {
        expect(searchFileSync(dir, fileToSearch).sort()).toStrictEqual(expected)
    })

    it("searchFileAsync", async () => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        expect((await searchFileAsync(dir, fileToSearch)).sort()).toStrictEqual(expected)
    })

    it("searchFileAsync1", async () => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        expect((await searchFileAsync1(dir, fileToSearch)).sort()).toStrictEqual(expected)
    })

    it("searchFileAsync2", async () => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        expect((await searchFileAsync2(dir, fileToSearch)).sort()).toStrictEqual(expected)
    })

    it("searchFileAsync3", async () => {
        // eslint-disable-next-line unicorn/no-await-expression-member
        expect((await searchFileAsync3(dir, fileToSearch)).sort()).toStrictEqual(expected)
    })

    it("searchFileSyncFg", () => {
        // @ts-expect-error type missmatch
        expect(searchFileSyncFg(dir, fileToSearch, mfs).sort()).toStrictEqual(expected)
    })

    it("searchFileAsyncFg", async () => {
        // @ts-expect-error type missmatch
        const arr = await searchFileAsyncFg(dir, fileToSearch, mfs)
        expect(arr.sort()).toStrictEqual(expected)
    })
})
