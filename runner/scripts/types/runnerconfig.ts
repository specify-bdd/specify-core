/**
 * Generates the RunnerConfig type definition file.
 */

import path from "path";
import {
    generateInterfaceTypeExport,
    getSourceFilesFromGlob,
} from "@/scripts/utils";

import type { InterfaceExportOptions } from "@/scripts/utils";

const __dirname = new URL(".", import.meta.url).pathname;
const CONFIGS_GLOB = path.resolve(
    __dirname,
    "..",
    "..",
    "config",
    "*.config.ts",
);

export const generateTypeExport = (opts: InterfaceExportOptions): string =>
    generateInterfaceTypeExport(
        "RunnerConfig",
        getSourceFilesFromGlob(CONFIGS_GLOB),
        opts,
    );
