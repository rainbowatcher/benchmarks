import fsAsync from "node:fs/promises"
import path from "node:path"
import type { Dirent } from "node:fs"

type SearchOptions = {
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
 * @returns The resolved path or null if there's an error.
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
 * @returns The path if it's a directory to be searched, null otherwise.
 */
async function processFileSystemEntry(entryPath: string, entry: Dirent, context: SearchContext): Promise<string | undefined> {
    try {
        if (entry.isSymbolicLink()) {
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
 * Processes a single directory, collecting subdirectories and matching files.
 * @param dirPath - The path of the directory to process.
 * @param context - The search context.
 * @returns An array of subdirectory paths to be searched.
 */
async function processDirectory(dirPath: string, context: SearchContext): Promise<string[]> {
    try {
        const entries = await fsAsync.readdir(dirPath, { withFileTypes: true })

        const processingPromises = entries.map((entry) => {
            const entryPath = path.join(dirPath, entry.name)
            return processFileSystemEntry(entryPath, entry, context)
        })

        const results = await Promise.all(processingPromises)
        return results.filter((result): result is string => result !== undefined)
    } catch (error) {
        if (!context.options.ignoreErrors) context.errors.push(error as Error)
        return []
    }
}

/**
 * Recursively searches a batch of directories.
 * @param dirs - An array of directory paths to search.
 * @param context - The search context.
 */
async function searchDirectories(dirs: string[], context: SearchContext): Promise<void> {
    if (context.currentDepth > context.options.maxDepth) return

    const subDirPromises = dirs.map(dir => processDirectory(dir, context))
    const subDirs = await Promise.all(subDirPromises)

    if (subDirs.length > 0) {
        context.currentDepth++
        await searchDirectories(subDirs.flat(), context)
    }
}

/**
 * Asynchronously searches for files with a specific name within a directory and its subdirectories.
 * @param rootDir - The root directory to start the search from.
 * @param fileName - The name of the file to search for.
 * @param options - Search options (optional).
 * @returns A promise that resolves to an array of matched file paths.
 * @throws AggregateError if errors occur during the search and ignoreErrors is false.
 */
export async function searchFileAsync2(rootDir: string, fileName: string, options: SearchOptions = {}): Promise<string[]> {
    const context: SearchContext = {
        currentDepth: 0,
        errors: [],
        fileName,
        matchedFiles: [],
        options: {
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
