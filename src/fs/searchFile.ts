import fs from "node:fs"
import fsAsync from "node:fs/promises"
import path from "node:path"
import fg from "fast-glob"
import { globby, globbySync } from "globby"
import { glob, globSync } from "tinyglobby"
import type { FileSystemAdapter } from "fast-glob"

export function searchFileSync(dir: string, fileName: string) {
    const searched: string[] = []
    const files = fs.readdirSync(dir, { withFileTypes: true })

    for (const file of files) {
        const filePath = path.resolve(dir, file.name)

        if (file.isDirectory()) {
            const childFiles = searchFileSync(filePath, fileName)
            searched.push(...childFiles)
        } else if (file.name.endsWith(fileName)) {
            searched.push(filePath)
        }
    }
    return searched
}

export async function searchFileAsync(dir: string, fileName: string): Promise<string[]> {
    const searched: string[] = []
    const queue: string[] = [dir]

    while (queue.length > 0) {
        const currentDir = queue.shift()!
        const entries = await fsAsync.readdir(currentDir, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name)

            if (entry.isDirectory()) {
                queue.push(fullPath)
            } else if (entry.name.endsWith(fileName)) {
                searched.push(fullPath)
            }
        }
    }

    return searched
}

export async function searchFileAsync1(dir: string, fileName: string): Promise<string[]> {
    const searched: string[] = []
    const queue: string[] = [dir]
    const processBatch = async (directories: string[]): Promise<void> => {
        const entriesPromises = directories.map(d => fsAsync.readdir(d, { withFileTypes: true }))
        const entriesBatches = await Promise.all(entriesPromises)

        const newDirs: string[] = []
        for (const [index, entries] of entriesBatches.entries()) {
            const currentDir = directories[index]
            for (const entry of entries) {
                const fullPath = path.join(currentDir, entry.name)
                if (entry.isDirectory()) {
                    newDirs.push(fullPath)
                } else if (entry.name.endsWith(fileName)) {
                    searched.push(fullPath)
                }
            }
        }

        if (newDirs.length > 0) {
            await processBatch(newDirs)
        }
    }

    await processBatch(queue)
    return searched
}

export function searchFileSyncFg(dir: string, fileName: string, fs: Partial<FileSystemAdapter> = {}) {
    return fg.sync(`**/${fileName}`, { absolute: true, cwd: dir, fs })
}

export async function searchFileAsyncFg(dir: string, fileName: string, fs: Partial<FileSystemAdapter> = {}) {
    return await fg.async(`**/${fileName}`, { absolute: true, cwd: dir, fs })
}

export function searchFileSyncTg(dir: string, fileName: string) {
    return globSync([`**/${fileName}`], { cwd: dir })
}

export async function searchFileAsyncTg(dir: string, fileName: string) {
    return await glob([`**/${fileName}`], { cwd: dir })
}

export function searchFileSyncGlobby(dir: string, fileName: string, fs: Partial<FileSystemAdapter> = {}) {
    return globbySync(`**/${fileName}`, { cwd: dir, fs })
}

export async function searchFileAsyncGlobby(dir: string, fileName: string, fs: Partial<FileSystemAdapter> = {}) {
    return await globby(`**/${fileName}`, { cwd: dir, fs })
}
