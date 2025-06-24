import alignAssigments from "./rules/align-assignments";
import alignImports    from "./rules/align-imports";

export default {
    "extends": ["plugin:eslint/recommended"],
    "rules": {
        /* eslint-disable @typescript-eslint/naming-convention */
        "align-assignments": alignAssigments,
        "align-imports": alignImports,
    },
};
