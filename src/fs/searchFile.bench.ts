import { fs, vol, Volume } from "memfs"
import {
    afterEach, bench, describe, vi,
} from "vitest"
import {
    searchFileAsync, searchFileAsync1, searchFileAsyncFg, searchFileAsyncGlobby, searchFileAsyncTg, searchFileSync, searchFileSyncFg,
    searchFileSyncGlobby, searchFileSyncTg,
} from "./searchFile"
import { searchFileAsync2 } from "./searchFile2"
import { searchFileAsync3 } from "./searchFile3"

const dir = "/path/to/dir/"
const fileToSearch = "package.json"
// eslint-disable-next-line ts/unbound-method
const mfs = { readdir: fs.readdir, readdirSync: fs.readdirSync }
vi.mock("node:fs")
vi.mock("node:fs/promises")

const fsJsonSimple = {
    [dir]: {
        "package.json": "",
        packages: {
            "package.json": "",
        },
    },
}
const fsJson = {
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

describe.each([
    { json: fsJson },
    { json: fsJsonSimple },
])("searchFile complex", ({ json }) => {

    vol.fromNestedJSON(json)

    bench("fs", () => {
        searchFileSync(dir, fileToSearch)
    })

    bench("fs/promises", async () => {
        await searchFileAsync(dir, fileToSearch)
    })

    bench("fs/promises1", async () => {
        await searchFileAsync1(dir, fileToSearch)
    })

    bench("fs/promises2", async () => {
        await searchFileAsync2(dir, fileToSearch)
    })

    bench("fs/promises3", async () => {
        await searchFileAsync3(dir, fileToSearch)
    })

    bench("fast-glob Sync", () => {
        // @ts-expect-error type missmatch
        searchFileSyncFg(dir, fileToSearch, mfs)
    })

    bench("fast-glob Async", async () => {
        // @ts-expect-error type missmatch
        await searchFileAsyncFg(dir, fileToSearch, mfs)
    })

    bench("globby Sync", () => {
        // @ts-expect-error type missmatch
        searchFileSyncGlobby(dir, fileToSearch, mfs)
    })

    bench("globby Async", async () => {
        // @ts-expect-error type missmatch
        await searchFileAsyncGlobby(dir, fileToSearch, mfs)
    })
})
