import alignAssigments from "./rules/align-assignments";

export default {
    "extends": ["eslint:recommended"],
    "rules": {
        "align-assignments": alignAssigments,
    },
};
