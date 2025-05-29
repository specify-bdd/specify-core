import { Rule } from "eslint";
import { log } from "console";

log("testing eslint-plugin/rules/align-assignments.ts");

export default {
    "meta": {
        "name": "align-assignments",
        "type": "problem",
        "fixable": "whitespace",
        "docs": {
            "description":
                "Align the '=' sign in adjacent variable assignments",
            "category": "Stylistic Issues",
        },
    },
    create(context: Rule.RuleContext): Rule.RuleListener {
        return {
            VariableDeclaration(node) {
                // const nodeIndex = context.sourceCode.getDeclaredVariables(node.parent).indexOf(node.declarations);
                // log("VariableDeclaration node:", node.type, "Index:", nodeIndex);

                context.report({
                    node,
                    "message":
                        "Align the '=' sign in adjacent variable assignments.",
                    fix(fixer) {
                        // Log inside the fix function to see if it is triggered
                        // log("Inside fix for node:", node);
                        // get the previous node to align with
                        // const previousNode = context.sourceCode
                        //     .getDeclaredVariables(node.parent)
                        //     .findIndex((n) => node.name === "foo")?.defs[0].node;

                        // log(previousNode);
                        // log("Previous node:", context.sourceCode.getText(previousNode));
                        fixAlignments(context.sourceCode.getText(node));
                        return fixer.replaceText(node, "kitty"); // formattedCode would be your desired aligned output
                    },
                });
            },

            // AssignmentExpression(node) {
            //     log("AssignmentExpression node:", node);

            //     context.report({
            //         node,
            //         "message":
            //             "Align the '=' sign in adjacent variable assignments.",
            //         fix(fixer) {
            //             // Log inside the fix function to see if it is triggered
            //             log("Inside fix for node:", node);
            //             return fixer.replaceText(node, "kitty"); // formattedCode would be your desired aligned output
            //         },
            //     });
            // },
        };
    },
};

function fixAlignments(code: string): string {
    // this function needs to change this:
    // const foo = 1;
    // const binbaz = 2;
    // to this:
    // const foo    = 1;
    // const binbaz = 2;

    //log(code);
    return code;
}
