import { readFile, writeFile } from "fs/promises";
import { join                } from "path";

/**
 * Utility class for reading and writing Cucumber rerun files.
 */
export class RerunFile {
    /**
     * Read the contents of a rerun file.
     *
     * @param filepath - The path to the rerun file
     *
     * @returns An array of paths contained in the rerun file
     */
    static async read(filepath: string): Promise<string[]> {
        const contents = await readFile(filepath, { "encoding": "utf8" });

        return contents ? contents.split("\n") : [];
    }

    /**
     * Convert all relative paths in a rerun file to absolute paths based on the given
     * absolute base path.
     *
     * @param rerunFilepath - The path to the rerun file
     * @param basePath  - The absolute base path to use for conversion
     */
    static async makeAbsolute(rerunFilepath: string, basePath: string): Promise<void> {
        const rerunPaths = await RerunFile.read(rerunFilepath);

        const absolutePaths = rerunPaths.map((rerunPath) => {
            const separatorIndex = rerunPath.indexOf(":");
            const featurePath    = rerunPath.slice(0, separatorIndex);
            const fileLines      = rerunPath.slice(separatorIndex);

            return join(basePath, featurePath) + fileLines;
        });

        await writeFile(rerunFilepath, absolutePaths.join("\n"), { "encoding": "utf8" });
    }
}
