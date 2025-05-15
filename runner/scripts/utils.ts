/**
 * Utils script for generic utility functions.
 */

import { Project } from "ts-morph";
import path from "node:path";
import ts from "typescript";

import type { SourceFile } from "ts-morph";

const __dirname = new URL(".", import.meta.url).pathname;

export type InterfaceExportOptions = {
    output_file: string;
};

/**
 * Generates a interface type definition export for the given glob pattern with
 * the specified interface name.
 *
 * @param interfaceName - Name of the interface to generate.
 * @param glob          - Glob pattern to match files.
 * @param opts          - Options for the export.
 *
 * @returns The generated interface export.
 *
 * @example
 * ```ts
 * import { generateInterfaceTypeExport } from "./utils";
 *
 * generateInterfaceTypeExport(
 *     "MyInterface",
 *     "./config/*.ts",
 * );
 *
 * // This will generate output with the following content:
 * // export interface MyInterface {
 * //   config1: import("./file1").Config1;
 * //   config2: import("./file2").Config2;
 * //   ...
 * // }
 * ```
 */
export const generateInterfaceTypeExport = (
    interface_name: string,
    source_files: SourceFile[],
    opts?: InterfaceExportOptions,
): string => {
    const entries: string[] = [];

    for (const file of source_files) {
        const alias_map = new Map(
            file.getTypeAliases().map((alias) => [alias.getName(), alias]),
        );

        for (const [name, declarations] of file.getExportedDeclarations()) {
            const var_declarations = declarations.filter((declaration) => {
                return declaration.getKindName() === "VariableDeclaration";
            });

            for (const declaration of var_declarations) {
                const var_declaration = declaration.asKindOrThrow(
                    ts.SyntaxKind.VariableDeclaration,
                );

                const type_node = var_declaration.getTypeNode();

                let type_text: string;

                if (type_node) {
                    const type_name = type_node.getText();

                    if (alias_map.has(type_name)) {
                        const output_path =
                            opts?.output_file ||
                            path.resolve(
                                __dirname,
                                "..",
                                "types",
                                "index.d.ts",
                            );

                        const import_path = getRelativeSourceFileImportPath(
                            file,
                            output_path,
                        );

                        type_text = `import("${import_path}").${type_name}`;
                    } else {
                        type_text = type_name;
                    }
                }

                entries.push(`    ${name}: ${type_text};`);
            }
        }
    }

    const output = `export interface ${interface_name} {
${entries.join("\n")}
}
`;

    return output;
};

/**
 * Gets the import path of a source file relative to the given output path.
 *
 * @param source_file - The source file to get the relative path for.
 * @param output_path - The path to the output file.
 *
 * @returns The relative path to the source file from the output path.
 */
export const getRelativeSourceFileImportPath = (
    source_file: SourceFile,
    output_path: string,
): string => {
    // import paths are relative to the output path
    let import_path = path
        .relative(path.dirname(output_path), source_file.getFilePath())
        .replace(/\.ts$/, "") // remove the .ts extension
        .replace(/\\/g, "/"); // convert backslashes to forward slashes

    if (!import_path.startsWith(".")) {
        import_path = "./" + import_path;
    }

    return import_path;
};

/**
 * Gets the source files from the given glob pattern.
 *
 * @param glob - The glob pattern to match files.
 *
 * @returns An array of source files matching the glob pattern.
 */
export const getSourceFilesFromGlob = (glob: string): SourceFile[] => {
    const project = new Project();

    project.addSourceFilesAtPaths(glob);

    return project.getSourceFiles();
};
