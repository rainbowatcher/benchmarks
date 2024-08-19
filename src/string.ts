/* eslint-disable unicorn/prefer-spread */
export function stringReduce(times: number) {
    const str: string[] = []
    for (let i = 0; i < times; i++) {
        str.push("A")
    }
    // eslint-disable-next-line unicorn/no-array-reduce
    return str.reduce((pre, next) => `${pre}\n${next}`)
}

export function stringAppend(times: number) {
    let str = ""
    for (let i = 0; i < times; i++) {
        str += "A"
        str += "\n"
    }
    return str
}

export function arrayJoin(times: number) {
    const str: string[] = []
    for (let i = 0; i < times; i++) {
        str.push("A")
    }
    return str.join("\n")
}

export function stringConcat(times: number) {
    let str = ""
    for (let i = 0; i < times; i++) {
        str = str.concat("A")
        str = str.concat("\n")
    }
    return str
}
