/**
 * Utils script for generic utility functions.
 */

import { Project } from "ts-morph";
import path from "node:path";
import ts from "typescript";

const __dirname = new URL(".", import.meta.url).pathname;

export type InterfaceExportOptions = {
    output_file: string;
};

/**
 * Generates a interface type definition export for the given glob pattern with
 * the specified interface name.
 *
 * @param interfaceName - Name of the interface to generate
 * @param glob          - Glob pattern to match files
 *
 * @returns The path to the generated file.
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
    glob: string,
    opts?: InterfaceExportOptions,
): string => {
    const project = new Project();
    const entries: string[] = [];

    project.addSourceFilesAtPaths(glob);

    const output_path =
        opts?.output_file ||
        path.resolve(__dirname, "..", "types", "index.d.ts");

    for (const file of project.getSourceFiles()) {
        let import_path = path
            .relative(path.dirname(output_path), file.getFilePath())
            .replace(/\.ts$/, "") // remove the .ts extension
            .replace(/\\/g, "/"); // convert backslashes to forward slashes

        if (!import_path.startsWith(".")) {
            import_path = "./" + import_path;
        }

        const exports = file.getExportedDeclarations();
        const alias_map = new Map(
            file.getTypeAliases().map((alias) => [alias.getName(), alias]),
        );

        for (const [name, declarations] of exports) {
            if (name === "default") {
                continue;
            }

            for (const declaration of declarations) {
                if (declaration.getKindName() !== "VariableDeclaration") {
                    continue;
                }

                const var_declaration = declaration.asKindOrThrow(
                    ts.SyntaxKind.VariableDeclaration,
                );

                const type_node = var_declaration.getTypeNode();

                let type_text: string;

                if (type_node) {
                    const typeName = type_node.getText();

                    if (alias_map.has(typeName)) {
                        type_text = `import("${import_path}").${typeName}`;
                    } else {
                        type_text = typeName;
                    }
                }

                entries.push(`  ${name}: ${type_text};`);
            }
        }
    }

    const output = `export interface ${interface_name} {
${entries.join("\n")}
}
`;

    return output;
};
