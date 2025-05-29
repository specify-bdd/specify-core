#!/usr/bin/env node

// wrapper to silence install warnings about the bin target not existing prior to a build

import process from "node:process";
import { error } from "node:console";

import("../dist/main.js").catch((err) => {
    error("Executable hasn't been built yet:", err.message);

    process.exit(1);
});
