/**
 * Browser Plugin Module
 *
 * An extension for the Specify Core which adds Cucumber step definitions and
 * support code facilitating tests which need to interact with a web browser.
 */

import path from "node:path";

export default {
    "cucumber": {
        "import": [path.resolve(import.meta.dirname, "cucumber/register/register.js")],
    },
};
