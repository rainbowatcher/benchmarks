import { promises as fsAsync } from "node:fs"
import os from "node:os"
import path from "node:path"
import type { Dirent } from "node:fs"

type SearchOptions = {
    concurrency?: number
    followSymlinks?: boolean
    ignoreErrors?: boolean
    maxDepth?: number
}

type SearchContext = {
    currentDepth: number
    errors: Error[]
    fileName: string
    matchedFiles: string[]
    options: Required<SearchOptions>
}

/**
 * Resolves a symbolic link to its target path.
 * @param linkPath - The path of the symbolic link.
 * @param context - The search context.
 * @returns The resolved path or undefined if there's an error.
 */
async function resolveSymlink(linkPath: string, context: SearchContext): Promise<string | undefined> {
    if (!context.options.followSymlinks) return
    try {
        const targetPath = await fsAsync.readlink(linkPath)
        return path.resolve(path.dirname(linkPath), targetPath)
    } catch (error) {
        if (!context.options.ignoreErrors) context.errors.push(error as Error)
        return
    }
}

/**
 * Processes a single file system entry.
 * @param entryPath - The path of the entry.
 * @param entry - The file system entry.
 * @param context - The search context.
 * @returns The path if it's a directory to be searched, undefined otherwise.
 */
async function processFileSystemEntry(entryPath: string, entry: Dirent, context: SearchContext): Promise<string | undefined> {
    try {
        if (entry.isSymbolicLink() && context.options.followSymlinks) {
            const resolvedPath = await resolveSymlink(entryPath, context)
            if (!resolvedPath) return
            const stat = await fsAsync.stat(resolvedPath)
            if (stat.isDirectory()) return resolvedPath
            if (path.basename(resolvedPath).endsWith(context.fileName)) {
                context.matchedFiles.push(resolvedPath)
            }
        } else if (entry.isDirectory()) {
            return entryPath
        } else if (entry.name.endsWith(context.fileName)) {
            context.matchedFiles.push(entryPath)
        }
    } catch (error) {
        if (!context.options.ignoreErrors) context.errors.push(error as Error)
    }
    return
}

/**
 * Processes a batch of entries from a directory.
 * @param entries - Array of directory entries.
 * @param basePath - Base path of the directory.
 * @param context - The search context.
 * @returns An array of subdirectory paths to be searched.
 */
async function processBatch(entries: Dirent[], basePath: string, context: SearchContext): Promise<string[]> {
    const processingPromises = entries.map(entry => processFileSystemEntry(path.join(basePath, entry.name), entry, context))
    // eslint-disable-next-line unicorn/no-await-expression-member
    return (await Promise.all(processingPromises)).filter((result): result is string => result !== undefined)
}

/**
 * Processes a single directory, collecting subdirectories and matching files.
 * @param dirPath - The path of the directory to process.
 * @param context - The search context.
 * @returns An array of subdirectory paths to be searched.
 */
async function processDirectory(dirPath: string, context: SearchContext): Promise<string[]> {
    try {
        const entries = await fsAsync.readdir(dirPath, { withFileTypes: true })
        const batchSize = 100 // Adjust this value based on your system's capabilities
        const subDirs: string[] = []

        for (let i = 0; i < entries.length; i += batchSize) {
            const batch = entries.slice(i, i + batchSize)
            const batchResults = await processBatch(batch, dirPath, context)
            subDirs.push(...batchResults)
        }

        return subDirs
    } catch (error) {
        if (!context.options.ignoreErrors) context.errors.push(error as Error)
        return []
    }
}

/**
 * Recursively searches a batch of directories.
 * @param directories - An array of directory paths to search.
 * @param context - The search context.
 */
async function searchDirectories(directories: string[], context: SearchContext): Promise<void> {
    if (context.currentDepth > context.options.maxDepth) return

    const { concurrency } = context.options
    const chunks = chunkArray(directories, concurrency)

    const promises: Array<Promise<void>> = []
    for (const chunk of chunks) {
        const subDirPromises = chunk.map(dir => processDirectory(dir, context))
        promises.push(...subDirPromises.map(async (subDirPromise) => {
            // eslint-disable-next-line unicorn/no-await-expression-member
            const subDirs = (await subDirPromise).flat()
            if (subDirs.length > 0) {
                context.currentDepth++
                await searchDirectories(subDirs, context)
                context.currentDepth--
            }
        }))
    }
    await Promise.all(promises)
}

/**
 * Splits an array into chunks of specified size.
 * @param array - The array to split.
 * @param size - The size of each chunk.
 * @returns An array of chunks.
 */
function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
    }
    return chunks
}

/**
 * Asynchronously searches for files with a specific name within a directory and its subdirectories.
 * @param rootDir - The root directory to start the search from.
 * @param fileName - The name of the file to search for.
 * @param options - Search options (optional).
 * @returns A promise that resolves to an array of matched file paths.
 * @throws AggregateError if errors occur during the search and ignoreErrors is false.
 */
export async function searchFileAsync3(rootDir: string, fileName: string, options: SearchOptions = {}): Promise<string[]> {
    const context: SearchContext = {
        currentDepth: 0,
        errors: [],
        fileName,
        matchedFiles: [],
        options: {
            concurrency: options.concurrency ?? os.cpus().length,
            followSymlinks: options.followSymlinks ?? false,
            ignoreErrors: options.ignoreErrors ?? false,
            maxDepth: options.maxDepth ?? Infinity,
        },
    }

    await searchDirectories([rootDir], context)

    if (context.errors.length > 0 && !context.options.ignoreErrors) {
        throw new AggregateError(context.errors, "Errors occurred during file search")
    }

    return context.matchedFiles
}
