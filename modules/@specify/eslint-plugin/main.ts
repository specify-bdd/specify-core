import alignAssigments from "./rules/align-assignments";

export default {
    "extends": ["plugin:eslint/recommended"],
    "rules": {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "align-assignments": alignAssigments,
    },
};
