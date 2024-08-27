import { bench, describe } from "vitest"

describe.each([
    { path: String.raw`\path\to\dir` },
    { path: String.raw`\path\to\dir\long\long\long\long\long\long\long\long\long\long\extra` },
])("replace", ({ path }) => {

    bench("replaceAll", () => {
        path.replaceAll(/[/\\]+/g, "/")
    })

    bench("split join", () => {
        path.split(/[/\\]+/).join("/")
    })
})
