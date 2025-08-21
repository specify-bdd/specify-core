import alignAssigments from "./rules/align-assignments";
import alignImports    from "./rules/align-imports";
import alignProperties from "./rules/align-properties";

export default {
    "extends": ["plugin:eslint/recommended"],
    "rules":   {
        /* eslint-disable @typescript-eslint/naming-convention */
        "align-assignments": alignAssigments,
        "align-imports":     alignImports,
        "align-properties":  alignProperties,
    },
};
