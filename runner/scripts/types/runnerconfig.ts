/**
 * Generates the RunnerConfig type definition file.
 */

import path from "path";
import {
    generateInterfaceTypeExport,
    getSourceFilesFromGlob,
} from "@/scripts/utils";

import type { InterfaceExportOptions } from "@/scripts/utils";

const CONFIGS_GLOB = path.resolve(
    import.meta.dirname,
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
